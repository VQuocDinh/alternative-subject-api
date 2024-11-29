const Sequelize = require('sequelize');
const config = require('../config/config.json'); // Cấu hình database của bạn

// Determine the environment (development, test, or production)
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];

// Initialize Sequelize instance with the correct environment configuration
const sequelize = new Sequelize('prms', 'root', 'tien1234', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

const db = {};

// Import các model cụ thể
const Doctor = require('./actor/doctor.model')(sequelize, Sequelize.DataTypes);
const Patient = require('./actor/patient.model')(sequelize, Sequelize.DataTypes);

const Appointment = require('./appointment/appointment.model')(sequelize);
const DoctorAvailability = require('./appointment/doctorAvailability.model')(
  sequelize,
  Sequelize.DataTypes
);
const VitalSign = require('./medical-records/vitalSign.model')(sequelize, Sequelize.DataTypes);

const MedicalRecord = require('./medical-records/medicalRecord.model')(
  sequelize,
  Sequelize.DataTypes
);
const Lab = require('./medical-records/lab.model')(sequelize, Sequelize.DataTypes);
const MedicalRecordLab = require('./medical-records/medicalRecordLab.model')(sequelize);

const DrugInteractions = require('./prescription/drugInteractions.model')(
  sequelize,
  Sequelize.DataTypes
);
const Medicine = require('./prescription/medicine.model')(sequelize, Sequelize.DataTypes);
const Prescription = require('./prescription/prescription.model')(sequelize, Sequelize.DataTypes);
const PrescriptionMedicine = require('./prescription/prescriptionMedicine.model')(
  sequelize,
  Sequelize.DataTypes
);

const MedicationHistory = require('./schedule/medicationHistory.model')(
  sequelize,
  Sequelize.DataTypes
);
const MedicationSchedule = require('./schedule/medicationSchedule.model')(
  sequelize,
  Sequelize.DataTypes
);

const Specialization = require('./specialization/specialization.model')(
  sequelize,
  Sequelize.DataTypes
);
const DoctorSpecialization = require('./specialization/doctorSpecialization.model')(
  sequelize,
  Sequelize.DataTypes
);

// Add các model vào object db
db.Specialization = Specialization;

db.Doctor = Doctor;
db.Patient = Patient;

db.DoctorSpecialization = DoctorSpecialization;
db.Appointment = Appointment;
db.DoctorAvailability = DoctorAvailability;

db.MedicalRecord = MedicalRecord;
db.VitalSign = VitalSign;
db.Lab = Lab;
db.MedicalRecordLab = MedicalRecordLab;

db.Medicine = Medicine;
db.DrugInteractions = DrugInteractions;
db.Prescription = Prescription;
db.PrescriptionMedicine = PrescriptionMedicine;

db.MedicationHistory = MedicationHistory;
db.MedicationSchedule = MedicationSchedule;

// Synchronize models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Will alter the table if needed
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database: ', error);
  }
};

// Call the sync function to sync the models
syncDatabase();

// Thiết lập quan hệ (associations)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
