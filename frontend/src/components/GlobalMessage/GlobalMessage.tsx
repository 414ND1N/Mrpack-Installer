import React from "react"
import { useGlobalMessage } from "@/context/GlobalMessageContext"
import "./GlobalMessage.css" // Estilos para el modal

const GlobalMessageModal: React.FC = () => {
    const { message, hideMessage } = useGlobalMessage()

    if (!message) return null;

    return (
        <div className="global-message-modal">
            <div className="modal-content">
                <p>{message}</p>
                <button className="minecraft style-3" onClick={hideMessage}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default GlobalMessageModal;