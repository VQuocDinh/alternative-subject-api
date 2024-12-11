import doctorService from '../service/doctor.js';
import { SuccessResponse } from '../core/success.response.js';

const getDoctorBySpecialization = async (req, res, next) => {
  const { specialization_id } = req.query;
  new SuccessResponse({
    message: 'All specialization names',
    metadata: await doctorService.getDoctorBySpecialization(specialization_id),
  }).send(res);
};

export { getDoctorBySpecialization };
