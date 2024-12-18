const { SuccessResponse } = require('../core/success.response');
const OAuthService = require('../service/auth/oauth.service');

class OAuthController {
  static async googleLogin(req, res, next) {
    try {
      const { token } = req.body;
      const response = await OAuthService.googleLogin(token);
      new SuccessResponse(response).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async googleCallback(req, res, next) {
    try {
      const { code } = req.query;
      const { tokens, payload } = await OAuthService.exchangeCodeForTokens(code);
      const response = await OAuthService.googleLogin(tokens.id_token);
      res.redirect(
        `http://localhost:8080/login?access_token=${response.tokens.accessToken}&refresh_token=${response.tokens.refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OAuthController;
