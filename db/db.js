import { Sequelize } from "sequelize";
import dotenv from 'dotenv'; 
dotenv.config()

const sequelize = new Sequelize(process.env.DBURL, {
    dialect: 'postgres',
  });


export default sequelize;