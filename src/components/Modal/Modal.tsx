import { Component, ReactNode } from "react"
import './Modal.css'

interface ModalProps {
  IsOpen: boolean;
  Blur?: boolean;
  children?: ReactNode;
  size?: string;
  title?: string;
  onClick?: () => void;
}

class Modal extends Component<ModalProps> {
  render() {
    const { IsOpen, Blur = false, size = "medium", children, title, onClick } = this.props
    if (!IsOpen) return null;

    return (
      <div className={`modal-component ${size} ${Blur ? 'blur' : ''}`} onClick={onClick}>

        <div className="modal-container">

          {
            title && (
              <div className="tittle-bar">
                <h1>{title}</h1>
              </div>
            )
          }
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal
