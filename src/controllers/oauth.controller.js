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
}

module.exports = OAuthController;
