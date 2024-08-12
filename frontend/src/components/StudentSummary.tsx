import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  CircularProgress, 
  Card, 
  CardContent, 
  Box,
  LinearProgress,
  Tooltip,
  IconButton,
  styled,
} from '@mui/material';
import { 
  PeopleAlt, 
  School, 
  AttachMoney, 
  Refresh,
  Person,
  EmojiEvents,
} from '@mui/icons-material';
import api from '../utils/api';
import { motion } from 'framer-motion';

interface StudentSummaryData {
  totalStudents: number;
  activeStudents: number;
  studentsWithScholarship: number;
}

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: theme.palette.common.white,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  height: '100%', // Ensure the card takes the full height
  display: 'flex', // Flexbox to stretch content
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
}));

const StudentSummary: React.FC = () => {
  const [summary, setSummary] = useState<StudentSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get<StudentSummaryData>('http://localhost:3000/api/students/summary');
      setSummary(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Error al cargar el resumen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>Resumen de Estudiantes</Typography>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={fetchSummary} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <GradientCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Total de Estudiantes</Typography>
                  <PeopleAlt fontSize="large" />
                </Box>
                <Typography variant="h3" component="div">{summary.totalStudents}</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Person />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    {summary.totalStudents > 1 ? 'Estudiantes inscritos' : 'Estudiante inscrito'}
                  </Typography>
                </Box>
              </CardContent>
            </GradientCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <GradientCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Estudiantes Activos</Typography>
                  <School fontSize="large" />
                </Box>
                <Typography variant="h3" component="div">{summary.activeStudents}</Typography>
                <Box mt={2}>
                  <StyledLinearProgress 
                    variant="determinate" 
                    value={(summary.activeStudents / summary.totalStudents) * 100} 
                  />
                </Box>
                <Typography variant="body2" align="right" mt={1}>
                  {(summary.activeStudents / summary.totalStudents * 100).toFixed(2)}% Activos
                </Typography>
              </CardContent>
            </GradientCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <GradientCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Estudiantes con Beca</Typography>
                  <AttachMoney fontSize="large" />
                </Box>
                <Typography variant="h3" component="div">{summary.studentsWithScholarship}</Typography>
                <Box mt={2}>
                  <StyledLinearProgress 
                    variant="determinate" 
                    value={(summary.studentsWithScholarship / summary.totalStudents) * 100} 
                  />
                </Box>
                <Typography variant="body2" align="right" mt={1}>
                  {(summary.studentsWithScholarship / summary.totalStudents * 100).toFixed(2)}% con Beca
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <EmojiEvents />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Estudiantes destacados
                  </Typography>
                </Box>
              </CardContent>
            </GradientCard>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default StudentSummary;
