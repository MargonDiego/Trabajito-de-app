import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

interface GradeDistribution {
  [grade: string]: number;
}

const StudentsByGrade: React.FC = () => {
  const [distribution, setDistribution] = useState<GradeDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const response = await api.get<GradeDistribution>('http://localhost:3000/api/students/grade-distribution');
        setDistribution(response.data);
      } catch (error) {
        console.error('Error fetching grade distribution:', error);
        setError('Error al cargar la distribución por grado');
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!distribution) return null;

  const totalStudents = Object.values(distribution).reduce((total, count) => total + count, 0);
  const chartData = Object.entries(distribution).map(([grade, count]) => ({
    grade,
    students: count,
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Estudiantes por Curso</Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Total de Estudiantes: {totalStudents}
      </Typography>
      <Box sx={{ my: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="grade" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => `${value} estudiantes`} />
            <Bar dataKey="students" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <List dense>
        {Object.entries(distribution).map(([grade, count]) => (
          <ListItem key={grade} sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', mb: 1, borderRadius: 1 }}>
            <ListItemText primary={`${grade}: ${count} estudiantes`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default StudentsByGrade;
