"use client"
import { createContext, useContext, useState } from 'react';
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [link, setLink] = useState(null);
    const [setNo_of_vuln, no_of_vuln] = useState(null);

    return (
        <AuthContext.Provider
            value={{ link, setLink, setNo_of_vuln, no_of_vuln }}
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