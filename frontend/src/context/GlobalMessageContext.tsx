import React, { createContext, useState, useContext } from "react";

interface GlobalMessageContextProps {
    message: string | null;
    showMessage: (message: string) => void;
    hideMessage: () => void;
}

const GlobalMessageContext = createContext<GlobalMessageContextProps | undefined>(undefined);

export const GlobalMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);

    const showMessage = (newMessage: string) => {
        setMessage(newMessage);
    }

    const hideMessage = () => {
        setMessage(null);
    }

    return (
        <GlobalMessageContext.Provider value={{ message, showMessage, hideMessage }}>
            {children}
        </GlobalMessageContext.Provider>
    )
};

export const useGlobalMessage = (): GlobalMessageContextProps => {
    const context = useContext(GlobalMessageContext);
    if (!context) {
        throw new Error("useGlobalMessage must be used within a GlobalMessageProvider");
    }
    return context;
}