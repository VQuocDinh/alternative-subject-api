import mysql from 'mysql2/promise'
import dotevn from 'dotenv'
dotevn.config()
const connectionConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
    
};

const pool = mysql.createPool(connectionConfig);

export default pool;