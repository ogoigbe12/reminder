import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

interface AuthContextData extends AuthState {
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        // Optional: Check if token is expired using jwtDecode
        const user = jwtDecode(token);
        
        // Set token header for api
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setState({
          token,
          isAuthenticated: true,
          isLoading: false,
          user, // In a real app, might want to fetch full profile
        });
      } else {
        setState({ ...state, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load token', error);
      setState({ ...state, isLoading: false });
    }
  };

  const login = async (token: string, user: any) => {
    await Keychain.setGenericPassword('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setState({
      token,
      isAuthenticated: true,
      isLoading: false,
      user,
    });
  };

  const logout = async () => {
    await Keychain.resetGenericPassword();
    delete api.defaults.headers.common['Authorization'];
    setState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
