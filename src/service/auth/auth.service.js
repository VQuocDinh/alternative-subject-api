'user strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require('./auth.utils');
const { AuthFailureError, BadRequestError } = require('../../core/error.response');
const db = require('../../models');

const createKeyToken = async ({ userId, refreshToken, privateKey, publicKey }) => {
  return await db.KeyToken.create({
    fk_user_id: userId,
    refreshToken,
    privateKey,
    publicKey,
  });
};

const removeKeyTokenByUserId = async (userId) => {
  return await db.KeyToken.destroy({ where: { fk_user_id: userId } });
};

class AuthService {
  static logout = async ({ userId }) => {
    const delKeyStore = await removeKeyTokenByUserId(userId);
    return delKeyStore;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundAccount = await db.Doctor.findOne({
      where: { email },
      include: [
        {
          model: db.Roles,
          as: 'Role',
        },
      ],
    });
    if (!foundAccount) throw new BadRequestError('Email not registered');

    // 2
    const matchPassword = await bcrypt.compare(password, foundAccount.password);
    if (!matchPassword) throw new AuthFailureError('Authentication Error');

    // 3
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        // public key cryptographic standard
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        // public key cryptographic standard
        type: 'pkcs1',
        format: 'pem',
      },
    });

    // 4
    const tokens = await createTokenPair(
      { userId: foundAccount.id, email, role: foundAccount?.Role?.name },
      publicKey,
      privateKey
    );
    await createKeyToken({
      userId: foundAccount.id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      code: 200,
      tokens,
      user: {
        userId: foundAccount.id,
        email: foundAccount.email,
        role: foundAccount.Role?.name,
      },
    };
  };

  static signUp = async ({ email, password, roleName }) => {
    // 1: Check email exist
    const existingAccount = await db.Doctor.findOne({ where: { email } });
    if (existingAccount) {
      throw new BadRequestError('Error: Email already registered!');
    }

    // 2: Hashing password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3: Create new user
    const newUser = await db.Doctor.create({
      email,
      password: passwordHash,
      role_id: roleName ? await getRoleIdByName(roleName) : 1, // Default role_id is 1
    });

    // 4: Generate key pair
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

    // 5: Create token pair
    const tokens = await createTokenPair(
      { userId: newUser.id, email, role: roleName },
      publicKey,
      privateKey
    );

    // 6: Save key token
    await createKeyToken({
      userId: newUser.id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      code: 201,
      user: {
        userId: newUser.id,
        email: newUser.email,
        role: roleName,
      },
      tokens,
    };
  };

  //     // step 1: check username exist
  //     const existingAccount = await getAccountByUsername(username);
  //     if (existingAccount) {
  //         throw new BadRequestError("Error: Username already registered!");
  //     }
  //     // Step 2: hashing password
  //     const passwordHash = await bcrypt.hash(password, 10);

  //     const role = await getRoleByName("customer");
  //     if (!role) {
  //         throw new BadRequestError("Role not found");
  //     }

  //     const newAccount = await createAccount({
  //         userCode: generateUserCode(),
  //         username,
  //         password: passwordHash,
  //         roleId: role.id,
  //     });

  //     if (newAccount) {
  //         // created privateKey, publicKey
  //         // use has private key
  //         // system store public key
  //         // private key use to sync token
  //         // public key use to verify token
  //         const { privateKey, publicKey } = crypto.generateKeyPairSync(
  //             "rsa",
  //             {
  //                 modulusLength: 4096,
  //                 publicKeyEncoding: {
  //                     // public key cryptographic standard
  //                     type: "pkcs1",
  //                     format: "pem",
  //                 },
  //                 privateKeyEncoding: {
  //                     // public key cryptographic standard
  //                     type: "pkcs1",
  //                     format: "pem",
  //                 },
  //             }
  //         );
  //         // if exist handle save to collection KeyStore
  //         const publicKeyString = await createKeyToken({
  //             userCode: newAccount.user_code,
  //             publicKey,
  //             privateKey,
  //         });

  //         if (!publicKeyString) {
  //             throw new BadRequestError("Public key string error");
  //         }

  //         const publicKeyObject = crypto.createPublicKey(publicKeyString);
  //         // create token pair
  //         const tokens = await createTokenPair(
  //             { userCode: newAccount.user_code, username },
  //             publicKeyObject,
  //             privateKey
  //         );

  //         return {
  //             code: 201,
  //             user: getInfoData({
  //                 fields: ["user_code", "username", "is_active", "is_block"],
  //                 object: newAccount,
  //             }),
  //             tokens: tokens,
  //         };
  //     }
  //     return {
  //         code: 201,
  //         metadata: null,
  //     };
  // };
}

const getRoleIdByName = async (roleName) => {
  const role = await db.Roles.findOne({ where: { name: roleName } });
  if (!role) throw new BadRequestError('Role not found');
  return role.id;
};

module.exports = AuthService;
