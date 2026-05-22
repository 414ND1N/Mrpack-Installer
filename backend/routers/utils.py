from fastapi import HTTPException, Query, APIRouter
import services.utils as Utils

utils_router = APIRouter()

@utils_router.get("/path/join", summary="Join paths")
async def PathJoin(
    paths: list[str] = Query(..., description="Paths to join")
) -> str:
    try:
        return await Utils.PathJoin(*paths)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error joining paths: {e}")

@utils_router.get("/path/exists", summary="Check if a path exists")
async def PathExists(
    path: str = Query(..., description="Path to check")
) -> dict[str, bool]:
    try:
        exists, is_file = await Utils.PathExists(path)
        return {"exists": exists, "is_file": is_file}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error checking path: {e}")

@utils_router.delete("/path/delete", summary="Delete a file or directory")
async def PathDelete(
    path: str = Query(..., description="Path to delete")
) -> dict[str, bool | str | None]:
    try:
        success, is_file, error = await Utils.PathDelete(path)
        return {"success": success, "is_file": is_file, "error": error}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting path: {e}")