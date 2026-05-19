from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers.minecraft import minecraft_router
from routers.modrinth import modrinth_router
from routers.mrpack import mrpack_router
from routers.utils import utils_router

app = FastAPI(title="Mrpack Installer API", version="3.0.1")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

app.include_router(minecraft_router, prefix="/minecraft", tags=["minecraft", "mc"])
app.include_router(modrinth_router, prefix="/modrinth", tags=["modrinth"])
app.include_router(mrpack_router, prefix="/mrpack", tags=["mrpack"])
app.include_router(utils_router, prefix="/utils", tags=["utils", "utilities"])


if __name__ == "__main__":
    print("Starting API on http://localhost:8002")

    uvicorn.run(app, host="127.0.0.1", port=8002, log_level="info")