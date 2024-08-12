import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { parse, format, isValid } from 'date-fns';
import { Student } from '../entities/Student';

// Utility functions for parsing and formatting dates
const parseDate = (dateString: string): Date | null => {
  const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate) ? parsedDate : null;
};

const formatDate = (date: Date): string => {
  return format(date, 'dd-MM-yyyy');
};

const formatStudent = (student: Student | Student[]): any => {
  if (Array.isArray(student)) {
    return student.map(s => formatStudent(s));
  }
  return {
    ...student,
    birthDate: formatDate(student.birthDate),
    enrollmentDate: student.enrollmentDate ? formatDate(student.enrollmentDate) : null,
  };
};

// Utility function for ID validation
const validateId = (id: any): number | null => {
  const parsedId = parseInt(id);
  return isNaN(parsedId) ? null : parsedId;
};

// Create a new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const studentRepository = getRepository(Student);
    const { birthDate, enrollmentDate, emergencyContacts, ...otherData } = req.body;

    // Validación de fechas
    const parsedBirthDate = parseDate(birthDate);
    const parsedEnrollmentDate = enrollmentDate ? parseDate(enrollmentDate) : null;

    if (!parsedBirthDate) {
      return res.status(400).json({ message: "Formato de fecha de nacimiento inválido. Use DD-MM-YYYY." });
    }

    if (enrollmentDate && !parsedEnrollmentDate) {
      return res.status(400).json({ message: "Formato de fecha de inscripción inválido. Use DD-MM-YYYY." });
    }

    const newStudent = studentRepository.create({
      ...otherData,
      birthDate: parsedBirthDate,
      enrollmentDate: parsedEnrollmentDate,
      emergencyContacts: emergencyContacts || [],
    });

    const result = await studentRepository.save(newStudent);
    res.status(201).json(formatStudent(result));
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      message: "Error al crear el estudiante",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update an existing student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const updatedData = req.body;
    const studentRepository = getRepository(Student);
    const student = await studentRepository.findOne({ where: { id } });

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

    const result = await studentRepository.save(student);
    res.json(formatStudent(result));
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      message: "Error al actualizar el estudiante",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get a student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const studentRepository = getRepository(Student);
    const student = await studentRepository.findOne({ where: { id } });

    if (student) {
      res.json(formatStudent(student));
    } else {
      res.status(404).json({ message: "Estudiante no encontrado" });
    }
  } catch (error) {
    console.error('Error al obtener el estudiante:', error);
    res.status(500).json({ message: "Error al obtener el estudiante" });
  }
};

// Get all students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const studentRepository = getRepository(Student);
    const students = await studentRepository.find();
    const formattedStudents = formatStudent(students);
    res.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: "Error al obtener los estudiantes" });
  }
};

// Check if RUT exists
export const checkRutExists = async (req: Request, res: Response) => {
  try {
    const { rut } = req.params;
    const studentRepository = getRepository(Student);
    const student = await studentRepository.findOne({ where: { rut } });
    res.json({ exists: !!student });
  } catch (error) {
    console.error('Error checking RUT:', error);
    res.status(500).json({ message: "Error al verificar el RUT" });
  }
};

// Delete a student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = validateId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const studentRepository = getRepository(Student);
    const student = await studentRepository.findOne({ where: { id } });

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    await studentRepository.remove(student);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: "Error al eliminar el estudiante" });
  }
};

// Get student summary
export const getStudentSummary = async (req: Request, res: Response) => {
  try {
    console.log('Fetching student summary...');
    const studentRepository = getRepository(Student);
    const totalStudents = await studentRepository.count();
    console.log('Total students:', totalStudents);
    const activeStudents = await studentRepository.count({ where: { isActive: true } });
    console.log('Active students:', activeStudents);
    const studentsWithScholarship = await studentRepository.count({ where: { hasScholarship: true } });
    console.log('Students with scholarship:', studentsWithScholarship);

    res.json({
      totalStudents,
      activeStudents,
      studentsWithScholarship,
    });
  } catch (error) {
    console.error('Error fetching student summary:', error);
    res.status(500).json({ message: "Error al obtener el resumen de estudiantes" });
  }
};

// Get grade distribution
export const getGradeDistribution = async (req: Request, res: Response) => {
  try {
    const studentRepository = getRepository(Student);
    const distribution = await studentRepository
      .createQueryBuilder("student")
      .select("student.grade", "grade")
      .addSelect("COUNT(*)", "count")
      .groupBy("student.grade")
      .getRawMany();

    const formattedDistribution = distribution.reduce((acc, { grade, count }) => {
      acc[grade] = parseInt(count);
      return acc;
    }, {} as Record<string, number>);

    res.json(formattedDistribution);
  } catch (error) {
    console.error('Error fetching grade distribution:', error);
    res.status(500).json({ message: "Error al obtener la distribución por grado" });
  }
};

// Get recently enrolled students
export const getRecentlyEnrolledStudents = async (req: Request, res: Response) => {
  try {
    const studentRepository = getRepository(Student);
    const recentStudents = await studentRepository.find({
      order: { enrollmentDate: "DESC" },
      take: 5,
      select: ["id", "firstName", "lastName", "enrollmentDate"],
    });

    res.json(recentStudents);
  } catch (error) {
    console.error('Error fetching recently enrolled students:', error);
    res.status(500).json({ message: "Error al obtener los estudiantes recién matriculados" });
  }
};
