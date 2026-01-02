
import Teacher from "../entities/Teacher.js";
import LikeOp from "./Operators.js"; // operatorul LIKE (ex: Sequelize.Op.like)
import bcrypt from "bcryptjs";

async function createTeacher(payload) {
  // Map fields from frontend to model
  const teacherData = {
    Name: payload.name,
    Email: payload.email,
  };
  if (payload.password) {
    teacherData.PasswordHash = await bcrypt.hash(payload.password, 10);
  }
  return await Teacher.create(teacherData);
}

async function getTeachers() {
  return await Teacher.findAll();
}

async function getTeacherById(id) {
  return await Teacher.findByPk(id);
}

async function getTeacherByEmail(email) {
  return await Teacher.findOne({ where: { Email: email } });
}

async function deleteTeacher(id) {
  const elem = await Teacher.findByPk(id);
  if (!elem) return null;
  return await elem.destroy();
}

async function updateTeacher(id, data) {
  const elem = await Teacher.findByPk(id);
  if (!elem) return null;
  return await elem.update(data);
}

/*
Ex QueryParams:
http://localhost:9000/api/teachers?name=Ion&email=@gmail.com&take=5&skip=1
*/
async function getTeachersWithFilterAndPagination(filter) {
  if (!filter.take) filter.take = 10;
  if (!filter.skip) filter.skip = 1;

  const whereClause = {};

  if (filter.name) {
    // caută în Name (sau FullName dacă ai alt câmp)
    whereClause.Name = { [LikeOp]: `%${filter.name}%` };
  }

  if (filter.email) {
    whereClause.Email = { [LikeOp]: `%${filter.email}%` };
  }

  return await Teacher.findAndCountAll({
    where: whereClause,
    limit: parseInt(filter.take),
    offset: (parseInt(filter.skip) - 1) * parseInt(filter.take),
  });
}

export {
  createTeacher,
  getTeacherById,
  getTeacherByEmail,
  getTeachers,
  deleteTeacher,
  updateTeacher,
  getTeachersWithFilterAndPagination,
};
