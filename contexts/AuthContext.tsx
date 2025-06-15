
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, phoneNumber: string) => Promise<void>;
  register: (username: string, phoneNumber: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'aiPromptArchitectUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, phoneNumber: string): Promise<void> => {
    // Simulate API call & validation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          if (parsedUser.username === username && parsedUser.phoneNumber === phoneNumber) {
            setCurrentUser(parsedUser);
            resolve();
            return;
          }
        }
        // This is a simplified check. In a real app, you'd query a backend.
        // For this simulation, we'll allow login if any user is registered.
        // A more robust simulation would require checking against a list of registered users.
        // Here, we just simulate a successful login if some user exists.
        // If no user exists, or if we wanted to enforce exact match from registration step:
        // reject(new Error("Invalid credentials or user not found. Please register first."));
        
        // For simplicity, if a user exists, let's log them in, otherwise create new.
        // This is not ideal for a real login but works for this simulation.
        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            if(user.username === username && user.phoneNumber === phoneNumber) {
                 setCurrentUser(user);
                 resolve();
                 return;
            }
        }
        // If we reach here, means no matching user or no user at all.
        // Let's treat login as "login or create if not exists" for simplicity of single-page app demo.
        // A real app would separate login and registration strictly.
        const newUser: User = { id: Date.now().toString(), username, phoneNumber };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve();

      }, 500);
    });
  };

  const register = async (username: string, phoneNumber: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, you'd check if username/phone already exists.
        // For this simulation, we'll overwrite.
        const newUser: User = { id: Date.now().toString(), username, phoneNumber };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};