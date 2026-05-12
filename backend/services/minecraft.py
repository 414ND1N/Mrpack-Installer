import minecraft_launcher_lib as McLib
from minecraft_launcher_lib.mrpack import install_mrpack
from .minecraft_lib import install_mrpack_clientside, install_mrpack_serverside, add_vanilla_launcher_profile
from os.path import abspath, expanduser, normpath, isfile, join
import traceback
import shutil
from pydantic import BaseModel

async def GetMinecraftDirectory():
    try:
        d = McLib.utils.get_minecraft_directory()
        return abspath(expanduser(d))
    except Exception as e:
        raise RuntimeError(f"Error obteniendo directorio de Minecraft: {e}")

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


class InstallMrpackRequest(BaseModel):
    profile_directory: str
    mrpack_directory: str
    installation_type: str = "singleplayer"
    minecraft_directory: str = ""
    install_optfional_files: bool = True
    callbacks: dict | None = None

def InstallMrpack(
    req_or_profile_directory: InstallMrpackRequest | str,
    mrpack_directory: str | None = None,
    installation_type: str = "singleplayer",
    minecraft_directory: str = "",
    callbacks: dict | None = None,
):
    try:
        err = ""

        # Permitir llamadas tanto con un objeto InstallMrpackRequest como con los 5 argumentos posicionales
        req = InstallMrpackRequest(
            profile_directory=req_or_profile_directory,
            mrpack_directory=mrpack_directory or "",
            installation_type=installation_type,
            minecraft_directory=minecraft_directory or "",
            install_optfional_files=True,
            callbacks=callbacks,
        )

        # Verificar que el ejecutable 'java' esté disponible
        java_exec = shutil.which("java")
        if not java_exec:
            raise RuntimeError("Java executable not found in PATH. Please install a compatible Java (e.g. OpenJDK 17+) and ensure 'java' is available in PATH.")

        # Verificar que el archivo .mrpack exista
        if not isfile(req.mrpack_directory):
            err = f"{req.mrpack_directory} was not found"
            print(err)
            raise FileNotFoundError(err)

        # Verificar que el archivo .mrpack sea válido
        _mrpack_information = McLib.mrpack.get_mrpack_information(req.mrpack_directory)
        if not _mrpack_information:
            err = f"{req.mrpack_directory} is not a valid .mrpack File"
            print(err)
            raise Exception(err)

        # Verificar que el tipo de instalación sea válido
        if req.installation_type not in ["serverside", "clientside", "singleplayer"]:
            err = f"Invalid installation_type: {req.installation_type}"
            print(err)
            raise ValueError(err)

        if not req.minecraft_directory:
            # use sync utils to get minecraft directory
            req.minecraft_directory = McLib.utils.get_minecraft_directory()
        req.minecraft_directory = abspath(expanduser(req.minecraft_directory))

        # Adds the Optional Files
        if req.install_optfional_files:
            _mrpack_install_options: McLib.types.MrpackInstallOptions = {"optionalFiles": []}
            for i in _mrpack_information["optionalFiles"]:
                _mrpack_install_options["optionalFiles"].append(i)

        # Normalize modpack directory
        _modpack_directory = abspath(expanduser(normpath(req.profile_directory)))

        cb = req.callbacks if req.callbacks is not None else {"setStatus": print}

        if req.installation_type == "serverside":
            install_mrpack_serverside(
                path=req.mrpack_directory,
                minecraft_directory=req.minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )
        elif req.installation_type == "clientside":
            install_mrpack_clientside(
                path=req.mrpack_directory,
                minecraft_directory=req.minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )
        else:
            install_mrpack(
                path=req.mrpack_directory,
                minecraft_directory=req.minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )

        return {"ok": True}
    except Exception as e:
        traceback.print_exc()
        raise e