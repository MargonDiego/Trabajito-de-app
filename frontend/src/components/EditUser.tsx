import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Avatar,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  PersonOutline,
  EmailOutlined,
  WorkOutline,
  PhoneOutlined,
  HomeOutlined,
} from '@mui/icons-material';
import dayjs from 'dayjs';

const EditUserSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email es requerido'),
  firstName: Yup.string().required('Nombre es requerido'),
  lastName: Yup.string().required('Apellido es requerido'),
  role: Yup.string().required('Rol es requerido'),
  isActive: Yup.boolean().required('Estado es requerido'),
  staffType: Yup.string().required('Tipo de personal es requerido'),
  subjectsTeaching: Yup.string(),
  specializations: Yup.string(),
  hireDate: Yup.date().nullable().required('Fecha de contratación es requerida'),
  emergencyContact: Yup.string().required('Contacto de emergencia es requerido'),
  rut: Yup.string().required('RUT es requerido'),
  position: Yup.string().required('Posición es requerida'),
  department: Yup.string().required('Departamento es requerido'),
  phoneNumber: Yup.string().required('Número de teléfono es requerido'),
  birthDate: Yup.date().nullable().required('Fecha de nacimiento es requerida'),
  address: Yup.string().required('Dirección es requerida'),
});

interface EditUserProps {
  user: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    staffType: string | null;
    subjectsTeaching: string[];
    specializations: string;
    hireDate: string | null;
    emergencyContact: string;
    profile: {
      firstName: string;
      lastName: string;
      rut: string;
      position: string;
      department: string;
      phoneNumber: string;
      birthDate: string | null;
      address: string;
    };
  };
  onClose: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onClose }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    // Example effect to handle side effects if needed
    console.log('EditUser component mounted or updated');
  }, [user]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, maxWidth: 600, margin: 'auto' }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              {user.profile.firstName[0]}
              {user.profile.lastName[0]}
            </Avatar>
            <Typography variant="h4" component="h1">
              Editar Usuario
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Formik
            initialValues={{
              email: user.email,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              role: user.role,
              isActive: user.isActive,
              staffType: user.staffType || '',
              subjectsTeaching: user.subjectsTeaching
                ? user.subjectsTeaching.join(', ')
                : '',
              specializations: user.specializations,
              hireDate: user.hireDate ? dayjs(user.hireDate) : null,
              emergencyContact: user.emergencyContact,
              rut: user.profile.rut,
              position: user.profile.position,
              department: user.profile.department,
              phoneNumber: user.profile.phoneNumber || '',
              birthDate: user.profile.birthDate ? dayjs(user.profile.birthDate) : null,
              address: user.profile.address,
            }}
            validationSchema={EditUserSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const dataToSend = {
                  ...values,
                  birthDate: values.birthDate ? values.birthDate.format('DD-MM-YYYY') : null,
                  hireDate: values.hireDate ? values.hireDate.format('DD-MM-YYYY') : null,
                  subjectsTeaching: values.subjectsTeaching.split(',').map((s) => s.trim()),
                };
                const response = await api.put(`/users/${user.id}`, dataToSend);
                if (response.status === 200) {
                  setSnackbar({
                    open: true,
                    message: 'Usuario actualizado exitosamente',
                    severity: 'success',
                  });
                  setTimeout(onClose, 2000); // Close after 2 seconds
                } else {
                  setSnackbar({
                    open: true,
                    message: 'Error al actualizar el usuario',
                    severity: 'error',
                  });
                }
              } catch (error) {
                console.error('Error updating user:', error);
                setSnackbar({
                  open: true,
                  message: 'Error al actualizar el usuario. Por favor, inténtelo de nuevo.',
                  severity: 'error',
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, values, handleChange, setFieldValue, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="firstName"
                      label="Nombre"
                      value={values.firstName}
                      onChange={handleChange}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{
                        startAdornment: <PersonOutline />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="lastName"
                      label="Apellido"
                      value={values.lastName}
                      onChange={handleChange}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{
                        startAdornment: <PersonOutline />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      InputProps={{
                        startAdornment: <EmailOutlined />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="rut"
                      label="RUT"
                      value={values.rut}
                      onChange={handleChange}
                      error={touched.rut && Boolean(errors.rut)}
                      helperText={touched.rut && errors.rut}
                      InputProps={{
                        startAdornment: <PersonOutline />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="position"
                      label="Cargo"
                      value={values.position}
                      onChange={handleChange}
                      error={touched.position && Boolean(errors.position)}
                      helperText={touched.position && errors.position}
                      InputProps={{
                        startAdornment: <WorkOutline />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="department"
                      label="Departamento"
                      value={values.department}
                      onChange={handleChange}
                      error={touched.department && Boolean(errors.department)}
                      helperText={touched.department && errors.department}
                      InputProps={{
                        startAdornment: <WorkOutline />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phoneNumber"
                      label="Teléfono"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      InputProps={{
                        startAdornment: <PhoneOutlined />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Fecha de Nacimiento"
                      value={values.birthDate}
                      onChange={(newValue) => setFieldValue('birthDate', newValue)}
                      format="DD-MM-YYYY"
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: { fullWidth: true, error: Boolean(touched.birthDate && errors.birthDate), helperText: touched.birthDate && errors.birthDate },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="address"
                      label="Dirección"
                      value={values.address}
                      onChange={handleChange}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      InputProps={{
                        startAdornment: <HomeOutlined />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="emergencyContact"
                      label="Contacto de Emergencia"
                      value={values.emergencyContact}
                      onChange={handleChange}
                      error={touched.emergencyContact && Boolean(errors.emergencyContact)}
                      helperText={touched.emergencyContact && errors.emergencyContact}
                      InputProps={{
                        startAdornment: <PhoneOutlined />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Fecha de Contratación"
                      value={values.hireDate}
                      onChange={(newValue) => setFieldValue('hireDate', newValue)}
                      format="DD-MM-YYYY"
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: { fullWidth: true, error: Boolean(touched.hireDate && errors.hireDate), helperText: touched.hireDate && errors.hireDate },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="specializations"
                      label="Especializaciones"
                      value={values.specializations}
                      onChange={handleChange}
                      error={touched.specializations && Boolean(errors.specializations)}
                      helperText={touched.specializations && errors.specializations}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.isActive}
                          onChange={(e) => setFieldValue('isActive', e.target.checked)}
                          name="isActive"
                        />
                      }
                      label="Usuario Activo"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip label={values.role} color="primary" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Personal</InputLabel>
                      <Field
                        as={Select}
                        name="staffType"
                        value={values.staffType || ''}
                        onChange={handleChange}
                        error={touched.staffType && Boolean(errors.staffType)}
                        helperText={touched.staffType && errors.staffType}
                      >
                        <MenuItem value="">Ninguno</MenuItem>
                        <MenuItem value="Docente">Docente</MenuItem>
                        <MenuItem value="Directivo">Directivo</MenuItem>
                        <MenuItem value="Asistente de la Educación">Asistente de la Educación</MenuItem>
                        <MenuItem value="Profesional de Apoyo">Profesional de Apoyo</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="subjectsTeaching"
                      label="Asignaturas que enseña"
                      value={values.subjectsTeaching}
                      onChange={handleChange}
                      error={touched.subjectsTeaching && Boolean(errors.subjectsTeaching)}
                      helperText={(touched.subjectsTeaching && errors.subjectsTeaching) || "Separe las asignaturas con comas"}
                    />
                  </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="space-between">
                  <Button variant="outlined" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Guardar Cambios
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ inlineSize: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default EditUser;
