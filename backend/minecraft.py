import minecraft_launcher_lib
import os
import traceback

async def getMinecraftDirectory():
    try:
        d = minecraft_launcher_lib.utils.get_minecraft_directory()
        return os.path.abspath(os.path.expanduser(d))
    except Exception as e:
        raise RuntimeError(f"Error obteniendo directorio de Minecraft: {e}")

async def addVanillaLauncher(mrpack_directory: str, profile_directory:str, minecraft_directory: str = "", jargs=None, icon=None):

    try:
        mrpack_directory = os.path.abspath(os.path.expanduser(mrpack_directory))
        if not minecraft_directory:
            minecraft_directory = await getMinecraftDirectory()
        minecraft_directory = os.path.abspath(os.path.expanduser(minecraft_directory))

        if not os.path.isfile(mrpack_directory):
            raise FileNotFoundError(f"{mrpack_directory} was not found")
        
        mrpack_information = minecraft_launcher_lib.mrpack.get_mrpack_information(mrpack_directory)
        if not mrpack_information:
            raise ValueError(f"{mrpack_directory} is not a valid .mrpack File")
        
        if not minecraft_launcher_lib.vanilla_launcher.do_vanilla_launcher_profiles_exists(minecraft_directory):
            raise RuntimeError("No se encontraron perfiles del Vanilla Launcher en el directorio de Minecraft")
        
        java_arguments = None
        if jargs:
            try:
                # Si vienen números (o strings numéricos), convertir a "-Xms.. -Xmx.."
                min_g = int(jargs[0])
                max_g = int(jargs[1])
                if min_g < 1 or max_g < min_g:
                    raise ValueError("Valores de memoria java inválidos")
                java_arguments = [f"-Xms{min_g}G", f"-Xmx{max_g}G"]
            except Exception:
                # si no se pudo parsear, asumir que jargs ya es una lista de strings
                java_arguments = jargs

        profile = {
            "name": mrpack_information["name"],
            "version": minecraft_launcher_lib.mrpack.get_mrpack_launch_version(mrpack_directory),
            "versionType": "custom",
            "gameDirectory": os.path.join(minecraft_directory, profile_directory),
            "javaExecutable": None,
            "javaArguments": java_arguments,
            "customResolution": None,
            "icon": icon,
        }

        minecraft_launcher_lib.vanilla_launcher.add_vanilla_launcher_profile(minecraft_directory, profile)

        return {"ok": True}
    
    except Exception as e:
        traceback.print_exc()
        raise e

async def InstallMrpack(profile_directory: str, mrpack_directory: str, minecraft_directory: str = ""):

    try:
        if not minecraft_directory:
            minecraft_directory = await getMinecraftDirectory()

        if not os.path.isfile(mrpack_directory):
            raise FileNotFoundError(f"{mrpack_directory} was not found")
        
        mrpack_information = minecraft_launcher_lib.utils.get_mrpack_information(mrpack_directory)
        if not mrpack_information:
            raise Exception(f"{mrpack_directory} is not a valid .mrpack File")

       # Adds the Optional Files
        mrpack_install_options: minecraft_launcher_lib.types.MrpackInstallOptions = {"optionalFiles": []}
        for i in mrpack_information["optionalFiles"]:
            mrpack_install_options["optionalFiles"].append(i)

        minecraft_launcher_lib.mrpack.install_mrpack(
            mrpack_directory,
            minecraft_directory,
            modpack_directory=profile_directory,
            mrpack_install_options=mrpack_install_options,
            callback={"setStatus": print}
        )
    except Exception as e: 
        raise e