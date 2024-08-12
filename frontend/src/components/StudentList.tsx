import React, { useState, useEffect } from 'react';
import {
  Container,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  InputBase,
  Box,
  styled,
  Tooltip,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Sort,
  Refresh,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  isActive: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[5],
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get<Student[]>('http://localhost:3000/api/students');
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error al cargar la lista de estudiantes');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter((student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  const handleSortByName = () => {
    const sortedStudents = [...filteredStudents].sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    );
    setFilteredStudents(sortedStudents);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get<Student[]>('http://localhost:3000/api/students');
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error refreshing students:', error);
      setError('Error al actualizar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDeleteStudent = async () => {
    if (studentToDelete !== null) {
      try {
        await api.delete(`http://localhost:3000/api/students/${studentToDelete}`);
        setStudents((prev) => prev.filter((student) => student.id !== studentToDelete));
        setFilteredStudents((prev) => prev.filter((student) => student.id !== studentToDelete));
        setSnackbarOpen(true);
        handleCloseDeleteDialog();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error al eliminar el estudiante');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Lista de Estudiantes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/students/new')}
            sx={{ ml: 'auto' }} // This will push the button to the right
          >
            Añadir Estudiante
          </Button>
          <Tooltip title="Ordenar por Nombre">
            <IconButton onClick={handleSortByName} sx={{ ml: 1 }}>
              <Sort />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <StyledInputBase
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tooltip title="Buscar">
            <IconButton type="button" sx={{ p: '10px' }}>
              <Search />
            </IconButton>
          </Tooltip>
        </Box>
        <List>
          {filteredStudents.length === 0 ? (
            <Typography align="center">No hay estudiantes disponibles</Typography>
          ) : (
            filteredStudents.map((student) => (
              <React.Fragment key={student.id}>
                <StyledListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {student.firstName} {student.lastName}
                        </Typography>
                        {student.isActive ? (
                          <CheckCircle color="success" fontSize="small" />
                        ) : (
                          <Cancel color="error" fontSize="small" />
                        )}
                      </Box>
                    }
                    secondary={`Grado: ${student.grade} | Estado: ${
                      student.isActive ? 'Activo' : 'Inactivo'
                    }`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Ver Detalles">
                      <IconButton onClick={() => navigate(`/students/${student.id}`)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Estudiante">
                      <IconButton onClick={() => navigate(`/students/${student.id}/edit`)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Estudiante">
                      <IconButton onClick={() => handleOpenDeleteDialog(student.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </StyledListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </StyledPaper>
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este estudiante? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeleteStudent} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Estudiante eliminado con éxito"
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            CERRAR
          </Button>
        }
      />
    </Container>
  );
};

export default StudentList;
