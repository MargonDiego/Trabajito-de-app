import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import StudentFormBase from './StudentFormBase';
import dayjs, { Dayjs } from 'dayjs';
import api from '../utils/api'
interface StudentFormValues {
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  birthDate: Dayjs | null;
  grade: string;
  academicYear: number;
  guardian1Name: string;
  guardian1Contact: string;
  guardian2Name: string;
  guardian2Contact: string;
  address: string;
  healthInfo: string;
  studentType: string;
  specialNeeds: string;
  medicalConditions: string;
  allergies: string;
  hasScholarship: boolean;
  scholarshipDetails: string;
  emergencyContacts: string;
  previousSchool: string;
  enrollmentDate: Dayjs | null;
  isActive: boolean;
}

const CreateStudentForm: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: StudentFormValues = {
    firstName: '',
    lastName: '',
    rut: '',
    email: '',
    birthDate: null,
    grade: '',
    academicYear: new Date().getFullYear(),
    guardian1Name: '',
    guardian1Contact: '',
    guardian2Name: '',
    guardian2Contact: '',
    address: '',
    healthInfo: '',
    studentType: 'Regular',
    specialNeeds: '',
    medicalConditions: '',
    allergies: '',
    hasScholarship: false,
    scholarshipDetails: '',
    emergencyContacts: '',
    previousSchool: '',
    enrollmentDate: null,
    isActive: true,
  };

  const handleSubmit = async (
    values: StudentFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<StudentFormValues>
  ) => {
    try {
      const dataToSend = {
        ...values,
        birthDate: values.birthDate ? dayjs(values.birthDate).format('DD-MM-YYYY') : null,
        enrollmentDate: values.enrollmentDate ? dayjs(values.enrollmentDate).format('DD-MM-YYYY') : null,
        emergencyContacts: values.emergencyContacts.split(',').map((contact) => contact.trim()),
      };

      const checkResponse = await api.get(`http://localhost:3000/api/students/check-rut/${values.rut}`);
      if (checkResponse.data.exists) {
        setFieldError('rut', 'Ya existe un estudiante con este RUT');
        return;
      }

      const response = await api.post('http://localhost:3000/api/students', dataToSend);
      if (response.status === 201) {
        alert('Estudiante creado con éxito');
        navigate('/students');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error al crear el estudiante');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentFormBase
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isEditing={false}
    />
  );
};

export default CreateStudentForm;
