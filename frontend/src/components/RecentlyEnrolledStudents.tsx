import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Avatar, 
  Box, 
  Button,
  Alert 
} from '@mui/material';
import api from '../utils/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale español

interface RecentStudent {
  id: number;
  firstName: string;
  lastName: string;
  enrollmentDate: string;
}

const RecentlyEnrolledStudents: React.FC = () => {
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get<RecentStudent[]>('http://localhost:3000/api/students/recently-enrolled');
      setRecentStudents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching recent students:', error);
      setError('Error al cargar los estudiantes recientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentStudents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando estudiantes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={fetchRecentStudents}>
          Reintentar
        </Button>
      </Box>
    );
  }

  if (recentStudents.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No hay estudiantes recientes matriculados en el momento.
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Estudiantes Matriculados Recientemente</Typography>
      <List dense>
        {recentStudents.map((student) => (
          <ListItem 
            key={student.id} 
            sx={{ mb: 1, borderRadius: 1, bgcolor: 'rgba(0, 0, 0, 0.03)' }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {student.firstName[0]}{student.lastName[0]}
            </Avatar>
            <ListItemText 
              primary={`${student.firstName} ${student.lastName}`} 
              secondary={`Matriculado el: ${format(new Date(student.enrollmentDate), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentlyEnrolledStudents;
