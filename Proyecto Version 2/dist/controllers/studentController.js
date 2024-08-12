"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentlyEnrolledStudents = exports.getGradeDistribution = exports.getStudentSummary = exports.deleteStudent = exports.checkRutExists = exports.getAllStudents = exports.getStudentById = exports.updateStudent = exports.createStudent = void 0;
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
const Student_1 = require("../entities/Student");
// Utility functions for parsing and formatting dates
const parseDate = (dateString) => {
    const parsedDate = (0, date_fns_1.parse)(dateString, 'dd-MM-yyyy', new Date());
    return (0, date_fns_1.isValid)(parsedDate) ? parsedDate : null;
};
const formatDate = (date) => {
    return (0, date_fns_1.format)(date, 'dd-MM-yyyy');
};
const formatStudent = (student) => {
    if (Array.isArray(student)) {
        return student.map(s => formatStudent(s));
    }
    return Object.assign(Object.assign({}, student), { birthDate: formatDate(student.birthDate), enrollmentDate: student.enrollmentDate ? formatDate(student.enrollmentDate) : null });
};
// Utility function for ID validation
const validateId = (id) => {
    const parsedId = parseInt(id);
    return isNaN(parsedId) ? null : parsedId;
};
// Create a new student
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const _a = req.body, { birthDate, enrollmentDate, emergencyContacts } = _a, otherData = __rest(_a, ["birthDate", "enrollmentDate", "emergencyContacts"]);
        // Validación de fechas
        const parsedBirthDate = parseDate(birthDate);
        const parsedEnrollmentDate = enrollmentDate ? parseDate(enrollmentDate) : null;
        if (!parsedBirthDate) {
            return res.status(400).json({ message: "Formato de fecha de nacimiento inválido. Use DD-MM-YYYY." });
        }
        if (enrollmentDate && !parsedEnrollmentDate) {
            return res.status(400).json({ message: "Formato de fecha de inscripción inválido. Use DD-MM-YYYY." });
        }
        const newStudent = studentRepository.create(Object.assign(Object.assign({}, otherData), { birthDate: parsedBirthDate, enrollmentDate: parsedEnrollmentDate, emergencyContacts: emergencyContacts || [] }));
        const result = yield studentRepository.save(newStudent);
        res.status(201).json(formatStudent(result));
    }
    catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({
            message: "Error al crear el estudiante",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.createStudent = createStudent;
// Update an existing student
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = validateId(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: "ID de estudiante inválido" });
        }
        const updatedData = req.body;
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const student = yield studentRepository.findOne({ where: { id } });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        // Validación de fechas
        if (updatedData.birthDate) {
            const parsedBirthDate = parseDate(updatedData.birthDate);
            if (!parsedBirthDate) {
                return res.status(400).json({ message: "Formato de fecha de nacimiento inválido. Use DD-MM-YYYY." });
            }
            updatedData.birthDate = parsedBirthDate;
        }
        if (updatedData.enrollmentDate) {
            const parsedEnrollmentDate = parseDate(updatedData.enrollmentDate);
            if (!parsedEnrollmentDate) {
                return res.status(400).json({ message: "Formato de fecha de inscripción inválido. Use DD-MM-YYYY." });
            }
            updatedData.enrollmentDate = parsedEnrollmentDate;
        }
        Object.assign(student, updatedData);
        const result = yield studentRepository.save(student);
        res.json(formatStudent(result));
    }
    catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            message: "Error al actualizar el estudiante",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.updateStudent = updateStudent;
// Get a student by ID
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = validateId(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: "ID de estudiante inválido" });
        }
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const student = yield studentRepository.findOne({ where: { id } });
        if (student) {
            res.json(formatStudent(student));
        }
        else {
            res.status(404).json({ message: "Estudiante no encontrado" });
        }
    }
    catch (error) {
        console.error('Error al obtener el estudiante:', error);
        res.status(500).json({ message: "Error al obtener el estudiante" });
    }
});
exports.getStudentById = getStudentById;
// Get all students
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const students = yield studentRepository.find();
        const formattedStudents = formatStudent(students);
        res.json(formattedStudents);
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: "Error al obtener los estudiantes" });
    }
});
exports.getAllStudents = getAllStudents;
// Check if RUT exists
const checkRutExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rut } = req.params;
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const student = yield studentRepository.findOne({ where: { rut } });
        res.json({ exists: !!student });
    }
    catch (error) {
        console.error('Error checking RUT:', error);
        res.status(500).json({ message: "Error al verificar el RUT" });
    }
});
exports.checkRutExists = checkRutExists;
// Delete a student
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = validateId(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: "ID de estudiante inválido" });
        }
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const student = yield studentRepository.findOne({ where: { id } });
        if (!student) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        yield studentRepository.remove(student);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: "Error al eliminar el estudiante" });
    }
});
exports.deleteStudent = deleteStudent;
// Get student summary
const getStudentSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching student summary...');
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const totalStudents = yield studentRepository.count();
        console.log('Total students:', totalStudents);
        const activeStudents = yield studentRepository.count({ where: { isActive: true } });
        console.log('Active students:', activeStudents);
        const studentsWithScholarship = yield studentRepository.count({ where: { hasScholarship: true } });
        console.log('Students with scholarship:', studentsWithScholarship);
        res.json({
            totalStudents,
            activeStudents,
            studentsWithScholarship,
        });
    }
    catch (error) {
        console.error('Error fetching student summary:', error);
        res.status(500).json({ message: "Error al obtener el resumen de estudiantes" });
    }
});
exports.getStudentSummary = getStudentSummary;
// Get grade distribution
const getGradeDistribution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const distribution = yield studentRepository
            .createQueryBuilder("student")
            .select("student.grade", "grade")
            .addSelect("COUNT(*)", "count")
            .groupBy("student.grade")
            .getRawMany();
        const formattedDistribution = distribution.reduce((acc, { grade, count }) => {
            acc[grade] = parseInt(count);
            return acc;
        }, {});
        res.json(formattedDistribution);
    }
    catch (error) {
        console.error('Error fetching grade distribution:', error);
        res.status(500).json({ message: "Error al obtener la distribución por grado" });
    }
});
exports.getGradeDistribution = getGradeDistribution;
// Get recently enrolled students
const getRecentlyEnrolledStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentRepository = (0, typeorm_1.getRepository)(Student_1.Student);
        const recentStudents = yield studentRepository.find({
            order: { enrollmentDate: "DESC" },
            take: 5,
            select: ["id", "firstName", "lastName", "enrollmentDate"],
        });
        res.json(recentStudents);
    }
    catch (error) {
        console.error('Error fetching recently enrolled students:', error);
        res.status(500).json({ message: "Error al obtener los estudiantes recién matriculados" });
    }
});
exports.getRecentlyEnrolledStudents = getRecentlyEnrolledStudents;
