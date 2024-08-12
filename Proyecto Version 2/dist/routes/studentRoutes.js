"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const router = (0, express_1.Router)();
// Coloca las rutas específicas primero
router.get('/students/summary', studentController_1.getStudentSummary);
router.get('/students/grade-distribution', studentController_1.getGradeDistribution);
router.get('/students/recently-enrolled', studentController_1.getRecentlyEnrolledStudents);
router.get('/students/check-rut/:rut', studentController_1.checkRutExists);
// Luego, coloca las rutas más generales
router.get('/students', studentController_1.getAllStudents);
router.get('/students/:id', studentController_1.getStudentById);
router.post('/students', studentController_1.createStudent);
router.put('/students/:id', studentController_1.updateStudent);
router.delete('/students/:id', studentController_1.deleteStudent);
exports.default = router;
