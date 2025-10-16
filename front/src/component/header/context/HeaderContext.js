import React, { createContext, useState, useContext } from 'react';

const HeaderContext = createContext();

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [isCheckHeader, setIsCheckHeader] = useState("True");

    const value = {
        isCheckHeader,
        setIsCheckHeader,
    };

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};