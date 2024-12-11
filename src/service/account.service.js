import db from '../models/index.js';

class AccountService {
  static async getAccount() {
    try {
      const response = await db.accounts.findAll();
      return response;
    } catch (error) {
      throw new Error('An error occurred while getting accounts.');
    }
  }

  static async createAccount(data) {
    try {
      const response = await db.accounts.create(data);
      return response;
    } catch (error) {
      throw new Error('An error occurred while creating the account.');
    }
  }

  static async updateAccount(id, data) {
    try {
      const response = await db.accounts.update(data, {
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error('An error occurred while updating the account.');
    }
  }

  static async deleteAccount(id) {
    try {
      const response = await db.accounts.destroy({
        where: { id },
      });
      return response;
    } catch (error) {
      throw new Error('An error occurred while deleting the account.');
    }
  }
}

export default AccountService;
