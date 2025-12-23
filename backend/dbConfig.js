import Sequelize from "sequelize";
import env from "dotenv";

env.config();

const db = new Sequelize({
  dialect: process.env.DB_DIALECT || "mysql",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
  define: {
    freezeTableName: true
  }
});

export default db;
