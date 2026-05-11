from fastapi import HTTPException, Query, APIRouter
import services.utils as Utils

utils_router = APIRouter()

@utils_router.get("/path_join/", summary="Join paths")
async def PathJoin(paths: list[str] = Query(..., description="Paths to join")) -> str:
    try:
        return await Utils.PathJoin(*paths)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error joining paths: {e}")
