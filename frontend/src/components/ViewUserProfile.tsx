import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  Email,
  Phone,
  CalendarToday,
  Home,
  Business,
  Work,
  Assignment,
  Edit,
} from '@mui/icons-material';

interface UserProfileData {
  id: number;
  email: string;
  role: string;
  staffType: string;
  subjectsTeaching: string[];
  specializations: string;
  hireDate: string | null;
  emergencyContact: string;
  isActive: boolean;
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
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const IconLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

const ViewUserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${user?.id}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>No se encontró el perfil</Typography>;

  return (
    <Container maxWidth="md">
      <ProfileCard elevation={3}>
        <Header>
          <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
            {profile.profile.firstName[0]}
            {profile.profile.lastName[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" component="h1">
              {profile.profile.firstName} {profile.profile.lastName}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              {profile.role}
            </Typography>
          </Box>
          <Tooltip title="Editar perfil">
            <IconButton color="inherit" onClick={() => navigate(`/profile/edit`)}>
              <Edit />
            </IconButton>
          </Tooltip>
        </Header>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Email sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Email:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  RUT:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.profile.rut}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Work sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Cargo:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.profile.position}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Business sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Departamento:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.profile.department}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Phone sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Teléfono:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.profile.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Fecha de Nacimiento:
                </Typography>
              </IconLabel>
              <Typography variant="body1">
                {profile.profile.birthDate
                  ? dayjs(profile.profile.birthDate).format('DD/MM/YYYY')
                  : 'No especificado'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <IconLabel>
                <Home sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Dirección:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.profile.address}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tipo de Personal:
                </Typography>
              </IconLabel>
              <Typography variant="body1">{profile.staffType}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <IconLabel>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Fecha de Contratación:
                </Typography>
              </IconLabel>
              <Typography variant="body1">
                {profile.hireDate
                  ? dayjs(profile.hireDate).format('DD/MM/YYYY')
                  : 'No especificado'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <IconLabel>
                <Typography variant="subtitle1" fontWeight="bold">
                  Especializaciones:
                </Typography>
              </IconLabel>
              <Typography variant="body1">
                {profile.specializations
                  ? profile.specializations
                  : 'No se han especificado especializaciones'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <IconLabel>
                <Typography variant="subtitle1" fontWeight="bold">
                  Asignaturas:
                </Typography>
              </IconLabel>
              <Typography variant="body1">
                {profile.subjectsTeaching && profile.subjectsTeaching.length > 0
                  ? profile.subjectsTeaching.join(', ')
                  : 'No se han especificado asignaturas'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <IconLabel>
                <Typography variant="subtitle1" fontWeight="bold">
                  Estado:
                </Typography>
              </IconLabel>
              <Chip
                label={profile.isActive ? 'Activo' : 'Inactivo'}
                color={profile.isActive ? 'success' : 'error'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>
    </Container>
  );
};

export default ViewUserProfile;
