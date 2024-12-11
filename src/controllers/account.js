import { SuccessResponse } from '../core/success.response.js';
import AccountService from '../service/account.service.js';

class AccountController {
  getAccount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccountService.getAccount(),
    }).send(res);
  };

  createAccount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccountService.createAccount(req.body),
    }).send(res);
  };

  updateAccount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccountService.updateAccount(req.params.id, req.body),
    }).send(res);
  };

  deleteAccount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccountService.deleteAccount(req.params.id),
    }).send(res);
  };
}

export default new AccountController();
