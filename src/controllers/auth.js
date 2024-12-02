import authService from '../service/auth.js'

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.registerUser(email, password);
    return res.status(200).json({
      success: true,
      message: "Account registered successfully."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred while registering the account."
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await authService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      ...userData,
      message: "Login is successful."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred while logging in."
    });
  }
};

export { register, login };
