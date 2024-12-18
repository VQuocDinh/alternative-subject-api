import db from '../models/index.js';
const { Op, fn, col } = require('sequelize');

class ReportService {
  getStatistics = async (appointment_date) => {
    const totalPatient = await db.Patient.count();
    const totalDoctor = await db.Doctor.count({
      include: [
        {
          model: db.User,
          as: 'User',
          where: { role_id: 1 },
        },
      ],
    });
    const startOfDay = `${appointment_date} 00:00:00`;
    const endOfDay = `${appointment_date} 23:59:59`;
    const totalAppointmentToday = await db.Appointment.count({
      where: {
        appointment_taken_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    const totalNurse = await db.Doctor.count({
      include: [
        {
          model: db.User,
          as: 'User',
          where: { role_id: 2 },
        },
      ],
    });
    return {
      totalPatient,
      totalAppointmentToday,
      totalDoctor,
      totalNurse,
    };
  };

  getMonthlyVisits = async () => {
      try {
        const currentYear = moment().year();
        const startDate = moment(`${currentYear}-01-01`).startOf('year');
        const endDate = moment(`${currentYear}-12-31`).endOf('year');
  
        const monthlyVisits = await db.MedicalRecord.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            },
          },
          {
            $group: {
              _id: { $month: '$createdAt' },
              visits: { $sum: 1 },
            },
          },
          {
            $project: {
              month: '$_id',
              visits: 1,
              _id: 0,
            },
          },
          {
            $sort: { month: 1 },
          },
        ]);
  
        const formattedData = monthlyVisits.map((item) => ({
          month: `T${item.month}`,
          visits: item.visits,
        }));
  
        res.status(200).json({
          success: true,
          data: formattedData,
        });
      } catch (error) {
        console.error('Error fetching monthly visits:', error);
        res.status(500).json({
          success: false,
          message: 'Không thể lấy dữ liệu thống kê lượt khám theo tháng',
        });
      }
    };
}

export default new ReportService();
