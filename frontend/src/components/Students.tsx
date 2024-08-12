import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import StudentList from './StudentList';
import StudentSummary from './StudentSummary';
import StudentsByGrade from './StudentsByGrade';
import RecentlyEnrolledStudents from './RecentlyEnrolledStudents';

const Students: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const Header = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de Gestión Estudiantil
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const Footer = () => (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary">
        © 2024 Sistema de Gestión Estudiantil. Todos los derechos reservados.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, px: 3, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Estudiantes
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateAreas: `
                "RESUMEN-DE-ESTUDIANTES RESUMEN-DE-ESTUDIANTES RESUMEN-DE-ESTUDIANTES"
                "LISTA-DE-ESTUDIANTES LISTA-DE-ESTUDIANTES ESTUDIANTES-POR-CURSO"
                "LISTA-DE-ESTUDIANTES LISTA-DE-ESTUDIANTES ESTUDIANTES-MATRICULADOS-RECIENTEMENTE"
              `,
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'auto',
              gap: 2,
            }}
          >
            <Box sx={{ gridArea: 'RESUMEN-DE-ESTUDIANTES', mb: 2 }}>
              <StudentSummary />
            </Box>
            <Paper elevation={3} sx={{ gridArea: 'LISTA-DE-ESTUDIANTES', p: 2, overflow: 'auto' }}>
              <StudentList />
            </Paper>
            <Box sx={{ gridArea: 'ESTUDIANTES-POR-CURSO' }}>
              <StudentsByGrade />
            </Box>
            <Box sx={{ gridArea: 'ESTUDIANTES-MATRICULADOS-RECIENTEMENTE' }}>
              <RecentlyEnrolledStudents />
            </Box>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default Students;
