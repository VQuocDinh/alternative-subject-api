import { SuccessResponse } from '../core/success.response';
import AuthService from '../service/auth/auth.service';

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    new SuccessResponse({
      message: 'Login successfully',
      metadata: result,
    }).send(res);
  }

  async registerUser(req, res, next) {
    const { email, password, roleName } = req.body;
    const result = await AuthService.signUp({ email, password, roleName });
    new SuccessResponse({
      message: 'User registered successfully',
      metadata: result,
    }).send(res);
  }
}

export default new AuthController();
