const db = require('../models');

class MedicineService {
  async getAllMedicine() {
    const medicines = await db.Medicine.findAll();
    return { data: medicines };
  }
}

const medicineService = new MedicineService();
export default medicineService;
