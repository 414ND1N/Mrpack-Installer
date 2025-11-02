# Mrpack Installer

---

<a href="https://www.electronjs.org/" target="_blank"><img src="https://img.shields.io/badge/-Electron-9feaf9?style=for-the-badge&logo=electron&logoColor=black"/></a>    <a href="https://es.react.dev/" target="_blank"><img src="https://img.shields.io/badge/-React-087ea4?style=for-the-badge&logo=react&logoColor=black"/></a>    <a href="https://www.python.org/" target="_blank"><img src="https://img.shields.io/badge/-Python-ffdd56?style=for-the-badge&logo=python&logoColor=blue"/></a>   <a href="https://modrinth.com/" target="_blank"><img src="https://img.shields.io/badge/-Modrinth-00af5c?style=for-the-badge&logo=modrinth&logoColor=black"/></a>

---
# 📋 Descripción

Una herramienta de escritorio simple para instalar modpacks de Minecraft desde archivos .mrpack de Modrinth.

La aplicación se encarga de todo: analiza el archivo, descarga todas las dependencias (mods, loaders), instala la versión correcta de Minecraft y crea automáticamente un nuevo perfil en el launcher oficial.

# ✨ Características

* Instalación Sencilla: Arrastra y suelta (o selecciona) tu archivo .mrpack para comenzar.

* Gestión de Dependencias: Resuelve y descarga todos los mods y loaders (Forge, Fabric, Quilt) necesarios desde Modrinth.

* Instalación de Versión: Instala la versión correcta de Minecraft si aún no la tienes.

* Integración Total: Crea un perfil de juego completo en el launcher oficial de Minecraft. No necesitas configurar nada manualmente.

* Actualizaciones Automáticas: La aplicación (próximamente) buscará e instalará nuevas versiones de sí misma al iniciar.

* Interfaz Limpia: Una GUI moderna e intuitiva construida con React.

# 🚀 Instalación (Para Usuarios)

1. Ve a la página de Releases de este repositorio.
2. Descarga el archivo Mrpack-Installer-Setup-X.X.X.exe de la última versión.
3. Ejecuta el instalador. ¡Y listo!

# 💻 Pila Tecnológica

Este proyecto utiliza una arquitectura híbrida:

* Frontend (GUI): Electron + React (usando Vite).

* Backend (Lógica): Python con FastAPI. El backend corre como una API local (http://localhost:8001) para manejar la lógica pesada de descargar archivos y gestionar el launcher de Minecraft.

* Empaquetado: Electron Builder empaqueta la app de Electron, y PyInstaller compila el script de Python en un backend.exe que se incluye dentro de la app.

# 🛠️ Desarrollo (Correr Localmente)

¿Quieres contribuir o modificar el proyecto?

## Requisitos previos:

* Node.js (v18+ recomendado)
* Python (v3.10+ recomendado)
* npm o pnpm

## Pasos:

1. Clonar el repositorio:

```bash
git clone https://github.com/414ND1N/Mrpack-Installer.git
cd Mrpack-Installer
```

2. Preparar el Backend (Python):

* Ve a la carpeta del backend (ej. backend/).
* Crea un entorno virtual: python -m venv venv
* Actívalo (Windows): .\venv\Scripts\activate
* Instala las dependencias: pip install -r requirements.txt

3. Preparar el Frontend (Electron/React):

* Regresa a la raíz del proyecto.
* Instala las dependencias de Node.js:

```bash
npm install
```

4. Ejecutar

El script dev lanzará el backend de Python y la app de Electron simultáneamente.

```
npm run dev
```

# 📦 Compilación (Build)

Para crear el instalador .exe final:

1. Compilar el Backend:

* Activa tu entorno virtual de Python.
* Ve a la carpeta del backend y ejecuta:

```bash
pyinstaller --onefile --name backend api.py
```

* Mueve el backend.exe resultante (de la carpeta dist/) a la carpeta backend/ en la raíz del proyecto.

2.  Compilar y Empaquetar Electron:

Desde la raíz del proyecto, corre:

```bash
npm run build
```

Esto generará el instalador en la carpeta dist/.

# Bibliotecas/Herramientas Utilizadas

* Electron
* React
* FastAPI
* PyInstaller
* [Modrinth API](https://support.modrinth.com/en/)
* [Minecraft Launcher Lib](https://minecraft-launcher-lib.readthedocs.io/en/stable/introduction.html)

> Un agradecimiento especial a **Modrinth** por crear el formato .mrpack y la API que facilita la descarga de mods y modpacks, y a **Minecraft Launcher Lib** por simplificar la gestión del launcher de Minecraft.

