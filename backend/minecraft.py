import minecraft_launcher_lib
import os
import traceback
import shutil

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

        # Normalize modpack directory
        _modpack_directory = os.path.join(minecraft_directory, os.path.normpath(profile_directory))
        _modpack_directory = os.path.abspath(os.path.expanduser(_modpack_directory))

        profile = {
            "name": mrpack_information["name"],
            "version": minecraft_launcher_lib.mrpack.get_mrpack_launch_version(mrpack_directory),
            "versionType": "custom",
            "gameDirectory": _modpack_directory,
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
    
def InstallMrpack(profile_directory: str, mrpack_directory: str, installation_type="singleplayer", minecraft_directory: str = "", callbacks=None):
    try:
        if not minecraft_directory:
            # use sync utils to get minecraft directory
            minecraft_directory = minecraft_launcher_lib.utils.get_minecraft_directory()
        minecraft_directory = os.path.abspath(os.path.expanduser(minecraft_directory))

        # Verify 'java' executable is available - installers (fabric/quilt/forge) call java
        java_exec = shutil.which("java")
        if not java_exec:
            raise RuntimeError("Java executable not found in PATH. Please install a compatible Java (e.g. OpenJDK 17+) and ensure 'java' is available in PATH.")

        if not os.path.isfile(mrpack_directory):
            print(f"{mrpack_directory} was not found")
            raise FileNotFoundError(f"{mrpack_directory} was not found")

        mrpack_information = minecraft_launcher_lib.mrpack.get_mrpack_information(mrpack_directory)
        if not mrpack_information:
            print(f"{mrpack_directory} is not a valid .mrpack File")
            raise Exception(f"{mrpack_directory} is not a valid .mrpack File")

        # Adds the Optional Files
        mrpack_install_options: minecraft_launcher_lib.types.MrpackInstallOptions = {"optionalFiles": []}
        for i in mrpack_information["optionalFiles"]:
            mrpack_install_options["optionalFiles"].append(i)

        # Normalize modpack directory
        _modpack_directory = os.path.abspath(os.path.expanduser(os.path.normpath(profile_directory)))

        cb = callbacks if callbacks is not None else {"setStatus": print}

        if installation_type == "serverside":
            minecraft_launcher_lib.mrpack.install_mrpack_serverside(
                mrpack_directory,
                minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=mrpack_install_options,
                callback=cb
            )
        elif installation_type == "clientside":
            minecraft_launcher_lib.mrpack.install_mrpack_clientside(
                mrpack_directory,
                minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=mrpack_install_options,
                callback=cb
            )
        elif installation_type == "singleplayer":
            minecraft_launcher_lib.mrpack.install_mrpack(
                mrpack_directory,
                minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=mrpack_install_options,
                callback=cb
            )
        else:
            print("installation_type no válido:", installation_type)
            raise ValueError(f"Invalid installation_type: {installation_type}")

        return {"ok": True}
    except Exception as e:
        traceback.print_exc()
        raise e