from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import modrinth as Mr
import utils as Utils
import minecraft as Mc
from progress_manager import ProgressManager
import asyncio
import json
import os

app = FastAPI(title="Mrpack Installer API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # o ["*"] en desarrollo rápido
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary="Root")
def read_root():
    return {"message": "Mrpack Installer API", "version": app.version}


@app.get("/health", summary="Health check")
def health():
    return {"status": "ok"}


progress_manager = ProgressManager()
def sse_event(data: dict, event: str | None = None) -> str:
    payload = f"data: {json.dumps(data)}\n\n"
    if event:
        payload = f"event: {event}\n" + payload
    return payload

@app.post("/mrpack/install/start/")
async def start_install( payload: dict ):
    installation_type = payload.get("installation_type", "singleplayer")
    profile_directory = payload.get("profile_directory")
    mrpack_directory = payload.get("mrpack_directory")
    minecraft_directory = payload.get("minecraft_directory", "")

    if not mrpack_directory or not os.path.isfile(mrpack_directory):
        raise HTTPException(status_code=400, detail="mrpack not found")

    install_id = await progress_manager.create()

    asyncio.create_task(_run_install_background(install_id, installation_type, profile_directory, mrpack_directory, minecraft_directory))
    return {"install_id": install_id}

async def _run_install_background(install_id: str, installation_type, profile_directory, mrpack_directory, minecraft_directory):
    """
    Ejecuta la instalación en un thread.
    Los callbacks empujan mensajes a la cola del progress_manager.
    """
    # # callbacks que ponen en la cola
    # async def push_status(text: str):
    #     await progress_manager.push(install_id, {"type": "status", "text": text})

    # async def push_setmax(value: int):
    #     await progress_manager.push(install_id, {"type": "max", "value": value})

    # async def push_progress(value: int):
    #     await progress_manager.push(install_id, {"type": "progress", "value": value})

    # Get the running event loop so callbacks in other threads can schedule coroutines here
    loop = asyncio.get_running_loop()

    def setStatus_thread(text: str):
        asyncio.run_coroutine_threadsafe(progress_manager.push(install_id, {"type": "status", "message": text}), loop)

    def setMax_thread(value: int):
        asyncio.run_coroutine_threadsafe(progress_manager.push(install_id, {"type": "max", "value": value}), loop)

    def setProgress_thread(value: int):
        asyncio.run_coroutine_threadsafe(progress_manager.push(install_id, {"type": "progress", "value": value}), loop)

    try:
        # Ejecutar la instalación en thread para no bloquear el loop
        await asyncio.to_thread(
            Mc.InstallMrpack,
            profile_directory,
            mrpack_directory,
            installation_type,
            minecraft_directory,
            {"setStatus": setStatus_thread, "setMax": setMax_thread, "setProgress": setProgress_thread},
        )
        # al terminar
        await progress_manager.push(install_id, {"type":"done", "ok": True})
    except Exception as e:
        await progress_manager.push(install_id, {"type":"error", "message": str(e)})
    finally:
        # opcional: esperar un poco y limpiar la cola
        await asyncio.sleep(5)
        await progress_manager.finish(install_id)

@app.get("/install/stream/{install_id}")
async def install_stream(install_id: str):
    q = await progress_manager.get_queue(install_id)
    if not q:
        raise HTTPException(status_code=404, detail="install_id not found")

    async def event_generator():
        while True:
            item = await q.get()
            # si sentinel done: enviar y terminar
            if item.get("type") == "done":
                yield sse_event(item)
                break
            yield sse_event(item)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/modrinth/projects_random/", summary="Get random Modrinth projects")
async def get_random_modrinth_projects(count: int = Query(10, ge=1, le=100)) -> Any:
    """
        count: number of projects to request (1-100)
    """
    try:
        return Mr.GetRandomProjects(count=count)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")

@app.get("/modrinth/search/", summary="Search Modrinth projects")
async def search_modrinth_projects(
    limit: int = Query(10, ge=1, le=100),
    query: str | None = None,
    offset: int | None = None,
    type: str | None = None
) -> Any:
    """
        query: search query string
        limit: number of results to return (1-100)
        offset: number of results to skip
        type: optional project type filter (passed as "type" in query params)
    """
    try:
        return Mr.searchProjects(limit=limit, query=query, offset=offset, type=type)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")

@app.get("/mrpack/metadata/", summary="Get Mrpack metadata from file")
async def get_mrpack_metadata(file_path: str = Query(..., description="Path to the .mrpack file")) -> Any:
    try:
        return await Mr.GetMrpackMetadata(file_path=file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mrpack metadata: {e}")

@app.get("/mrpack/info/", summary="Get Mrpack info from file")
async def get_mrpack_info(file_path: str = Query(..., description="Path to the .mrpack file")) -> Any:
    try:
        return await Mr.GetMrpackInfo(file_path=file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mrpack info: {e}")

@app.get("/utils/path_join/", summary="Join paths")
async def path_join(paths: list[str] = Query(..., description="Paths to join")) -> str:
    try:
        return await Utils.PathJoin(*paths)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error joining paths: {e}")

@app.post("/minecraft/add_vanilla_launcher/", summary="Add Vanilla Launcher profile for Mrpack")
async def add_vanilla_launcher_profile(
    mrpack_directory: str = Query(..., description="Path to the .mrpack file"),
    profile_directory: str = Query(..., description="Path to the profile directory"),
    minecraft_directory: str = Query("", description="Path to the Minecraft directory (optional)"),
    java_min: int | None = Query(None, description="Minimum Java memory in GB (optional)"),
    java_max: int | None = Query(None, description="Maximum Java memory in GB (optional)"),
    icon: str | None = Query(None, description="Icon for the profile (optional)")
) -> None:
    try:
        jargs: list[str] | None = None
        if (java_min is not None) and (java_max is not None):

            if java_min < 1 or java_max < 1 or java_min > java_max:
                raise HTTPException(status_code=400, detail="Invalid java_min or java_max values")
            
            jargs = [java_min, java_max]

        await Mc.addVanillaLauncher(
            mrpack_directory=mrpack_directory,
            profile_directory=profile_directory,
            minecraft_directory=minecraft_directory,
            jargs=jargs,
            icon=icon
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vanilla launcher profile: {e}")

@app.get("/minecraft/minecraft_directory/", summary="Get Minecraft directory")
async def get_minecraft_directory() -> str:
    try:
        return await Mc.getMinecraftDirectory()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting Minecraft directory: {e}")

if __name__ == "__main__":
    # Guard for local development. Use uvicorn from command line as recommended in README.
    print("Starting API on http://localhost:8001")

    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
