import { SuccessResponse } from '../core/success.response.js';
import db from '../models/index.js';
import reportService from '../service/report.service.js';

const moment = require('moment');

class ReportControlller {
  getStatistics = async (req, res, next) => {
    const { appointment_date } = req.query;

    new SuccessResponse({
      message: 'Medication Report',
      metadata: await reportService.getStatistics(appointment_date),
    }).send(res);
  };

  getMonthlyVisits = async (req, res, next) => {
    new SuccessResponse({
      message: 'Monthly Visits',
      metadata: await reportService.getMonthlyVisits(),
    }).send(res);
  };
}

export default new ReportControlller();
