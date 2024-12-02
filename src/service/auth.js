import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

class Auth {
  hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  async registerUser(email, password) {
    const existingUser = await db.User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already has an account.');
    }

    const hashedPassword = this.hashPassword(password);
    await db.User.create({
      email,
      password: hashedPassword,
    });
  }

  async loginUser(email, password) {
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('The account is not registered. Please check again.');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    return {
      token,
      roleId: user.role_id,
      userId: user.id,
    };
  }
}

const authService = new Auth();
export default authService;
