from typing import Any
from fastapi import HTTPException, Query, APIRouter
import services.modrinth.mrpack as ModrinthMrpack
from services.progress_manager import ProgressManager
from fastapi.responses import StreamingResponse
import asyncio
import json
import os

mrpack_router = APIRouter()

def SseEvent(data: dict, event: str | None = None) -> str:
    payload = f"data: {json.dumps(data)}\n\n"
    if event:
        payload = f"event: {event}\n" + payload
    return payload

progress_manager = ProgressManager()
def sse_event(data: dict, event: str | None = None) -> str:
    payload = f"data: {json.dumps(data)}\n\n"
    if event:
        payload = f"event: {event}\n" + payload
    return payload

@mrpack_router.get("/install/stream/{install_id}")
async def InstallStream(install_id: str):
    q = await progress_manager.get_queue(install_id)
    if not q:
        raise HTTPException(status_code=404, detail="install_id not found")

    async def event_generator():
        while True:
            item = await q.get()
            if item.get("type") == "done":
                yield SseEvent(item)
                break
            yield SseEvent(item)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

async def StartBackgroundInstallation(install_id: str, installation_type, profile_directory, mrpack_directory, minecraft_directory):
    """
    Ejecuta la instalación en un thread.
    Los callbacks empujan mensajes a la cola del progress_manager.
    """

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
            ModrinthMrpack.InstallMrpack,
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


@mrpack_router.post("/install/start/")
async def StartInstallation( payload: dict ):
    installation_type = payload.get("installation_type", "singleplayer")
    profile_directory = payload.get("profile_directory")
    mrpack_directory = payload.get("mrpack_directory")
    minecraft_directory = payload.get("minecraft_directory", "")

    if not mrpack_directory or not os.path.isfile(mrpack_directory):
        raise HTTPException(status_code=400, detail="mrpack not found")

    install_id = await progress_manager.create()

    asyncio.create_task(StartBackgroundInstallation(install_id, installation_type, profile_directory, mrpack_directory, minecraft_directory))
    return {"install_id": install_id}

@mrpack_router.get("/metadata/", summary="Get Mrpack metadata from file")
async def GetMrpackData(file_path: str = Query(..., description="Path to the .mrpack file")) -> Any:
    try:
        return await ModrinthMrpack.GetMrpackMetadata(file_path=file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mrpack metadata: {e}")

@mrpack_router.get("/info/", summary="Get Mrpack info from file")
async def GerMarpackInformation(file_path: str = Query(..., description="Path to the .mrpack file")) -> Any:
    try:
        return await ModrinthMrpack.GetMrpackInfo(file_path=file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mrpack info: {e}")