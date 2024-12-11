import express from 'express';
import AccountController from '../controllers/account.js';

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
/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update an existing account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account updated successfully
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
const router = express.Router();
router.get('/get', AccountController.getAccount);
router.post('/create', AccountController.createAccount);
router.put('/update/:id', AccountController.updateAccount);
router.delete('/delete/:id', AccountController.deleteAccount);
export default router;
