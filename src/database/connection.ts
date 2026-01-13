import { Sequelize } from "sequelize";

import {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from "./config/config.ts";

const sequelizeConnection: Sequelize = new Sequelize(
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  {
    dialect: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT,
  },
);

const testConnection = async () => {
  try {
    await sequelizeConnection.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

await testConnection();

export default sequelizeConnection;
