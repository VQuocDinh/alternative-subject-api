import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const registerUser = async (email, password) => {
  const existingUser = await db.staff.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already has an account.');
  }

  const hashedPassword = this.hashPassword(password);
  await db.staff.create({
    email,
    password: hashedPassword,
  });
};

const loginUser = async (email, password) => {
  const user = await db.staff.findOne({
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
    { id: user.staff_id, role: user.role_id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1h' }
  );

  return {
    token,
    role_id: user.role_id,
    staffId: user.staff_id,
  };
};

export { loginUser, registerUser };
