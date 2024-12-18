'use strict';

const db = require('../../models');
const { ForbiddenError } = require('../../core/error.response');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');

/**
 * Hàm này thực hiện gửi yêu cầu lấy Google OAuth token dựa trên authorization code nhận được từ client-side.
 * @param {string} code - Authorization code được gửi từ client-side.
 * @returns {Object} - Đối tượng chứa Google OAuth token.
 */
const getOauthGoogleToken = async (code) => {
  const body = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  };
  const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return data;
};

const getGoogleUser = async ({ id_token, access_token }) => {
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    params: {
      access_token,
      alt: 'json',
    },
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  return data;
};

class OAuthService {
  static async googleLogin(code) {
    const data = await getOauthGoogleToken(code);

    const { id_token, access_token } = data; // Lấy ID token và access token từ kết quả trả về
    const googleUser = await getGoogleUser({ id_token, access_token }); // Gửi Google OAuth token để lấy thông tin người dùng từ Google
    if (!googleUser.verified_email) {
      throw new ForbiddenError('Google email not verified');
    }

    // Check if the patient already exists
    let patient = await db.Patient.findOne({ where: { email: googleUser?.email } });
    if (!patient) {
      // Create a new patient if not exists
      patient = await db.Patient.create({
        email: googleUser?.email,
        full_name: googleUser?.name || '',
      });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: patient.id, email: patient.email, type: 'access_token' },
      process.env.AC_PRIVATE_KEY,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: patient.id, email: patient.email, type: 'refresh_token' },
      process.env.RF_PRIVATE_KEY,
      { expiresIn: '100d' }
    );

    return {
      code: 200,
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        userId: patient.id,
        email: patient.email,
      },
    };
  }
}

module.exports = OAuthService;
