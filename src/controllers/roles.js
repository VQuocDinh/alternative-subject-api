import db from "../models/index.js";

const getRoles = async (req,res)=>{
    try {
        const response = await db.roles.findAll();
        return res.status(200).json({ success: true, data: response });
      } catch (error) {
        return res.status(500).json({
          message: "An error occurred while get roles.",
          error: error.message,
        });
      }
}

export {getRoles}