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
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
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
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  rut: string;
  position: string;
  department: string;
  phoneNumber: string;
  birthDate: Dayjs | null;
  address: string;
  emergencyContact: string;
  hireDate: Dayjs | null;
  specializations: string;
  isActive: boolean;
  staffType: 'Docente' | 'Directivo' | 'Asistente de la Educación' | 'Profesional de Apoyo' | null;
  subjectsTeaching: string[];
}

const EditUserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    rut: '',
    position: '',
    department: '',
    phoneNumber: '',
    birthDate: null,
    address: '',
    emergencyContact: '',
    hireDate: null,
    specializations: '',
    isActive: true,
    staffType: null,
    subjectsTeaching: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/users/${user.id}`);
        const userData = response.data;
        setProfile({
          ...userData,
          birthDate: userData.profile.birthDate
            ? dayjs(userData.profile.birthDate)
            : null,
          hireDate: userData.hireDate ? dayjs(userData.hireDate) : null,
          subjectsTeaching: userData.subjectsTeaching || [],
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          rut: userData.profile.rut,
          position: userData.profile.position,
          department: userData.profile.department,
          phoneNumber: userData.profile.phoneNumber,
          address: userData.profile.address,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const dataToSend = {
        ...profile,
        birthDate: profile.birthDate
          ? profile.birthDate.format('DD-MM-YYYY')
          : null,
        hireDate: profile.hireDate
          ? profile.hireDate.format('DD-MM-YYYY')
          : null,
        subjectsTeaching: Array.isArray(profile.subjectsTeaching)
          ? profile.subjectsTeaching
          : (profile.subjectsTeaching as unknown as string)
              .split(',')
              .map((s: string) => s.trim()),
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          rut: profile.rut,
          position: profile.position,
          department: profile.department,
          phoneNumber: profile.phoneNumber,
          birthDate: profile.birthDate
            ? profile.birthDate.format('DD-MM-YYYY')
            : null,
          address: profile.address,
        },
      };
      console.log('Sending data to server:', dataToSend);
      const response = await api.put(`/users/${user.id}`, dataToSend);
      console.log('Server response:', response.data);
      if (response.data && response.data.user) {
        setProfile({
          ...response.data.user,
          birthDate: response.data.user.profile.birthDate
            ? dayjs(response.data.user.profile.birthDate)
            : null,
          hireDate: response.data.user.hireDate
            ? dayjs(response.data.user.hireDate)
            : null,
        });
        setSnackbar({
          open: true,
          message: 'Perfil actualizado exitosamente',
          severity: 'success',
        });
        navigate('/profile');
      } else {
        throw new Error('Respuesta del servidor no contiene los datos del usuario');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el perfil',
        severity: 'error',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleStaffTypeChange = (
    event: SelectChangeEvent<ProfileData['staffType']>
  ) => {
    setProfile((prev) => ({
      ...prev,
      staffType: event.target.value as ProfileData['staffType'],
    }));
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              {profile.firstName && profile.firstName[0]}
              {profile.lastName && profile.lastName[0]}
            </Avatar>
            <Typography variant="h4" component="h1">
              Editar Perfil de Usuario
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Nombre"
                  value={profile.firstName || ''}
                  disabled
                  InputProps={{
                    startAdornment: <PersonOutline />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Apellido"
                  value={profile.lastName || ''}
                  disabled
                  InputProps={{
                    startAdornment: <PersonOutline />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <EmailOutlined />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="rut"
                  label="RUT"
                  value={profile.rut || ''}
                  disabled
                  InputProps={{
                    startAdornment: <PersonOutline />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="position"
                  label="Cargo"
                  value={profile.position || ''}
                  disabled
                  InputProps={{
                    startAdornment: <WorkOutline />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="department"
                  label="Departamento"
                  value={profile.department || ''}
                  disabled
                  InputProps={{
                    startAdornment: <WorkOutline />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Teléfono"
                  value={profile.phoneNumber || ''}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <PhoneOutlined />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={profile.birthDate}
                  onChange={(newValue) =>
                    setProfile({ ...profile, birthDate: newValue })
                  }
                  format="DD-MM-YYYY"
                  slots={{
                    textField: TextField,
                  }}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Dirección"
                  value={profile.address || ''}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <HomeOutlined />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="emergencyContact"
                  label="Contacto de Emergencia"
                  value={profile.emergencyContact || ''}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <PhoneOutlined />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Contratación"
                  value={profile.hireDate}
                  onChange={(newValue) =>
                    setProfile({ ...profile, hireDate: newValue })
                  }
                  format="DD-MM-YYYY"
                  slots={{
                    textField: TextField,
                  }}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="specializations"
                  label="Especializaciones"
                  value={profile.specializations || ''}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profile.isActive}
                      disabled
                      onChange={(e) =>
                        setProfile({ ...profile, isActive: e.target.checked })
                      }
                      name="isActive"
                    />
                  }
                  label="Usuario Activo"
                />
              </Grid>
              <Grid item xs={12}>
                <Chip label={profile.role} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Personal</InputLabel>
                  <Select
                    name="staffType"
                    value={profile.staffType || ''}
                    disabled
                    onChange={handleStaffTypeChange}
                  >
                    <MenuItem value="">Ninguno</MenuItem>
                    <MenuItem value="Docente">Docente</MenuItem>
                    <MenuItem value="Directivo">Directivo</MenuItem>
                    <MenuItem value="Asistente de la Educación">
                      Asistente de la Educación
                    </MenuItem>
                    <MenuItem value="Profesional de Apoyo">
                      Profesional de Apoyo
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="subjectsTeaching"
                  label="Asignaturas que enseña"
                  value={(profile.subjectsTeaching ?? []).join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      subjectsTeaching: (e.target.value as string)
                        .split(', ')
                        .map((s) => s.trim()),
                    })
                  }
                  helperText="Separe las asignaturas con comas"
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate('/profile')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar Cambios
              </Button>
            </Box>
          </form>
        </Paper>
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
      </Container>
    </LocalizationProvider>
  );
};

export default EditUserProfile;
