import React, { useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextFieldProps,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import  { Dayjs } from 'dayjs';

// Define an interface for the form values
export interface StudentFormValues {
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

const availableGrades = [
  '1° Básico', '2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico',
  '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio',
];

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  rut: Yup.string()
    .required('El RUT es requerido')
    .matches(/^(\d{1,2}\d{3}\d{3}[-][0-9kK]{1})$/, 'El formato del RUT no es válido (ej: 18992710-k)'),
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  birthDate: Yup.date()
  .nullable()
  .required('La fecha de nacimiento es requerida')
  .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
  grade: Yup.string().required('El curso es requerido'),
  academicYear: Yup.number()
    .required('El año académico es requerido')
    .min(2000, 'El año académico debe ser mayor a 2000')
    .max(new Date().getFullYear() + 1, 'El año académico no puede ser futuro'),
  guardian1Name: Yup.string(),
  guardian1Contact: Yup.string(),
  guardian2Name: Yup.string(),
  guardian2Contact: Yup.string(),
  address: Yup.string(),
  healthInfo: Yup.string(),
  specialNeeds: Yup.string(),
  medicalConditions: Yup.string(),
  allergies: Yup.string(),
  hasScholarship: Yup.boolean(),
  scholarshipDetails: Yup.string().when('hasScholarship', {
    is: true,
    then: () => Yup.string().required('Detalles de la beca son requeridos cuando tiene beca'),
    otherwise: () => Yup.string(),
  }),
  emergencyContacts: Yup.string(),
  previousSchool: Yup.string(),
  enrollmentDate: Yup.date()
  .nullable()
  .max(new Date(), 'La fecha de inscripción no puede ser futura'), 
  isActive: Yup.boolean(),
});

interface StudentFormBaseProps {
  initialValues: StudentFormValues;
  onSubmit: (values: StudentFormValues, formikHelpers: FormikHelpers<StudentFormValues>) => void;
  isEditing: boolean;
}

const steps = [
  'Información Personal',
  'Información Académica',
  'Información de Tutores',
  'Información Médica',
  'Información Adicional',
];

const StudentFormBase: React.FC<StudentFormBaseProps> = ({
  initialValues,
  onSubmit,
  isEditing,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const formatRut = (rut: string) => {
    const cleaned = rut.replace(/[^0-9kK]/g, '');
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();
    return `${body}-${dv}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEditing ? 'Editar Estudiante' : 'Crear Estudiante'}
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, formikHelpers) => {
                console.log('Formik onSubmit called with values:', values);
                onSubmit(values, formikHelpers);
              }}
              validate={(values) => {
                try {
                  validationSchema.validateSync(values, { abortEarly: false });
                  return {};
                } catch (error) {
                  if (error instanceof Yup.ValidationError) {
                    const validationErrors = error.inner.reduce((acc, err) => {
                      if (err.path) {
                        acc[err.path] = err.message;
                      }
                      return acc;
                    }, {} as Record<string, string>);
                    console.log('Validation errors:', validationErrors);
                    return validationErrors;
                  }
                  return {};
                }
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors, touched, setFieldValue, values, submitForm }) => (
                <Form>
                  <Accordion expanded={activeStep === 0} onChange={() => setActiveStep(0)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Información Personal</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="firstName"
                            label="Nombre"
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="lastName"
                            label="Apellido"
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="rut"
                            label="RUT"
                            error={touched.rut && Boolean(errors.rut)}
                            helperText={touched.rut && errors.rut}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const formattedRut = formatRut(e.target.value);
                              setFieldValue('rut', formattedRut);
                            }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Fecha de Nacimiento"
                          value={values.birthDate}
                          onChange={(date) => setFieldValue('birthDate', date)}
                          format="DD-MM-YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: touched.birthDate && Boolean(errors.birthDate),
                              helperText: touched.birthDate && errors.birthDate,
                              required: true,
                            } as TextFieldProps,
                          }}
                        />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion expanded={activeStep === 1} onChange={() => setActiveStep(1)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Información Académica</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={touched.grade && Boolean(errors.grade)}>
                            <InputLabel id="grade-label">Curso</InputLabel>
                            <Field
                              as={Select}
                              labelId="grade-label"
                              name="grade"
                              label="Curso"
                              required
                            >
                              {availableGrades.map((grade) => (
                                <MenuItem key={grade} value={grade}>
                                  {grade}
                                </MenuItem>
                              ))}
                            </Field>
                            {touched.grade && errors.grade && (
                              <Typography color="error">{errors.grade as string}</Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="academicYear"
                            label="Año Académico"
                            type="number"
                            error={touched.academicYear && Boolean(errors.academicYear)}
                            helperText={touched.academicYear && errors.academicYear}
                            required
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion expanded={activeStep === 2} onChange={() => setActiveStep(2)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Información de Tutores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="guardian1Name"
                            label="Nombre del Tutor 1"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="guardian1Contact"
                            label="Contacto del Tutor 1"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="guardian2Name"
                            label="Nombre del Tutor 2"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="guardian2Contact"
                            label="Contacto del Tutor 2"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion expanded={activeStep === 3} onChange={() => setActiveStep(3)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Información Médica</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="healthInfo"
                            label="Información de Salud"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="specialNeeds"
                            label="Necesidades Especiales"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="medicalConditions"
                            label="Condiciones Médicas"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="allergies"
                            label="Alergias"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion expanded={activeStep === 4} onChange={() => setActiveStep(4)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Información Adicional</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="address"
                            label="Dirección"
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Field
                                as={Checkbox}
                                name="hasScholarship"
                                checked={values.hasScholarship}
                              />
                            }
                            label="Tiene Beca"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="scholarshipDetails"
                            label="Detalles de la Beca"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="emergencyContacts"
                            label="Contactos de Emergencia"
                            helperText="Separe los contactos con comas"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            fullWidth
                            name="previousSchool"
                            label="Escuela Anterior"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Fecha de Inscripción"
                          value={values.enrollmentDate}
                          onChange={(date) => setFieldValue('enrollmentDate', date)}
                          format="DD-MM-YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: touched.enrollmentDate && Boolean(errors.enrollmentDate),
                              helperText: touched.enrollmentDate && errors.enrollmentDate,
                            } as TextFieldProps,
                          }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Field
                                as={Checkbox}
                                name="isActive"
                                checked={values.isActive}
                              />
                            }
                            label="Activo"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Atrás
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={activeStep === steps.length - 1 ? submitForm : handleNext}
                    >
                      {activeStep === steps.length - 1 ? (isEditing ? 'Actualizar' : 'Crear') : 'Siguiente'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default StudentFormBase;
