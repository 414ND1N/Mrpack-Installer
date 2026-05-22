import minecraft_launcher_lib as McLib
from minecraft_launcher_lib import utils as McUtils
from os.path import abspath, expanduser, normpath, isdir
from os import scandir

async def GetMinecraftDirectory():
    try:
        d = McLib.utils.get_minecraft_directory()
        return abspath(expanduser(d))
    except Exception as e:
        raise RuntimeError(f"Error obteniendo directorio de Minecraft: {e}")

async def IsModdedMinecraftDirectory(directory: str) -> bool:
    try:
        directory = normpath(abspath(expanduser(directory)))
        
        # Verificar que el directorio existe y es un directorio
        if not isdir(directory):
            return False
        
        with scandir(directory) as entries:
            for entry in entries:
                if entry.is_dir() and entry.name in ["mods"]:
                    return True
        return False
    except Exception as e:
        raise RuntimeError(f"Error verificando directorio de Minecraft: {e}")