import minecraft_launcher_lib as McLib
import traceback
from services.minecraft_lib import add_vanilla_launcher_profile
from os.path import abspath, expanduser, normpath, isfile, join
from pydantic import BaseModel
from services.vanilla.utils import GetMinecraftDirectory

class AddVanillaLauncherRequest(BaseModel):
    mrpack_directory: str
    profile_directory: str
    minecraft_directory: str = ""
    jargs: list[str] | str | None = None
    icon: str | None = None

async def AddLauncherProfile(
    req: AddVanillaLauncherRequest | None = None,
    mrpack_directory: str | None = None,
    profile_directory: str | None = None,
    minecraft_directory: str = "",
    jargs: list[str] | str | None = None,
    icon: str | None = None,
):
    try:
        if req is None:
            req = AddVanillaLauncherRequest(
                mrpack_directory=mrpack_directory or "",
                profile_directory=profile_directory or "",
                minecraft_directory=minecraft_directory or "",
                jargs=jargs,
                icon=icon,
            )

        req.mrpack_directory = abspath(expanduser(req.mrpack_directory))

        if not req.minecraft_directory:
            req.minecraft_directory = await GetMinecraftDirectory()

        req.minecraft_directory = abspath(expanduser(req.minecraft_directory))

        if not isfile(req.mrpack_directory):
            raise FileNotFoundError(f"{req.mrpack_directory} was not found")
        
        mrpack_information = McLib.mrpack.get_mrpack_information(req.mrpack_directory)
        if not mrpack_information:
            raise ValueError(f"{req.mrpack_directory} is not a valid .mrpack File")
        
        if not McLib.vanilla_launcher.do_vanilla_launcher_profiles_exists(req.minecraft_directory):
            raise RuntimeError("No se encontraron perfiles del Vanilla Launcher en el directorio de Minecraft")
        
        java_arguments = None
        if req.jargs and isinstance(req.jargs, list) and len(req.jargs) == 2:
            try:
                # Convertir a "-Xms.. -Xmx.."
                min_g = int(req.jargs[0])
                max_g = int(req.jargs[1])
                if min_g < 1 or max_g < min_g:
                    raise ValueError("Valores de memoria java inválidos")
                java_arguments = [f"-Xms{min_g}G", f"-Xmx{max_g}G"]
            except Exception:
                java_arguments = req.jargs

        # Normalizar el directorio
        _modpack_directory = join(
            req.minecraft_directory, normpath(req.profile_directory)
        )
        _modpack_directory = abspath(expanduser(_modpack_directory))

        profile = {
            "name": mrpack_information["name"],
            "version": McLib.mrpack.get_mrpack_launch_version(req.mrpack_directory),
            "versionType": "custom",
            "gameDirectory": _modpack_directory,
            "javaExecutable": None,
            "javaArguments": java_arguments,
            "customResolution": None,
            "icon": req.icon,
        }

        add_vanilla_launcher_profile(req.minecraft_directory, profile)

        return {"ok": True}
    
    except Exception as e:
        traceback.print_exc()
        raise e