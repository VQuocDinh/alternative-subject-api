import * as controllers from '../controllers';
import express from 'express';

/**
 * @swagger
 * /get:
 *   get:
 *     summary: Retrieve account information
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Account data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account data retrieved successfully
 */
const router = express.Router();
router.get('/get', controllers.getAccount);
export default router;
