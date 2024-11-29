import db from "../models"

class PatientService {
    async getAll() {
        try {
            const patients = await db.patients.findAll({
                where: { status: 1 },
                order: [['updatedAt', 'DESC']],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            return {
                success: true,
                data: patients
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error getting patients: ' + error.message
            };
        }
    }
}

const patientService = new PatientService();
export default patientService;