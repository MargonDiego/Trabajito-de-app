import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { lightTheme, darkTheme } from './styles/theme';
import NavBar from './components/NavBar';
import Login from './components/Login';
import RecoverAccount from './components/RecoverAccount';
import Students from './components/Students';
import CreateStudentForm from './components/CreateStudentForm';
import EditStudentForm from './components/EditStudentForm';
import StudentDetail from './components/StudentDetail';
import CreateUser from './components/CreateUser';
import EditUserProfile from './components/EditUserProfile';
import ViewUserProfile from './components/ViewUserProfile';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import AddIntervention from './components/AddIntervention';
import InterventionDetail from './components/InterventionDetail';  

// Improved ProtectedRoute component with loading state
const ProtectedRoute: React.FC<{ element: React.ReactElement, allowedRoles?: string[] }> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // small delay to ensure AuthContext is updated
      setIsLoading(false);
    };
    checkAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Cargando...</div>; // or a loading component/spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NavBar toggleTheme={toggleTheme} mode={mode} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recover-account" element={<RecoverAccount />} />
          <Route path="/" element={<ProtectedRoute element={<Students />} />} />
          <Route path="/students" element={<ProtectedRoute element={<Students />} />} />
          <Route path="/students/new" element={<ProtectedRoute element={<CreateStudentForm />} />} />
          <Route path="/students/:id" element={<ProtectedRoute element={<StudentDetail />} />} />
          <Route path="/students/:id/edit" element={<ProtectedRoute element={<EditStudentForm />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-management" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['admin']}/>} />
          <Route path="/users/new" element={<CreateUser />} />
          <Route path="/profile" element={<ProtectedRoute element={<ViewUserProfile />} />} />
          <Route path="/profile/edit" element={<ProtectedRoute element={<EditUserProfile />} />} />
          <Route path="/students/:id" element={<ProtectedRoute element={<StudentDetail />} />} />
          <Route path="/interventions/:id" element={<ProtectedRoute element={<InterventionDetail />} />} />
          <Route path="/students/:studentId/add-intervention" element={<ProtectedRoute element={<AddIntervention />} />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
