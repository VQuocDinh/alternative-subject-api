import { Sequelize } from "sequelize";

const sequelize = new Sequelize("prms", "root", "Dinh2202", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});


const connection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

export default connection