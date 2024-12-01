require('dotenv').config();

console.log('user',process.env.USER); // Kiểm tra xem giá trị USER có đúng không
const config = {
  
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  username: 'root',
  dialect: 'mysql',
};

module.exports = config;  // Dùng module.exports cho CommonJS
