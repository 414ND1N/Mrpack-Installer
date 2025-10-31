from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import modrinth as Mr
import utils as Utils
import minecraft as Mc
import json

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
        # GetMrpackMetadata is async, await its result
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
        
        print("java_arguments:", jargs)
        print("icon:", icon)
        print("mrpack_directory:", mrpack_directory)
        print("profile_directory:", profile_directory)

        await Mc.addVanillaLauncher(
            mrpack_directory=mrpack_directory,
            profile_directory=profile_directory,
            minecraft_directory=minecraft_directory,
            jargs=jargs,
            icon=icon
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vanilla launcher profile: {e}")

@app.post("/minecraft/install_mrpack/", summary="Install Mrpack to Minecraft")
async def install_mrpack(
    profile_directory: str = Query(..., description="Path to the profile directory"),
    mrpack_directory: str = Query(..., description="Path to the .mrpack file"),
    minecraft_directory: str = Query("", description="Path to the Minecraft directory (optional)")
) -> None:
    try:
        await Mc.InstallMrpack(
            profile_directory=profile_directory,
            mrpack_directory=mrpack_directory,
            minecraft_directory=minecraft_directory
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error installing mrpack: {e}")
    
@app.get("/minecraft/minecraft_directory/", summary="Get Minecraft directory")
async def get_minecraft_directory() -> str:
    try:
        return await Mc.getMinecraftDirectory()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting Minecraft directory: {e}")

if __name__ == "__main__":
    # Guard for local development. Use uvicorn from command line as recommended in README.
    print("Starting API on http://localhost:8001")

    uvicorn.run("api:app", host="127.0.0.1", port=8001, reload=True)
