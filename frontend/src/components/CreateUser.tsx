import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Grid, MenuItem, Alert } from '@mui/material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Validation schema for creating a user
const CreateUserSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Las contraseñas deben coincidir') // Ensure passwords match
    .required('Requerido'),
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  rut: Yup.string().required('Requerido').matches(/^[0-9]{7,8}-[0-9K]$/, 'RUT inválido'),
  role: Yup.string().required('Requerido'),
  position: Yup.string().required('Requerido'),
  department: Yup.string().required('Requerido'),
});

// Define a type for the error response
interface ErrorResponse {
  message: string;
  errors?: { message: string }[];
}

const CreateUser: React.FC = () => {
  const [formStatus, setFormStatus] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setFormStatus(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Crear Nuevo Usuario
      </Typography>
      {formStatus && (
        <Alert severity={formStatus.type} onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {formStatus.message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          rut: '',
          role: '',
          position: '',
          department: '',
        }}
        validationSchema={CreateUserSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await api.post('/users', values);
            setFormStatus({ message: 'Usuario creado exitosamente', type: 'success' });
            setTimeout(() => {
              navigate('/user-management');
            }, 2000); // Redirect to user-management after 2 seconds
          } catch (error) {
            // Assume error is an AxiosError with a response data structure
            const err = error as { response: { data: ErrorResponse } };
            if (err.response && err.response.data) {
              const errorMessage = err.response.data.message;
              const errorDetails = err.response.data.errors;

              if (errorDetails && Array.isArray(errorDetails)) {
                setFormStatus({
                  message: `${errorMessage}: ${errorDetails.map((err) => err.message).join(', ')}`,
                  type: 'error'
                });
              } else {
                setFormStatus({ message: errorMessage, type: 'error' });
              }
            } else {
              setFormStatus({
                message: 'Error al crear usuario. Por favor, inténtelo de nuevo.',
                type: 'error'
              });
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  variant="outlined"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="firstName"
                  label="Nombre"
                  variant="outlined"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="lastName"
                  label="Apellido"
                  variant="outlined"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="rut"
                  label="RUT"
                  variant="outlined"
                  error={touched.rut && Boolean(errors.rut)}
                  helperText={touched.rut && errors.rut}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="role"
                  label="Rol"
                  variant="outlined"
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="teacher">Profesor</MenuItem>
                  <MenuItem value="staff">Personal</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="position"
                  label="Posición"
                  variant="outlined"
                  error={touched.position && Boolean(errors.position)}
                  helperText={touched.position && errors.position}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="department"
                  label="Departamento"
                  variant="outlined"
                  error={touched.department && Boolean(errors.department)}
                  helperText={touched.department && errors.department}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ py: 1.5, mt: 3, boxShadow: 3, textTransform: 'none' }}
            >
              Crear Usuario
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreateUser;
