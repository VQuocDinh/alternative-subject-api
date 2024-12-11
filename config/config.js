require('dotenv').config();

console.log('user',process.env.USER);
const config = {
  
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  username: 'root',
  dialect: 'mysql',
};

module.exports = config;
