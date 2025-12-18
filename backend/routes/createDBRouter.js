//initializarea bazei de date și crearea tabelelor necesare
import express from "express";
import db from "../dbConfig.js";

let createDbRouter = express.Router();

 createDbRouter.route("/create").get(async (req, res) => {
  try {
    await db.sync({ alter: true });

    res.status(200).json({ message: "database synced (no data lost)" });
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

export default createDbRouter;
