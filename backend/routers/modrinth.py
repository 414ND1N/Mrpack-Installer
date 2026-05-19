from typing import Any
from pydantic import BaseModel

from fastapi import HTTPException, Query, APIRouter
import services.modrinth.api as ModrinthApi
import services.modrinth.collections as ModrinthCollections
import asyncio
import os

modrinth_router = APIRouter()

class CollectionDownloadRequest(BaseModel):
    collection_id: str
    version: str | None = None
    loaders: list[str] | None = None
    directory: str | None = "mods"
    update: bool | None = False
    log: bool | None = True

@modrinth_router.post("/collection/download", summary="Download Modrinth collection and save mods to disk")
async def DownloadModrinthCollection(payload: CollectionDownloadRequest) -> Any:
    collection_id = payload.collection_id
    version = payload.version or ""
    loaders = payload.loaders or ""
    directory = payload.directory or "mods"
    update_existing = bool(payload.update)
    log = bool(payload.log)

    try:
        # Ensure download directory exists
        os.makedirs(directory, exist_ok=True)

        # Run blocking download in a thread pool
        result = await asyncio.to_thread(
            ModrinthCollections.DownloadCollectionMods,
            collection_id,
            version,
            loaders,
            directory,
            update_existing,
            log
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading Modrinth collection: {e}")

@modrinth_router.get("/collection/info/", summary="Get Modrinth collection info")
async def GetModrinthCollectionInfo(collection_id: str = Query(..., description="Modrinth collection ID")) -> Any:
    try:
        return ModrinthCollections.GetCollectionInfo(collection_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")

@modrinth_router.get("/collection/mods/verify", summary="Get mods in Modrinth collection")
async def GetModrinthCollectionMods(
    collection_id: str = Query(..., description="Modrinth collection ID"),
    version: str  = Query(None, description="Minecraft version filter"),
    loaders: str  = Query(None, description="Loader filter separated by commas")
) -> Any:
    try:
        loaders_list = [l.strip() for l in loaders.split(",") if l.strip()] if loaders else []
        return ModrinthCollections.VerifyModsInCollection(collection_id, version, loaders_list)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")
    
@modrinth_router.get("/projects/random/", summary="Get random Modrinth projects")
async def GetRandomModrinthProjects(count: int = Query(10, ge=1, le=100)) -> Any:
    """
        count: number of projects to request (1-100)
    """
    try:
        return ModrinthApi.GetRandomProjects(count=count)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")

@modrinth_router.get("/search/", summary="Search Modrinth projects")
async def SearchModrinthProjects(
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
        return ModrinthApi.searchProjects(limit=limit, query=query, offset=offset, type=type)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching from Modrinth: {e}")