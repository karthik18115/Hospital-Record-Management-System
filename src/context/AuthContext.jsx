import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextData';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null); // Or load from localStorage if you store user details

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            // If user data is available in the context, ensure its role is in localStorage
            if (user && user.role) {
                localStorage.setItem('userRole', user.role);
            } else {
                // If user is null but token exists, this implies we might need to fetch user
                // or that userRole was cleared elsewhere. For now, we won't clear userRole here
                // as login() will explicitly set it.
            }
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole'); // Also remove userRole on logout/token removal
            setUser(null);
        }
    }, [token, user]); // Add user to dependencies

    const login = (newToken, userData) => {
        localStorage.setItem('authToken', newToken); // Explicitly set token here too for immediate availability
        if (userData && userData.role) {
            localStorage.setItem('userRole', userData.role); // Explicitly set userRole
        } else {
            localStorage.removeItem('userRole'); // Or handle missing role appropriately
        }
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        setToken(null);
        setUser(null);
    };

    const getToken = () => {
        return token;
    };

    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, getToken, isAuthenticated, setUser, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

