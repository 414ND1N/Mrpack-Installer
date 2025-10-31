# Mrpack Installer - Backend

Pequeña API de ejemplo con FastAPI.

Requisitos:

- Python 3.8+

Instalación y ejecución (PowerShell):

```powershell
# crear y activar virtualenv
python -m venv .\venv; .\venv\Scripts\Activate.ps1

# instalar dependencias
pip install -r requirements.txt

# ejecutar con uvicorn (modo recarga para desarrollo)
uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

Endpoints disponibles:

- GET / -> Información básica
- GET /health -> Estado
- GET /mods -> Lista de mods (memoria)
- POST /mods -> Crear un mod (JSON: name, author?, description?)
