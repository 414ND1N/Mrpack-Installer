from fastapi import HTTPException, Query, APIRouter
import services.minecraft as Mc

minecraft_router = APIRouter()

@minecraft_router.post("/add_vanilla_launcher/", summary="Add Vanilla Launcher profile for Mrpack")
async def AddVanillaLauncher(
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
            
            # El servicio espera strings; convertir los valores enteros a strings
            jargs = [str(java_min), str(java_max)]

        await Mc.AddLauncherProfile(
            mrpack_directory=mrpack_directory,
            profile_directory=profile_directory,
            minecraft_directory=minecraft_directory,
            jargs=jargs,
            icon=icon
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding vanilla launcher profile: {e}")

@minecraft_router.get("/minecraft_directory/", summary="Get Minecraft directory")
async def GetMinecraftDirectory() -> str:
    try:
        return await Mc.GetMinecraftDirectory()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting Minecraft directory: {e}")