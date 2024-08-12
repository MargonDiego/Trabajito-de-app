import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Skeleton,
  LinearProgress,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import api from '../utils/api';
import { styled } from '@mui/material/styles';
import { Person, School, Info, ArrowBack, Save, Edit, ExpandMore, CheckCircle, ErrorOutline, HourglassEmpty, Cancel } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import the Comments component
import Comments from './Comments';

// Define the User interface
interface User {
  id: number;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    position?: string;
  };
}

// Interface for Intervention
interface Intervention {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: number;
  dateReported: string;
  informer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    position: string;
  } | null;
  responsible: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    position?: string;
  } | null;
  interventionScope: string;
  actionsTaken: string[];
  outcomeEvaluation?: string;
  followUpDate?: string;
  parentFeedback?: string;
  requiresExternalReferral: boolean;
  externalReferralDetails?: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    rut: string;
    grade?: string;
  };
}

// Priority labels mapping
const priorityLabels = {
  1: 'Baja',
  2: 'Media-Baja',
  3: 'Media',
  4: 'Media-Alta',
  5: 'Alta',
};

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'box-shadow 0.3s, transform 0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    transform: 'translateY(-4px)',
  },
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PriorityChip = styled(Chip)<{ priority: number }>(({ theme, priority }) => {
  const getColor = () => {
    switch (priority) {
      case 1: return theme.palette.success.main;
      case 2: return theme.palette.info.main;
      case 3: return theme.palette.warning.light;
      case 4: return theme.palette.warning.main;
      case 5: return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  return {
    backgroundColor: getColor(),
    color: theme.palette.getContrastText(getColor()),
    fontWeight: 'bold',
  };
});

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Resuelto':
      return <CheckCircle color="success" />;
    case 'En Proceso':
      return <HourglassEmpty color="warning" />;
    case 'Pendiente':
      return <ErrorOutline color="error" />;
    case 'Cerrado':
      return <Cancel color="action" />;
    default:
      return null;
  }
};

const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [tempFollowUpDate, setTempFollowUpDate] = useState<dayjs.Dayjs | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchInterventionData = useCallback(async () => {
    try {
      const response = await api.get(`/interventions/${id}`);
      setIntervention(response.data);
      setTempFollowUpDate(
        response.data.followUpDate ? dayjs(response.data.followUpDate) : null
      );
    } catch (error) {
      console.error('Error fetching intervention data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInterventionData();
  }, [fetchInterventionData]);

  const handleUpdateIntervention = async (
    field: keyof Intervention,
    value: string | number | string[] | boolean | null | User
  ) => {
    if (!intervention) return;

    try {
      const dataToSend: Partial<Intervention> = {};

      switch (field) {
        case 'followUpDate':
        case 'outcomeEvaluation':
        case 'parentFeedback':
        case 'externalReferralDetails':
          dataToSend[field] = value === null ? undefined : value as string;
          break;
        case 'actionsTaken':
          dataToSend[field] = value as string[];
          break;
        case 'priority':
          dataToSend[field] = value as number;
          break;
        case 'requiresExternalReferral':
          dataToSend[field] = value as boolean;
          break;
        case 'responsible':
          dataToSend[field] = value ? (value as User).id : null; // Send only ID for responsible
          break;
        default:
          dataToSend[field] = value as string | number | boolean;
          break;
      }

      setIntervention((prev) =>
        prev ? { ...prev, [field]: value } : null
      );
      await api.put(`/interventions/${id}`, dataToSend);
      await fetchInterventionData();
    } catch (error) {
      console.error('Error updating intervention:', error);
    }
  };

  const handleSave = async () => {
    if (!intervention) return;

    try {
      const updatedData = {
        title: intervention.title,
        description: intervention.description,
        type: intervention.type,
        requiresExternalReferral: intervention.requiresExternalReferral,
        externalReferralDetails: intervention.externalReferralDetails,
        followUpDate: tempFollowUpDate
          ? tempFollowUpDate.format('DD-MM-YYYY')
          : null,
        responsible: intervention.responsible?.id
      };

      await api.put(`/interventions/${id}`, updatedData);
      setSnackbar({
        open: true,
        message: 'Cambios guardados con éxito',
        severity: 'success',
      });
      setEditMode(false);
      await fetchInterventionData();
    } catch (error) {
      console.error('Error saving intervention:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar los cambios',
        severity: 'error',
      });
    }
  };

  const getInterventionProgress = (intervention: Intervention): number => {
    let progress = 0;
    if (intervention.description) progress += 20;
    if (intervention.actionsTaken.length > 0) progress += 20;
    if (intervention.outcomeEvaluation) progress += 20;
    if (intervention.parentFeedback) progress += 20;
    if (intervention.status === 'Resuelto') progress += 20;
    return progress;
  };

  const getInterventionProgressText = (intervention: Intervention): string => {
    const progress = getInterventionProgress(intervention);
    if (progress === 100) return 'Intervención completada';
    if (progress >= 80) return 'Intervención en etapa final';
    if (progress >= 60) return 'Intervención avanzada';
    if (progress >= 40) return 'Intervención en progreso';
    if (progress >= 20) return 'Intervención iniciada';
    return 'Intervención en etapa inicial';
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Skeleton variant="rectangular" width="100%" height={150} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!intervention) {
    return <Typography>No se encontró la intervención</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Container maxWidth="md">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  variant="outlined"
                  color="primary"
                >
                  Volver
                </Button>
                <Box>
                  {editMode ? (
                    <Button
                      startIcon={<Save />}
                      onClick={handleSave}
                      color="primary"
                      variant="contained"
                    >
                      Guardar
                    </Button>
                  ) : (
                    <Tooltip title="Editar intervención">
                      <IconButton
                        onClick={() => setEditMode(true)}
                        color="primary"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
              <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={intervention.title}
                    onChange={(e) =>
                      handleUpdateIntervention('title', e.target.value)
                    }
                    variant="standard"
                    InputProps={{
                      style: { fontSize: '2rem', textAlign: 'center' },
                    }}
                  />
                ) : (
                  intervention.title
                )}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Fade in={true} timeout={1000}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          Información General
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Person sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                <strong>Estudiante:</strong> {intervention.student.firstName} {intervention.student.lastName}
                              </Box>
                              <Box display="flex" alignItems="center" mb={1}>
                                <Info sx={{ mr: 1, color: theme.palette.info.main }} />
                                <strong>RUT:</strong> {intervention.student.rut}
                              </Box>
                              {intervention.student.grade && (
                                <Box display="flex" alignItems="center" mb={1}>
                                  <School sx={{ mr: 1, color: theme.palette.success.main }} />
                                  <strong>Curso:</strong> {intervention.student.grade}
                                </Box>
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                <strong>Tipo:</strong> {intervention.type}
                              </Box>
                              <Box display="flex" alignItems="center" mb={1}>
                                <strong>Fecha Reportada:</strong> {new Date(intervention.dateReported).toLocaleDateString()}
                              </Box>
                              {editMode ? (
                                <>
                                  <FormControl fullWidth margin="normal">
                                    <InputLabel>Prioridad</InputLabel>
                                    <Select
                                      value={intervention.priority}
                                      onChange={(e) =>
                                        handleUpdateIntervention('priority', Number(e.target.value))
                                      }
                                    >
                                      {Object.entries(priorityLabels).map(([value, label]) => (
                                        <MenuItem key={value} value={Number(value)}>
                                          <PriorityChip
                                            label={label}
                                            priority={Number(value)}
                                            size="small"
                                          />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <FormControl fullWidth margin="normal">
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                      value={intervention.status}
                                      onChange={(e) =>
                                        handleUpdateIntervention('status', e.target.value)
                                      }
                                    >
                                      {['Pendiente', 'En Proceso', 'Resuelto', 'Cerrado'].map(
                                        (status) => (
                                          <MenuItem key={status} value={status}>
                                            <Box display="flex" alignItems="center">
                                              <StatusIcon status={status} />
                                              <Typography sx={{ ml: 1 }}>{status}</Typography>
                                            </Box>
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </>
                              ) : (
                                <>
                                  <Box display="flex" alignItems="center" mb={1}>
                                    <strong>Prioridad:</strong>
                                    <PriorityChip
                                      label={priorityLabels[intervention.priority as keyof typeof priorityLabels]}
                                      priority={intervention.priority}
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Box>
                                  <Box display="flex" alignItems="center">
                                    <strong>Estado:</strong>
                                    <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                                      <StatusIcon status={intervention.status} />
                                      <Typography sx={{ ml: 0.5 }}>{intervention.status}</Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </StyledCard>
                  </Fade>
                </Grid>

                <Grid item xs={12}>
                  <Fade in={true} timeout={1500}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          Descripción
                        </Typography>
                        <Typography variant="body2">
                          {editMode ? (
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              value={intervention.description}
                              onChange={(e) =>
                                handleUpdateIntervention('description', e.target.value)
                              }
                              variant="outlined"
                            />
                          ) : (
                            intervention.description
                          )}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Fade>
                </Grid>

                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>Detalles de la Intervención</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Alcance de la Intervención</InputLabel>
                            <Select
                              value={intervention.interventionScope}
                              onChange={(e) =>
                                handleUpdateIntervention('interventionScope', e.target.value)
                              }
                            >
                              {['Individual', 'Grupal', 'Familiar'].map((scope) => (
                                <MenuItem key={scope} value={scope}>
                                  {scope}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          {editMode ? (
                            <DatePicker
                              label="Fecha de Seguimiento"
                              value={tempFollowUpDate}
                              onChange={(date) => setTempFollowUpDate(date)}
                              format="DD/MM/YYYY"
                              slotProps={{
                                textField: { fullWidth: true, margin: 'normal' },
                              }}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              label="Fecha de Seguimiento"
                              value={
                                tempFollowUpDate
                                  ? tempFollowUpDate.format('DD/MM/YYYY')
                                  : 'No establecida'
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                              margin="normal"
                            />
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Evaluación de Resultados"
                            value={intervention.outcomeEvaluation || ''}
                            onChange={(e) =>
                              handleUpdateIntervention('outcomeEvaluation', e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Retroalimentación de los Padres"
                            value={intervention.parentFeedback || ''}
                            onChange={(e) =>
                              handleUpdateIntervention('parentFeedback', e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>Responsable e Informante</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Card elevation={6}>
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>Informante</Typography>
                              {intervention.informer ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                  <Box display="flex" alignItems="center" mb={1}>
                                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>
                                      {intervention.informer.firstName[0]}
                                      {intervention.informer.lastName[0]}
                                      
                                    </Avatar>
                                    <Typography variant="body1">
                                      <strong>{intervention.informer.firstName} {intervention.informer.lastName}</strong>
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ ml: 7, mb: 1 }}>
                                    <strong>Cargo:</strong> {intervention.informer.position}
                                  </Typography>
                                  <Typography variant="body2" sx={{ ml: 7 }}>
                                    <strong>Email:</strong> {intervention.informer.email}
                                  </Typography>
                                </motion.div>
                              ) : (
                                <Typography variant="body1">No especificado</Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card elevation={6}>
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>Responsable</Typography>
                              {editMode ? (
                                <FormControl fullWidth>
                                  <InputLabel>Responsable</InputLabel>
                                  <Select
                                    value={intervention.responsible?.id || ''}
                                    onChange={(e) => handleUpdateIntervention('responsible', users.find(u => u.id === Number(e.target.value)) || null)}
                                    renderValue={(selected) => {
                                      const selectedUser = users.find((u) => u.id === selected);
                                      return selectedUser
                                        ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName} - ${selectedUser.profile.position}`
                                        : 'Ninguno';
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Ninguno</em>
                                    </MenuItem>
                                    {users.map((user) => (
                                      <MenuItem key={user.id} value={user.id}>
                                        <Box display="flex" alignItems="center">
                                          <Avatar sx={{ mr: 2 }}>
                                            {user.profile.firstName[0]}
                                            {user.profile.lastName[0]}
                                          </Avatar>
                                          {user.profile.firstName} {user.profile.lastName} - {user.profile.position} - {user.email}
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                intervention.responsible ? (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                      <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                                        {intervention.responsible.firstName[0]}
                                        {intervention.responsible.lastName[0]}
                                      </Avatar>
                                      <Typography variant="body1">
                                        <strong>{intervention.responsible.firstName} {intervention.responsible.lastName}</strong>
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ ml: 7, mb: 1 }}>
                                      <strong>Cargo:</strong> {intervention.responsible.position || 'No especificado'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ ml: 7 }}>
                                      <strong>Email:</strong> {intervention.responsible.email || 'No especificado'}
                                    </Typography>
                                  </motion.div>
                                ) : (
                                  <Typography variant="body1">No asignado</Typography>
                                )
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                <Grid item xs={12}>
                  <Fade in={true} timeout={2000}>
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>Progreso de la Intervención</Typography>
                        <Tooltip title={getInterventionProgressText(intervention)} placement="top">
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={getInterventionProgress(intervention)}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                my: 2,
                                bgcolor: theme.palette.grey[300],
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 5,
                                  bgcolor: theme.palette.success.main,
                                },
                              }}
                            />
                          </Box>
                        </Tooltip>
                        <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                          {getInterventionProgressText(intervention)}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Fade>
                </Grid>

                <Grid item xs={12}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>Comentarios</Typography>
                      <Comments interventionId={intervention.id} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </AnimatePresence>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default InterventionDetail;
