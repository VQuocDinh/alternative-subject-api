import db from "../models"

class PatientService {
    async getAll() {
        try {
            const patients = await db.Patient.findAll({
                order: [['updated_at', 'DESC']],
                attributes: {
                    exclude: ['created_at', 'updated_at']
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