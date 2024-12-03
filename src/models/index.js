const Sequelize = require('sequelize');
const config = require('../config/config.json'); // Cấu hình database của bạn

// Determine the environment (development, test, or production)
const env = process.env.NODE_ENV || 'development';
const configEnv = config[env];

// Initialize Sequelize instance with the correct environment configuration
const sequelize = new Sequelize(configEnv.database, configEnv.username, configEnv.password, {
  host: configEnv.host,
  dialect: configEnv.dialect,
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

const User = require('./auth/user.model.js')(sequelize, Sequelize.DataTypes);
const Roles = require('./auth/role.model.js')(sequelize, Sequelize.DataTypes);
// Add các model vào object db
db.User = User;
db.Roles = Roles;
db.Specialization = Specialization;

db.Doctor = Doctor;
db.Patient = Patient;

db.DoctorSpecialization = DoctorSpecialization;
db.Appointment = Appointment;
db.DoctorAvailability = DoctorAvailability;

db.MedicalRecord = MedicalRecord;
db.VitalSigns = VitalSign;
db.Lab = Lab;
db.MedicalRecordLab = MedicalRecordLab;

db.Medicine = Medicine;
db.DrugInteractions = DrugInteractions;
db.Prescription = Prescription;
db.PrescriptionMedicine = PrescriptionMedicine;

db.MedicationHistory = MedicationHistory;
db.MedicationSchedule = MedicationSchedule;

// Thiết lập quan hệ (associations)
// Medical Record
db.Doctor.hasMany(db.MedicalRecord, {
  foreignKey: 'doctor_id',
  as: 'MedicalRecord',
});
db.MedicalRecord.belongsTo(db.Doctor, {
  foreignKey: 'doctor_id',
  as: 'Doctor',
});
db.Patient.hasMany(db.MedicalRecord, {
  foreignKey: 'patient_id',
  as: 'MedicalRecord',
});
db.MedicalRecord.belongsTo(db.Patient, {
  foreignKey: 'patient_id',
  as: 'Patient',
});

// Associate for Appointment
db.Doctor.hasMany(db.Appointment, {
  foreignKey: 'doctor_id',
  as: 'Appointment',
});
db.Appointment.belongsTo(db.Doctor, {
  foreignKey: 'doctor_id',
  as: 'Doctor',
});
db.Patient.hasMany(db.Appointment, {
  foreignKey: 'patient_id',
  as: 'Appointment',
});
db.Appointment.belongsTo(db.Patient, {
  foreignKey: 'patient_id',
  as: 'Patient',
});

// Associate for DoctorSpecialization
db.Specialization.belongsToMany(db.Doctor, {
  through: 'DoctorSpecialization',
  foreignKey: 'specialization_id',
});
db.Doctor.belongsToMany(db.Specialization, {
  through: 'DoctorSpecialization',
  foreignKey: 'doctor_id',
});

// Associate for Prescription
db.Doctor.hasMany(db.Prescription, {
  foreignKey: 'doctor_id',
  as: 'Prescription',
});
db.Prescription.belongsTo(db.Doctor, {
  through: 'Prescription',
  foreignKey: 'doctor_id',
});
db.MedicalRecord.hasMany(db.Prescription, {
  foreignKey: 'medical_record_id',
  as: 'MedicalRecord',
});
db.Prescription.belongsTo(db.MedicalRecord, {
  foreignKey: 'medical_record_id',
  as: 'MedicalRecord',
});
db.Prescription.belongsToMany(db.Medicine, {
  through: 'PrescriptionMedicine',
  foreignKey: 'prescription_id',
});
db.Medicine.belongsToMany(db.Prescription, {
  through: 'PrescriptionMedicine',
  foreignKey: 'medicine_id',
});

// Associate for Doctor Availability
db.Doctor.hasMany(db.DoctorAvailability, {
  foreignKey: 'doctor_id',
  as: 'DoctorAvailability',
});
db.DoctorAvailability.belongsTo(db.Doctor, {
  foreignKey: 'doctor_id',
  as: 'Doctor',
});
// Lab
db.Lab.belongsToMany(db.MedicalRecord, {
  through: 'MedicalRecordLab',
  foreignKey: 'lab_id',
});
db.MedicalRecord.belongsToMany(db.Lab, {
  through: 'MedicalRecordLab',
  foreignKey: 'medical_record_id',
});

// Associate
db.VitalSigns.belongsTo(db.MedicalRecord, {
  foreignKey: 'medical_record_id',
  as: 'MedicalRecord',
});
db.MedicalRecord.hasMany(db.VitalSigns, {
  foreignKey: 'medical_record_id',
  as: 'VitalSigns',
});

db.MedicationHistory.belongsTo(db.MedicationSchedule);
db.MedicationSchedule.belongsTo(db.PrescriptionMedicine);
db.MedicationSchedule.hasMany(db.MedicationHistory, {
  foreignKey: 'schedule_id',
});

// Synchronize models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alert: true }); // Will alter the table if needed
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database: ', error);
  }
};

// Call the sync function to sync the models
syncDatabase();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
