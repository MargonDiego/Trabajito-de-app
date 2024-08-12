import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Snackbar, Alert, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/system';
import api from '../utils/api';

// Función para validar RUT chileno
const validateRut = (rut: string) => {
  if (!/^[0-9]{7,8}-[0-9kK]{1}$/.test(rut)) return false;
  const rutDigits = rut.split('-')[0];
  const rutVerifier = rut.split('-')[1].toLowerCase();
  let sum = 0;
  let multiplier = 2;
  for (let i = rutDigits.length - 1; i >= 0; i--) {
    sum += parseInt(rutDigits[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedVerifier = 11 - (sum % 11);
  const calculatedVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'k' : expectedVerifier.toString();
  return calculatedVerifier === rutVerifier;
};

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Requerido'),
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  rut: Yup.string()
    .required('Requerido')
    .test('rut-validado', 'RUT inválido', validateRut),
});

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
});

const StyledForm = styled(Form)({
  width: '100%',
  marginTop: '1rem',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

interface ErrorState {
  message: string;
  field?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorState | null>(null);

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <StyledContainer maxWidth="xs">
      <StyledAvatar>
        <LockOutlinedIcon />
      </StyledAvatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Registro
      </Typography>
      <Formik
        initialValues={{ email: '', password: '', firstName: '', lastName: '', rut: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          setError(null);
          try {
            await api.post('/users', values);
            navigate('/login', { state: { message: 'Usuario registrado exitosamente. Por favor, inicie sesión.' } });
          } catch (error: any) {
            console.error('Error al registrar:', error);
            if (error.response && error.response.data) {
              const { data } = error.response;
              if (data.message.includes("El correo electrónico ya está registrado")) {
                setFieldError('email', 'Este correo electrónico ya está en uso');
                setError({ message: 'El correo electrónico proporcionado ya está registrado en nuestro sistema.', field: 'email' });
              } else if (data.message.includes("El RUT ya está registrado")) {
                setFieldError('rut', 'Este RUT ya está registrado');
                setError({ message: 'El RUT proporcionado ya está asociado a una cuenta existente.', field: 'rut' });
              } else {
                setError({ message: 'Se produjo un error durante el registro. Por favor, verifique sus datos e intente nuevamente.' });
              }
            } else {
              setError({ message: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.' });
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <StyledForm>
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              error={touched.email && (Boolean(errors.email) || error?.field === 'email')}
              helperText={(touched.email && errors.email) || (error?.field === 'email' && error.message)}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="password"
              label="Contraseña"
              type="password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="firstName"
              label="Nombre"
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="lastName"
              label="Apellido"
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              name="rut"
              label="RUT"
              error={touched.rut && (Boolean(errors.rut) || error?.field === 'rut')}
              helperText={(touched.rut && errors.rut) || (error?.field === 'rut' && error.message)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
          </StyledForm>
        )}
      </Formik>
      <Snackbar
        open={Boolean(error) && !error.field}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error?.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Register;
