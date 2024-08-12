import React from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Email,
  Assignment,
  Work,
  Business,
  Phone,
  CalendarToday,
  Home,
  AccountCircle,
  ContactEmergency,
  School,
  Group,
} from '@mui/icons-material';
import dayjs from 'dayjs';

interface ViewUserProps {
  user: {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    staffType: string | null;
    subjectsTeaching?: string[];
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

const ViewUser: React.FC<ViewUserProps> = ({ user, onClose }) => {
  return (
    <Paper elevation={3} sx={{ p: 5, maxWidth: 1000, margin: 'auto' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
          {user.profile.firstName[0]}
          {user.profile.lastName[0]}
        </Avatar>
        <Typography variant="h4" component="h1">
          Detalles del Usuario
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <AccountCircle sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Nombre:</strong></Typography>
            <Typography>
              {user.profile.firstName} {user.profile.lastName}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Email sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Email:</strong></Typography>
            <Typography>{user.email}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Assignment sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>RUT:</strong></Typography>
            <Typography>{user.profile.rut}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Work sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Rol:</strong></Typography>
            <Typography>{user.role}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Chip
            icon={user.isActive ? <Group /> : undefined}
            label={user.isActive ? 'Activo' : 'Inactivo'}
            color={user.isActive ? 'success' : 'error'}
            sx={{ mr: 1 }}
          />
          <Box>
            <Typography variant="subtitle2"><strong>Estado:</strong></Typography>
            <Typography>{user.isActive ? 'Activo' : 'Inactivo'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <School sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Tipo de Personal:</strong></Typography>
            <Typography>{user.staffType || 'No especificado'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Business sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Departamento:</strong></Typography>
            <Typography>{user.profile.department}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Phone sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Teléfono:</strong></Typography>
            <Typography>{user.profile.phoneNumber || 'No especificado'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <CalendarToday sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Fecha de Nacimiento:</strong></Typography>
            <Typography>
              {user.profile.birthDate ? dayjs(user.profile.birthDate).format('DD/MM/YYYY') : 'No especificado'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Home sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Dirección:</strong></Typography>
            <Typography>{user.profile.address || 'No especificada'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} display="flex" alignItems="center">
          <ContactEmergency sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Contacto de Emergencia:</strong></Typography>
            <Typography>{user.emergencyContact || 'No especificado'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <CalendarToday sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2"><strong>Fecha de Contratación:</strong></Typography>
            <Typography>
              {user.hireDate ? dayjs(user.hireDate).format('DD/MM/YYYY') : 'No especificado'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Typography variant="subtitle2"><strong>Especializaciones:</strong></Typography>
          <Typography>{user.specializations || 'Ninguna'}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
          <Typography variant="subtitle2"><strong>Asignaturas:</strong></Typography>
          <Typography>
            {user.subjectsTeaching && user.subjectsTeaching.length > 0
              ? user.subjectsTeaching.join(', ')
              : 'Ninguna'}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Paper>
  );
};

export default ViewUser;
