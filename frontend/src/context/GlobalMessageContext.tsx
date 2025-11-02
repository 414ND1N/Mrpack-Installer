import React, { createContext, useState, useContext } from "react";

interface GlobalMessageContextProps {
    message: string | null;
    showClose: boolean;
    showMessage: (message: string, options?: { showClose?: boolean }) => void;
    hideMessage: () => void;
}

const GlobalMessageContext = createContext<GlobalMessageContextProps | undefined>(undefined);

export const GlobalMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [showClose, setShowClose] = useState<boolean>(true);

    const showMessage = (newMessage: string, options?: { showClose?: boolean }) => {
        setMessage(newMessage);
        if (options && typeof options.showClose === 'boolean') {
            setShowClose(options.showClose);
        } else {
            setShowClose(true);
        }
    }

    const hideMessage = () => {
        setMessage(null);
        setShowClose(true);
    }

    return (
        <GlobalMessageContext.Provider value={{ message, showClose, showMessage, hideMessage }}>
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