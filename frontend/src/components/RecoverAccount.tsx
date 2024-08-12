import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import * as Yup from 'yup';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const RecoverAccountSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
});

export const RecoverAccount: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Recuperar Cuenta
        </Typography>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={RecoverAccountSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.post('http://localhost:3000/api/recover-account', values);
              alert('Se ha enviado un correo con instrucciones para recuperar tu cuenta.');
              navigate('/login');
            } catch (error) {
              console.error('Error al recuperar la cuenta:', error);
              alert('Error al procesar la solicitud de recuperación de cuenta');
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
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                Enviar Instrucciones de Recuperación
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default RecoverAccount;