import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  LinearProgress,
  styled,
} from '@mui/material';
import {
  School,
  Call,
  Email,
  Home,
  Cake,
  Assignment,
  LocalHospital,
  AttachMoney,
  Event,
  Edit,
  Print,
  Share,
  Star,
  EmojiEvents,
  AssignmentTurnedIn,
  Add,
} from '@mui/icons-material';
import api from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import InterventionCalendar from './InterventionCalendar'; // Import the new component

// Styled components for enhanced visual appearance
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  marginBottom: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const ProgressBar = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
}));

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  rut: string;
  email: string;
  birthDate: string;
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
  emergencyContacts: string[];
  previousSchool: string;
  enrollmentDate: string;
  isActive: boolean;
}

interface Intervention {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  dateReported: string;
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentAndInterventions = async () => {
      try {
        const studentResponse = await api.get(`http://localhost:3000/api/students/${id}`);
        setStudent(studentResponse.data);

        const interventionsResponse = await api.get(`http://localhost:3000/api/students/${id}/interventions`);
        setInterventions(interventionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    };

    fetchStudentAndInterventions();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">No se encontró el estudiante</Typography>
      </Container>
    );
  }

  const academicProgress = [
    { name: 'Completado', value: 75 },
    { name: 'Pendiente', value: 25 },
  ];
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientBackground>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  alt={`${student.firstName} ${student.lastName}`}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 120, height: 120, border: '4px solid white' }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h3">{`${student.firstName} ${student.lastName}`}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>{student.rut}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label={student.grade} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 1 }} />
                  <Chip
                    label={student.isActive ? 'Activo' : 'Inactivo'}
                    sx={{ bgcolor: student.isActive ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)', color: 'white', mr: 1 }}
                  />
                  {student.hasScholarship && (
                    <Chip icon={<Star />} label="Becado" sx={{ bgcolor: 'rgba(255,255,0,0.2)', color: 'white' }} />
                  )}
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/students/${id}/edit`)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                >
                  Editar Perfil
                </Button>
              </Grid>
            </Grid>
          </GradientBackground>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledCard elevation={3}>
                <CardHeader
                  title="Información Personal"
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><Assignment /></Avatar>}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><Email color="primary" /></ListItemIcon>
                          <ListItemText primary="Email" secondary={student.email} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Cake color="primary" /></ListItemIcon>
                          <ListItemText primary="Fecha de Nacimiento" secondary={student.birthDate} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Home color="primary" /></ListItemIcon>
                          <ListItemText primary="Dirección" secondary={student.address} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><School color="primary" /></ListItemIcon>
                          <ListItemText primary="Año Académico" secondary={student.academicYear} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Event color="primary" /></ListItemIcon>
                          <ListItemText primary="Fecha de Inscripción" secondary={student.enrollmentDate} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                          <ListItemText primary="Tipo de Estudiante" secondary={student.studentType} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StyledCard elevation={3} sx={{ mt: 3 }}>
                <CardHeader
                  title="Información de Contacto"
                  avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><Call /></Avatar>}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><Call /></ListItemIcon>
                          <ListItemText primary="Tutor 1" secondary={`${student.guardian1Name} - ${student.guardian1Contact}`} />
                        </ListItem>
                        {student.guardian2Name && (
                          <ListItem>
                            <ListItemIcon><Call /></ListItemIcon>
                            <ListItemText primary="Tutor 2" secondary={`${student.guardian2Name} - ${student.guardian2Contact}`} />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1">Contactos de Emergencia:</Typography>
                      <List>
                        {student.emergencyContacts.map((contact, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={contact} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <StyledCard elevation={3} sx={{ mt: 3 }}>
                <CardHeader
                  title="Información Médica"
                  avatar={<Avatar sx={{ bgcolor: 'error.main' }}><LocalHospital /></Avatar>}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><LocalHospital /></ListItemIcon>
                          <ListItemText primary="Información de Salud" secondary={student.healthInfo || 'No especificada'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocalHospital /></ListItemIcon>
                          <ListItemText primary="Condiciones Médicas" secondary={student.medicalConditions || 'Ninguna'} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><LocalHospital /></ListItemIcon>
                          <ListItemText primary="Alergias" secondary={student.allergies || 'Ninguna'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Assignment /></ListItemIcon>
                          <ListItemText primary="Necesidades Especiales" secondary={student.specialNeeds || 'Ninguna'} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </motion.div>

            {student.hasScholarship && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <StyledCard elevation={3} sx={{ mt: 3 }}>
                  <CardHeader
                    title="Información de Beca"
                    avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><AttachMoney /></Avatar>}
                  />
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemIcon><AttachMoney /></ListItemIcon>
                        <ListItemText primary="Detalles de la Beca" secondary={student.scholarshipDetails} />
                      </ListItem>
                    </List>
                  </CardContent>
                </StyledCard>
              </motion.div>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledCard elevation={3}>
                <CardHeader title="Progreso Académico" />
                <CardContent>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={academicProgress}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {academicProgress.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    75% Completado
                  </Typography>
                  <ProgressBar variant="determinate" value={75} sx={{ mt: 1 }} />
                </CardContent>
              </StyledCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StyledCard elevation={3} sx={{ mt: 3 }}>
                <CardHeader title="Logros" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon><EmojiEvents color="primary" /></ListItemIcon>
                      <ListItemText primary="Mejor Promedio del Grado" secondary="2023" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssignmentTurnedIn color="secondary" /></ListItemIcon>
                      <ListItemText primary="100% Asistencia" secondary="2022" />
                    </ListItem>
                  </List>
                </CardContent>
              </StyledCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <StyledCard elevation={3} sx={{ mt: 3 }}>
                <CardHeader title="Acciones Rápidas" />
                <CardContent>
                  <Tooltip title="Imprimir perfil del estudiante">
                    <Button startIcon={<Print />} fullWidth variant="outlined" sx={{ mb: 1 }}>
                      Imprimir Perfil
                    </Button>
                  </Tooltip>
                  <Tooltip title="Compartir información del estudiante">
                    <Button startIcon={<Share />} fullWidth variant="outlined">
                      Compartir Información
                    </Button>
                  </Tooltip>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <StyledCard elevation={3}>
                <CardHeader
                  title="Calendario de Intervenciones"
                  avatar={<Avatar sx={{ bgcolor: 'info.main' }}><Event /></Avatar>}
                />
                <CardContent>
                  <InterventionCalendar interventions={interventions} /> {/* Use the new component */}
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <StyledCard elevation={3}>
                <CardHeader
                  title="Lista de Intervenciones"
                  avatar={<Avatar sx={{ bgcolor: 'info.main' }}><Assignment /></Avatar>}
                />
                <CardContent>
                  <List>
                    {interventions.map((intervention) => (
                      <ListItem key={intervention.id}>
                        <ListItemText
                          primary={intervention.title}
                          secondary={`Tipo: ${intervention.type} | Estado: ${intervention.status}`}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/interventions/${intervention.id}`)}
                        >
                          Ver Detalles
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/students/${id}/add-intervention`)}
              startIcon={<Add />}
            >
              Agregar Nueva Intervención
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDetail;
