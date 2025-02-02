"use client"
import { createContext, useContext, useState } from 'react';
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [link,setLink] = useState('');
    const [data,setData] = useState([]);

    return (
        <AuthContext.Provider
            value={{ link, setLink, data, setData }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error('useAuth used outside of the Provider');
    }
    return authContextValue;
};