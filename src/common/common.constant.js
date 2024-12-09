const ROLE = Object.freeze({
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient',
});

const MEDICAL_RECORD_STATUS = Object.freeze({
  ALL: 'all',
  CREATED: 'created', // Bệnh án được tạo
  REGISTERED: 'registered', // Đăng ký khám bệnh
  NURSE_RECEIVED: 'nurse_received', // Y tá tiếp nhận
  DOCTOR_RECEIVED: 'doctor_received', // Bác sĩ tiếp nhận
  WAITING_LAB: 'waiting_lab', // Chờ xét nghiệm
  WAITING_PAYMENT: 'waiting_payment', // Chờ thanh toán
  COMPLETED: 'completed', // Hoàn thành khám bệnh
});

export { ROLE, MEDICAL_RECORD_STATUS };
