import { useState } from "react"

import "./FileSelector.css"

const FileSelectorSvg = () => (
    <svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
        stroke="var(--font-color, #ffffff)">

        <g id="SVGRepo_bgCarrier" strokeWidth="0" />

        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

        <g id="SVGRepo_iconCarrier">
            <path d="M0 1H5L8 3H13V5H3.7457L2.03141 11H4.11144L5.2543 7H16L14 14H0V1Z" fill="var(--font-color, #ffffff)" />
        </g>

    </svg>
)

interface FileSelectorProps {
    AcceptExtensions:  string[];
    className?: string;
    FileCallback: (file: File) => void;
}

function FileSelector( { AcceptExtensions, FileCallback, className }: FileSelectorProps ) {
    const [fileName, setFileName] = useState < string | null > (null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {

            // Verificar la extensión del archivo
            const fileExtension = event.target.files[0].name.split('.').pop()?.toLowerCase();
            if (!AcceptExtensions.includes(`.${fileExtension}`)) {
                alert(`El archivo seleccionado no es válido. Debe ser uno de los siguientes tipos: ${AcceptExtensions.join(", ")}`);
                return;
            }

            setFileName(event.target.files[0].name)
            FileCallback(event.target.files[0]) // Llamar a la función FileActions con el archivo seleccionado
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {

            // Verificar la extensión del archivo
            const fileExtension = event.dataTransfer.files[0].name.split('.').pop()?.toLowerCase();
            if (!AcceptExtensions.includes(`.${fileExtension}`)) {
                alert(`El archivo arrastrado no es válido. Debe ser uno de los siguientes tipos: ${AcceptExtensions.join(", ")}`);
                return;
            }

            setFileName(event.dataTransfer.files[0].name)
            FileCallback(event.dataTransfer.files[0]) // Llamar a la función FileActions con el archivo seleccionado
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    return (
        <div
            className={"file-selector-component" + (className ? ` ${className}` : "")}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <label htmlFor="file-input" className="file-label">
                <FileSelectorSvg/>  
                <span>{fileName || "Importar archivo"}</span>
            </label>
            <input
                id="file-input"
                type="file"
                accept={AcceptExtensions.join(", ")}
                onChange={handleFileChange}
                className="file-input"
            />
        </div>
    )
}

export default FileSelector