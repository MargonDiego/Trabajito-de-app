import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Typography, Container, Box, Link, Avatar, Grid, Alert } from '@mui/material';
import * as Yup from 'yup';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SchoolIcon from '@mui/icons-material/School';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null); // Clear previous errors
            try {
              const response = await api.post('http://localhost:3000/api/login', values);
              login(response.data.token, {
                id: response.data.userId,
                email: values.email,
                role: response.data.role,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
              });
              navigate('/profile');
            } catch (error) {
              console.error('Error durante el login:', error);
              setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/recover-account" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Box sx={{ mt: 5, display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Sistema de Convivencia Escolar
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
