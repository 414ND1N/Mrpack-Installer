import React from "react"
import { useGlobalMessage } from "@/context/GlobalMessageContext"
import "./GlobalMessage.css" // Estilos para el modal
import { MCButton } from "@/components/MC/MC";

const GlobalMessageModal: React.FC = () => {
    const { message, hideMessage, showClose } = useGlobalMessage()

    if (!message) return null;

    return (
        <div className="global-message-modal">
            <div className="modal-content">
                <p>{message}</p>
                {showClose ? (
                    // <button className="minecraft style-3" onClick={hideMessage}>
                    //     Cerrar
                    // </button>
                    <MCButton variant="ghost" onClick={hideMessage}>
                        Cerrar
                    </MCButton>
                ) : null}
            </div>
        </div>
    );
};

export default GlobalMessageModal;