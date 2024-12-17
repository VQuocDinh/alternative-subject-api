'use strict';

const db = require('../../models');
const { AuthFailureError, BadRequestError } = require('../../core/error.response');
const { createTokenPair } = require('./auth.utils');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class OAuthService {
  static async oauthLogin({ provider, providerId, accessToken, refreshToken }) {
    // 1. Find the OAuth account
    const oauthAccount = await db.OAuth.findOne({
      where: { provider, provider_id: providerId },
      include: [
        {
          model: db.Patient,
          as: 'Patient',
        },
      ],
    });

    if (!oauthAccount) throw new BadRequestError('OAuth account not registered');

    // 2. Generate key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    // 3. Create token pair
    const tokens = await createTokenPair(
      { userId: oauthAccount.Patient.id, email: oauthAccount.Patient.email },
      publicKey,
      privateKey
    );

    // 4. Save key token
    await db.KeyToken.create({
      fk_user_id: oauthAccount.Patient.id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      code: 200,
      tokens,
      user: {
        userId: oauthAccount.Patient.id,
        email: oauthAccount.Patient.email,
      },
    };
  }

  static async linkOAuthAccount({ patientId, provider, providerId, accessToken, refreshToken }) {
    // 1. Check if the OAuth account already exists
    const existingOAuthAccount = await db.OAuth.findOne({
      where: { provider, provider_id: providerId },
    });

    if (existingOAuthAccount) throw new BadRequestError('OAuth account already linked');

    // 2. Create new OAuth account
    await db.OAuth.create({
      patient_id: patientId,
      provider,
      provider_id: providerId,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return {
      code: 201,
      message: 'OAuth account linked successfully',
    };
  }

  static async googleLogin(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: providerId, email } = payload;

    // Check if the patient already exists
    let patient = await db.Patient.findOne({ where: { email } });
    if (!patient) {
      // Create a new patient if not exists
      patient = await db.Patient.create({ email, full_name: payload.name });
    }

    // Check if the OAuth account already exists
    let oauthAccount = await db.OAuth.findOne({
      where: { provider: 'google', provider_id: providerId },
    });
    if (!oauthAccount) {
      // Create a new OAuth account if not exists
      oauthAccount = await db.OAuth.create({
        patient_id: patient.id,
        provider: 'google',
        provider_id: providerId,
        access_token: idToken,
      });
    }

    // Generate key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    // Create token pair
    const tokens = await createTokenPair(
      { userId: patient.id, email: patient.email },
      publicKey,
      privateKey
    );

    // Save key token
    await db.KeyToken.create({
      fk_user_id: patient.id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      code: 200,
      tokens,
      user: {
        userId: patient.id,
        email: patient.email,
      },
    };
  }

  static async exchangeCodeForTokens(code) {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return { tokens, payload };
  }
}

module.exports = OAuthService;
