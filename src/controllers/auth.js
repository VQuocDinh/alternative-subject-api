import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await db.staff.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already has an account.",
      });
    }

    const hashedPassword = hashPassword(password);
    await db.staff.create({ email: email, password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Account registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering the account.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.staff.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The account is not registered. Please check again.",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign(
      { id: user.staff_id, role: user.role_id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      token: token,
      role_id: user.role_id,
      staffId: user.staff_id,
      message: "Login is successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in.",
      error: error.message,
    });
  }
};

export { register, login };
