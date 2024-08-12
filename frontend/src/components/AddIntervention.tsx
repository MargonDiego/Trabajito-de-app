import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  SelectChangeEvent,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormHelperText,
  Tooltip,
  IconButton,
  Alert,
  Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import api from '../utils/api';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from '../contexts/AuthContext';
import { HelpOutline,ArrowBack,Info,School, Person, Group, FamilyRestroom, Pending, HourglassBottom, Done, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
// Configura dayjs para usar el plugin de formato personalizado
dayjs.extend(customParseFormat);

// Configura el idioma y formato de fecha por defecto
dayjs.locale('es');

// Styled components
const ColoredPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  color: theme.palette.common.white,
}));

const StyledCard = styled(Card)(() => ({
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Interfaces
interface User {
  id: number;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    rut: string;
  };
}

interface ResponsibleUser {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
}

interface InterventionForm {
  title: string;
  description: string;
  type: string;
  status: string;
  priority: number;
  dateReported: Dayjs;
  interventionScope: string;
  actionsTaken: string;
  requiresExternalReferral: boolean;
  externalReferralDetails: string;
  outcomeEvaluation: string;
  parentFeedback: string;
  followUpDate: Dayjs | null;
  responsible: ResponsibleUser | null;
}

const AddIntervention: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [intervention, setIntervention] = useState<InterventionForm>({
    title: '',
    description: '',
    type: 'Otro',
    status: 'Pendiente',
    priority: 1,
    dateReported: dayjs(),
    interventionScope: 'Individual',
    actionsTaken: '',
    requiresExternalReferral: false,
    externalReferralDetails: '',
    outcomeEvaluation: '',
    parentFeedback: '',
    followUpDate: null,
    responsible: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIntervention((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setIntervention((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponsibleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);
    const selectedUser = users.find((user) => user.id === selectedId);

    if (selectedUser) {
      setIntervention((prev) => ({
        ...prev,
        responsible: {
          id: selectedUser.id,
          firstName: selectedUser.profile.firstName,
          lastName: selectedUser.profile.lastName,
          position: selectedUser.profile.position,
        },
      }));
    } else {
      setIntervention((prev) => ({ ...prev, responsible: null }));
    }
  };

  const handleDateChange = (date: Dayjs | null, fieldName: string) => {
    setIntervention({ ...intervention, [fieldName]: date });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntervention({ ...intervention, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const dataToSend = {
        ...intervention,
        student: Number(studentId),
        informer: user?.id,
        responsible: intervention.responsible ? intervention.responsible.id : null,
        dateReported: dayjs(intervention.dateReported).format('DD-MM-YYYY'),
        followUpDate: intervention.followUpDate
          ? dayjs(intervention.followUpDate).format('DD-MM-YYYY')
          : null,
        actionsTaken: intervention.actionsTaken
          .split(',')
          .map((action) => action.trim())
          .filter((action) => action),
      };

      console.log('Data being sent to server:', dataToSend);
      const response = await api.post('/interventions', dataToSend);
      console.log('Response from server:', response.data);
      setSuccess('Intervención creada exitosamente');
      setTimeout(() => {
        navigate(`/students/${studentId}`);
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating intervention:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
          setError(`Error al crear la intervención: ${error.response.data.message || 'Intente nuevamente'}`);
        }
      } else {
        console.error('Unexpected error:', error);
        setError('Error inesperado al crear la intervención');
      }
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    'Información básica',
    'Detalles de la intervención',
    'Información adicional',
  ];

  const renderTooltip = (content: string) => (
    <Tooltip title={content}>
      <IconButton size="small">
        <HelpOutline fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const typeDescriptions = {
    Comportamiento: {
      icon: <Person />,
      description: 'Intervenciones relacionadas con el comportamiento del estudiante.',
    },
    Académico: {
      icon: <School />,
      description: 'Intervenciones relacionadas con el rendimiento académico.',
    },
    Asistencia: {
      icon: <Group />,
      description: 'Intervenciones relacionadas con la asistencia a clases.',
    },
    Salud: {
      icon: <FamilyRestroom />,
      description: 'Intervenciones relacionadas con la salud del estudiante.',
    },
    Familiar: {
      icon: <FamilyRestroom />,
      description: 'Intervenciones relacionadas con la familia del estudiante.',
    },
    Otro: {
      icon: <Info />,
      description: 'Intervenciones de otro tipo no categorizadas.',
    },
  };

  const priorityLabels = {
    1: 'Baja',
    2: 'Media-Baja',
    3: 'Media',
    4: 'Media-Alta',
    5: 'Alta',
  };

  const priorityIcons = {
    1: <ArrowBack />,
    2: <HourglassBottom />,
    3: <Done />,
    4: <CheckCircle />,
    5: <HelpOutline />,
  };

  const getPriorityDescription = (priority: number): string => {
    switch (priority) {
      case 1: return "Atención eventual, no urgente";
      case 2: return "Requiere seguimiento regular";
      case 3: return "Atención importante en el corto plazo";
      case 4: return "Requiere atención urgente";
      case 5: return "Intervención inmediata necesaria";
      default: return "";
    }
  };

  const getStatusDescription = (status: string): string => {
    switch (status) {
      case 'Pendiente': return "La intervención aún no ha comenzado";
      case 'En Proceso': return "Se están tomando acciones actualmente";
      case 'Resuelto': return "La intervención ha sido completada con éxito";
      case 'Cerrado': return "Se ha finalizado el seguimiento";
      default: return "";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Pendiente':
        return <Pending />;
      case 'En Proceso':
        return <HourglassBottom />;
      case 'Resuelto':
        return <Done />;
      case 'Cerrado':
        return <CheckCircle />;
      default:
        return null;
    }
  };

  const PriorityChip = ({ label, priority }: { label: string, priority: number }) => {
    const getColor = () => {
      switch (priority) {
        case 1: return 'success';
        case 2: return 'info';
        case 3: return 'warning';
        case 4: return 'error';
        case 5: return 'secondary';
        default: return 'default';
      }
    };

    return (
      <Box display="flex" alignItems="center">
        {priorityIcons[priority]}
        <Typography variant="body2" color={getColor()} sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
    );
  };

  if (!user) {
    return <Typography>Cargando información del usuario...</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ColoredPaper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Agregar Nueva Intervención
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <StyledCard sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Creado por:</Typography>
                <Typography>
                  {user?.firstName} {user?.lastName}
                </Typography>
              </CardContent>
            </StyledCard>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="title"
                      label="Título"
                      value={intervention.title}
                      onChange={handleTextFieldChange}
                      required
                      InputProps={{
                        endAdornment: renderTooltip('Ingrese un título descriptivo para la intervención')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Descripción"
                      multiline
                      rows={4}
                      value={intervention.description}
                      onChange={handleTextFieldChange}
                      required
                      InputProps={{
                        endAdornment: renderTooltip('Detalle la situación y el motivo de la intervención')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Intervención</InputLabel>
                      <Select
                        name="type"
                        value={intervention.type}
                        onChange={handleSelectChange}
                        required
                        endAdornment={renderTooltip('Seleccione el tipo de intervención')}
                      >
                        {Object.entries(typeDescriptions).map(([type, { icon, description }]) => (
                          <MenuItem key={type} value={type}>
                            <Box display="flex" alignItems="center" width="100%">
                              {icon}
                              <Typography variant="body2" sx={{ ml: 2, flexGrow: 1 }}>
                                {type}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        name="status"
                        value={intervention.status}
                        onChange={handleSelectChange}
                        required
                        endAdornment={renderTooltip('Seleccione el estado actual de la intervención')}
                      >
                        {['Pendiente', 'En Proceso', 'Resuelto', 'Cerrado'].map(
                          (status) => (
                            <MenuItem key={status} value={status}>
                              <Box display="flex" alignItems="center" width="100%">
                                <StatusIcon status={status} />
                                <Typography sx={{ ml: 1, flexGrow: 1 }}>{status}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {getStatusDescription(status)}
                                </Typography>
                              </Box>
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Prioridad</InputLabel>
                      <Select
                        name="priority"
                        value={intervention.priority.toString()}
                        onChange={(e) =>
                          setIntervention((prev) => ({
                            ...prev,
                            priority: Number(e.target.value),
                          }))
                        }
                        required
                        endAdornment={renderTooltip('Seleccione la prioridad de 1 a 5')}
                      >
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <MenuItem key={value} value={Number(value)}>
                            <Box display="flex" alignItems="center" width="100%">
                              <PriorityChip
                                label={label}
                                priority={Number(value)}
                              />
                              <Typography variant="body2" sx={{ ml: 2, flexGrow: 1 }}>
                                {getPriorityDescription(Number(value))}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha Reportada"
                        value={intervention.dateReported}
                        onChange={(date) => handleDateChange(date, 'dateReported')}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            InputProps: {
                              endAdornment: renderTooltip('Fecha en que se reportó la situación')
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Alcance de la Intervención</InputLabel>
                      <Select
                        name="interventionScope"
                        value={intervention.interventionScope}
                        onChange={handleSelectChange}
                        required
                        endAdornment={renderTooltip('Seleccione el alcance de la intervención')}
                      >
                        {['Individual', 'Grupal', 'Familiar'].map((scope) => (
                          <MenuItem key={scope} value={scope}>
                            <Box display="flex" alignItems="center" width="100%">
                              {scope === 'Individual' && <Person />}
                              {scope === 'Grupal' && <Group />}
                              {scope === 'Familiar' && <FamilyRestroom />}
                              <Typography variant="body2" sx={{ ml: 2, flexGrow: 1 }}>
                                {scope}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="actionsTaken"
                      label="Acciones Tomadas"
                      multiline
                      rows={2}
                      value={intervention.actionsTaken}
                      onChange={handleTextFieldChange}
                      helperText="Separe las acciones con comas"
                      required
                      InputProps={{
                        endAdornment: renderTooltip('Ingrese las acciones tomadas separadas por comas')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={intervention.requiresExternalReferral}
                          onChange={handleCheckboxChange}
                          name="requiresExternalReferral"
                        />
                      }
                      label="Requiere Referencia Externa"
                    />
                  </Grid>
                  {intervention.requiresExternalReferral && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="externalReferralDetails"
                        label="Detalles de Referencia Externa"
                        multiline
                        rows={2}
                        value={intervention.externalReferralDetails}
                        onChange={handleTextFieldChange}
                        required
                        InputProps={{
                          endAdornment: renderTooltip('Detalle de la referencia externa necesaria')
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              )}
              {activeStep === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="outcomeEvaluation"
                      label="Evaluación de Resultados"
                      multiline
                      rows={2}
                      value={intervention.outcomeEvaluation}
                      onChange={handleTextFieldChange}
                      required
                      InputProps={{
                        endAdornment: renderTooltip('Ingrese la evaluación de los resultados obtenidos')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="parentFeedback"
                      label="Retroalimentación de los Padres"
                      multiline
                      rows={2}
                      value={intervention.parentFeedback}
                      onChange={handleTextFieldChange}
                      required
                      InputProps={{
                        endAdornment: renderTooltip('Ingrese la retroalimentación proporcionada por los padres')
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de Seguimiento"
                        value={intervention.followUpDate}
                        onChange={(date) => handleDateChange(date, 'followUpDate')}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            InputProps: {
                              endAdornment: renderTooltip('Fecha programada para el seguimiento de la intervención')
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="responsible-label">
                        Usuario Responsable
                      </InputLabel>
                      <Select
                        labelId="responsible-label"
                        id="responsible"
                        value={intervention.responsible ? intervention.responsible.id : ''}
                        onChange={handleResponsibleChange}
                        required
                        endAdornment={renderTooltip('Seleccione el usuario responsable de la intervención')}
                      >
                        <MenuItem value="">
                          <em>Seleccione un usuario responsable</em>
                        </MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            <Box display="flex" alignItems="center" width="100%">
                              <Avatar sx={{ mr: 1 }}>
                                {user.profile.firstName[0]}
                                {user.profile.lastName[0]}
                              </Avatar>
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                {`${user.profile.firstName} ${user.profile.lastName}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.profile.position || 'No especificado'}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Seleccione el usuario responsable de esta intervención
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Atrás
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === steps.length - 1 ? (
                  <Button type="submit" variant="contained" color="primary">
                    Crear Intervención
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </form>
          </ColoredPaper>
        </motion.div>
      </Container>
    </LocalizationProvider>
  );
};

export default AddIntervention;
