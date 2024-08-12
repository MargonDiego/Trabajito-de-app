import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { FormikHelpers } from 'formik';
import StudentFormBase from './StudentFormBase';
import api from '../utils/api';
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

const EditStudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<StudentFormValues | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`http://localhost:3000/api/students/${id}`);
        const studentData = response.data;
        setInitialValues({
          ...studentData,
          birthDate: studentData.birthDate ? dayjs(studentData.birthDate, 'DD-MM-YYYY') : null,
          enrollmentDate: studentData.enrollmentDate
            ? dayjs(studentData.enrollmentDate, 'DD-MM-YYYY')
            : null,
          emergencyContacts: Array.isArray(studentData.emergencyContacts)
            ? studentData.emergencyContacts.join(', ')
            : studentData.emergencyContacts || '',
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (values: StudentFormValues, { setSubmitting }: FormikHelpers<StudentFormValues>) => {
    try {
      const dataToSend = {
        ...values,
        birthDate: values.birthDate ? dayjs(values.birthDate).format('DD-MM-YYYY') : null,
        enrollmentDate: values.enrollmentDate ? dayjs(values.enrollmentDate).format('DD-MM-YYYY') : null,
        emergencyContacts: values.emergencyContacts.split(',').map((contact) => contact.trim()),
      };

      const response = await api.put(`http://localhost:3000/api/students/${id}`, dataToSend);
      if (response.status === 200) {
        alert('Estudiante actualizado con éxito');
        navigate('/students');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error al actualizar el estudiante');
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return <StudentFormBase initialValues={initialValues} onSubmit={handleSubmit} isEditing={true} />;
};

export default EditStudentForm;
