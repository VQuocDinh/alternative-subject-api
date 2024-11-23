var DataTypes = require("sequelize").DataTypes;
var _patient_records = require("./patient_records");
var _lab_tests = require("./lab_tests");
var _staff = require("./staff");

function initModels(sequelize) {
  var lab_tests = _lab_tests(sequelize, DataTypes);
  var patient_records = _patient_records(sequelize, DataTypes);
  var staff = _staff(sequelize, DataTypes);

  lab_tests.belongsTo(patient_records, { as: "patient_record", foreignKey: "patient_records_id"});
  patient_records.hasMany(lab_tests, { as: "lab_tests", foreignKey: "patient_records_id"});
  lab_tests.belongsTo(staff, { as: "requested_by_staff", foreignKey: "requested_by"});
  staff.hasMany(lab_tests, { as: "lab_tests", foreignKey: "requested_by"});
  lab_tests.belongsTo(staff, { as: "performed_by_staff", foreignKey: "performed_by"});
  staff.hasMany(lab_tests, { as: "performed_by_lab_tests", foreignKey: "performed_by"});

  return {
    lab_tests,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
