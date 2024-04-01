import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('Home');

    return (
        <AppContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </AppContext.Provider>
    );
};