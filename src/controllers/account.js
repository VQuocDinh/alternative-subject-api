import db from '../models/index.js';

const getAccount = async (req, res) => {
  try {
    const response = await db.accounts.findAll();
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while get accounts.',
      error: error.message,
    });
  }
};
export { getAccount };
