import mysql from 'mysql2/promise';
import env from 'dotenv';

import db from '../dbConfig.js';

import Teacher from './Teacher.js';
import Activity from './Activity.js';
import Feedback from './Feedback.js';

env.config();

/* -------------------- CREATE DATABASE -------------------- */
/*async function Create_DB() {
    let conn;

    try {
        conn = await mysql.createConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST
        });

        await conn.query(
            `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`
        );

        await conn.end();
    } catch (err) {
        console.warn(err.stack);
    }
}*/

/* -------------------- FOREIGN KEYS -------------------- */
function FK_Config() {

    // ---------- Teacher 1 → N Activity ----------
    Teacher.hasMany(Activity, {
        foreignKey: 'ProfessorId',
        onDelete: 'CASCADE'
    });

    Activity.belongsTo(Teacher, {
        foreignKey: 'ProfessorId'
    });

    // ---------- Activity 1 → N Feedback ----------
    Activity.hasMany(Feedback, {
        foreignKey: 'ActivityId',
        onDelete: 'CASCADE'
    });

    Feedback.belongsTo(Activity, {
        foreignKey: 'ActivityId'
    });

}

/* -------------------- INIT DATABASE -------------------- */
async function DB_Init() {

  FK_Config();

  //await db.authenticate();
  await db.sync({ alter: true });
}

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "MISSING");
export default DB_Init;
