import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Typography, Box, Modal, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import api from '../utils/api';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';

interface User {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  staffType: string | null;
  subjectsTeaching: string[];
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
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditUser = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`);
      setSelectedUser(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleViewUser = async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`);
      setSelectedUser(response.data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleOpenDeleteDialog = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDeleteUser = async () => {
    if (userToDelete !== null) {
      try {
        await api.delete(`/users/${userToDelete}`);
        fetchUsers(); // Refetch users to update the list
        handleCloseDeleteDialog();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <Box sx={{ m: 2, p: 2, bgcolor: 'background.default', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
        Gestión de Usuarios
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={handleCreateUser}
        sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        Crear Usuario
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'secondary.light' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                <TableCell>{`${user.profile.firstName} ${user.profile.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: user.isActive ? 'success.main' : 'error.main' }}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewUser(user.id)} sx={{ color: 'info.main' }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditUser(user.id)} sx={{ color: 'warning.main' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(user.id)} sx={{ color: 'error.main' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        aria-labelledby="modal-create-user"
        aria-describedby="modal-create-new-user"
      >
        <Box
          sx={{
            position: "absolute",
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '80vw', // Increase modal width
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <CreateUser />
          <Button 
            onClick={() => { 
              setIsCreateModalOpen(false);
              fetchUsers();
            }}
            sx={{ mt: 2, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '80vw', // Increase modal width
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          {selectedUser && <EditUser user={selectedUser} onClose={() => { setIsEditModalOpen(false); fetchUsers(); }} />}
        </Box>
      </Modal>

      <Modal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '80vw', // Increase modal width
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          {selectedUser && <ViewUser user={selectedUser} onClose={() => setIsViewModalOpen(false)} />}
        </Box>
      </Modal>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeleteUser} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
