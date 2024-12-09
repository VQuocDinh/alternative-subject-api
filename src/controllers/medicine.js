import { SuccessResponse } from "../core/success.response"
import medicineService from "../service/medicine"

const getAllMedicine = async (req, res, next) => {
    new SuccessResponse({
        message: 'All medicine',
        metadata: await medicineService.getAllMedicine()
    }).send(res)
}

export {getAllMedicine}