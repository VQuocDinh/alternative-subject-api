const express = require('express');
const router = express.Router();
const OAuthController = require('../../controllers/oauth.controller');

// ...existing code...

/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: OAuth authentication
 */

/**
 * @swagger
 * /oauth/google:
 *   get:
 *     summary: Login with Google OAuth
 *     tags: [OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *                 example: "your-google-oauth-token"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/google', OAuthController.googleLogin);

/**
 * @swagger
 * /oauth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Google OAuth authorization code
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/google/callback', OAuthController.googleCallback);

// ...existing code...

module.exports = router;
