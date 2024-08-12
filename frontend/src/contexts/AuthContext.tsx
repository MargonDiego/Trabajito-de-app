import { createContext, useContext, useEffect, ReactNode, useReducer } from 'react';
import api from '../utils/api'; // Asegúrate de que esta ruta sea correcta

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

const authReducer = (state: AuthContextType, action: AuthAction): AuthContextType => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    login: (token: string, userData: User) => dispatch({ type: 'LOGIN', payload: { token, user: userData } }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/verify-token');
          if (response.status === 200) {
            const userDataString = localStorage.getItem('user');
            if (userDataString) {
              const userData = JSON.parse(userDataString) as User;
              dispatch({ type: 'LOGIN', payload: { token, user: userData } });
            }
          } else {
            throw new Error('Token inválido');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
  
    verifyToken();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };