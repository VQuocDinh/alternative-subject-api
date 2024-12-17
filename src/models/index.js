const Sequelize = require('sequelize');
const config = require('../config/config.json'); // Cấu hình database của bạn

const fs = require('fs');
const path = require('path');

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
const Disease = require('../models/disease/disease.model')(sequelize);
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
const Diagnosis = require('./medical-records/diagnosis.model')(sequelize, Sequelize.DataTypes);
const KeyToken = require('./auth/keytoken.model')(sequelize, Sequelize.DataTypes);
const OAuth = require('./auth/oauth.model')(sequelize, Sequelize.DataTypes);

// Add các model vào object db
db.User = User;
db.Roles = Roles;
db.Specialization = Specialization;

db.Doctor = Doctor;
db.Patient = Patient;

db.Disease = Disease;

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

db.Diagnosis = Diagnosis;
db.KeyToken = KeyToken;
db.OAuth = OAuth;

// Thiết lập quan hệ (associations)
db.Roles.hasMany(db.User, {
  foreignKey: 'role_id',
  as: 'User',
});
db.User.belongsTo(db.Roles, {
  foreignKey: 'role_id',
  as: 'Role',
});
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
  through: db.DoctorSpecialization,
  foreignKey: 'specialization_id',
  otherKey: 'doctor_id',
});
db.Doctor.belongsToMany(db.Specialization, {
  through: db.DoctorSpecialization,
  foreignKey: 'doctor_id',
  otherKey: 'specialization_id',
});

// Associate for Prescription
db.Doctor.hasMany(db.Prescription, {
  foreignKey: 'doctor_id',
  as: 'Prescription',
});
db.Prescription.belongsTo(db.Doctor, {
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

// Drug Interactions associations
db.DrugInteractions.belongsTo(db.Medicine, {
  as: 'Medicine1',
  foreignKey: 'medicine_id_1',
});

db.DrugInteractions.belongsTo(db.Medicine, {
  as: 'Medicine2',
  foreignKey: 'medicine_id_2',
});

db.MedicationHistory.belongsTo(db.MedicationSchedule);
db.MedicationSchedule.belongsTo(db.PrescriptionMedicine);
db.MedicationSchedule.hasMany(db.MedicationHistory, {
  foreignKey: 'schedule_id',
});

// Associate for Diagnosis
db.Doctor.hasMany(db.Diagnosis, {
  foreignKey: 'doctor_id',
  as: 'Diagnoses',
});
db.Diagnosis.belongsTo(db.Doctor, {
  foreignKey: 'doctor_id',
  as: 'Doctor',
});
db.MedicalRecord.hasMany(db.Diagnosis, {
  foreignKey: 'medical_record_id',
  as: 'Diagnoses',
});
db.Diagnosis.belongsTo(db.MedicalRecord, {
  foreignKey: 'medical_record_id',
  as: 'MedicalRecord',
});
db.Diagnosis.belongsTo(db.Disease, {
  foreignKey: 'icd10_code',
  targetKey: 'code',
  as: 'Disease',
});

// Associate for KeyToken
db.User.hasMany(db.KeyToken, {
  foreignKey: 'fk_user_id',
  as: 'KeyTokens',
});
db.KeyToken.belongsTo(db.User, {
  foreignKey: 'fk_user_id',
  as: 'User',
});

// Associate Doctor and User
db.User.hasOne(db.Doctor, {
  foreignKey: 'user_id',
  as: 'Doctor',
});
db.Doctor.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'User',
});

// Associate Patient and OAuth
db.Patient.hasMany(db.OAuth, {
  foreignKey: 'patient_id',
  as: 'OAuth',
});
db.OAuth.belongsTo(db.Patient, {
  foreignKey: 'patient_id',
  as: 'Patient',
});
// Hoặc thiết lập trực tiếp
db.Prescription.hasMany(db.PrescriptionMedicine, {
  foreignKey: 'prescription_id',
  as: 'PrescriptionMedicines',
});

db.PrescriptionMedicine.belongsTo(db.Prescription, {
  foreignKey: 'prescription_id',
  as: 'Prescription',
});

db.PrescriptionMedicine.belongsTo(db.Medicine, {
  foreignKey: 'medicine_id',
  as: 'Medicine',
});

db.Medicine.hasMany(db.PrescriptionMedicine, {
  foreignKey: 'medicine_id',
  as: 'PrescriptionMedicines',
});

db.Prescription.belongsToMany(db.Medicine, {
  through: db.PrescriptionMedicine,
  foreignKey: 'prescription_id',
  otherKey: 'medicine_id',
  as: 'Medicines',
});

db.Medicine.belongsToMany(db.Prescription, {
  through: db.PrescriptionMedicine,
  foreignKey: 'medicine_id',
  otherKey: 'prescription_id',
  as: 'Prescriptions',
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

// /**
//  * Import diseases from a JSON file into the database.
//  * @param {string} filePath - Path to the JSON file.
//  * @param {boolean} isArray - Whether the JSON file contains an array of objects.
//  */
// const importDiseases = async (filePath, isArray) => {
//   try {
//     // Read the JSON file
//     const data = JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf-8'));

//     let diseases;
//     if (isArray) {
//       // If the file is an array of objects
//       diseases = data.map((item) => ({
//         code: item.code,
//         name: item.description.split(',')[0], // Extract name from description
//         description: item.description,
//       }));
//     } else {
//       // If the file is an object with key-value pairs
//       diseases = Object.entries(data).map(([code, description]) => ({
//         code,
//         name: description.split(',')[0], // Extract name from description
//         description,
//       }));
//     }

//     // Bulk insert into the database
//     await db.Disease.bulkCreate(diseases, {
//       updateOnDuplicate: ['name', 'description'], // Update existing records if they exist
//     });

//     console.log(`Successfully imported ${diseases.length} diseases.`);
//   } catch (error) {
//     console.error('Error importing diseases:', error);
//   }
// };

// // Example usage
// importDiseases(`${__dirname}/../common/icd10cm_codes_2022.json`, false);

// // Import from the second JSON format
// importDiseases(`${__dirname}/../common/icd10cm_codes_2022-2.json`, true);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
