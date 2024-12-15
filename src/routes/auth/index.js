import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import AuthController from '../../controllers/auth.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for managing authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the new user
 *               password:
 *                 type: string
 *                 description: Password of the new user
 *               roleName:
 *                 type: string
 *                 description: Role name of the new user
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', asyncHandler(AuthController.registerUser));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', asyncHandler(AuthController.login));

export default router;
