import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getTeacherByEmail, createTeacher } from "../dataAccess/TeacherDA.js";

const authRouter = express.Router();

/* REGISTER profesor */
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await getTeacherByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Teacher already exists" });
    }

    const PasswordHash = await bcrypt.hash(password, 10);

    const teacher = await createTeacher({
      Email: email,
      Name: name || "Teacher",
      PasswordHash,
    });

    const { PasswordHash: _, ...safeTeacher } = teacher.dataValues;

    res.status(201).json({ teacher: safeTeacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN profesor */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const teacher = await getTeacherByEmail(email);
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, teacher.PasswordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: teacher.TeacherId, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { PasswordHash, ...safeTeacher } = teacher.dataValues;

    res.status(200).json({
      token,
      teacher: safeTeacher
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
