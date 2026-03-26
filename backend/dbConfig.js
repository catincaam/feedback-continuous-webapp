import Sequelize from "sequelize";
import env from "dotenv";

env.config();

const db = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    define: {
      freezeTableName: true
    }
  }
);

console.log("DBConfig DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "MISSING");


export default db;
