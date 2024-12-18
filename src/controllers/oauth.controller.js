const { SuccessResponse } = require('../core/success.response');
const OAuthService = require('../service/auth/oauth.service');

class OAuthController {
  static async googleLogin(req, res, next) {
    const { code } = req.query;
    const response = await OAuthService.googleLogin(code);

    return res.redirect(
      `http://localhost:3000/auth/login/oauth?access_token=${response?.tokens?.accessToken}&refresh_token=${response?.tokens?.refreshToken}&userId=${response?.user?.userId}&email=${response?.user?.email}`
    );
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
