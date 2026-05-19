import minecraft_launcher_lib as McLib
from os.path import abspath, expanduser

async def GetMinecraftDirectory():
    try:
        d = McLib.utils.get_minecraft_directory()
        return abspath(expanduser(d))
    except Exception as e:
        raise RuntimeError(f"Error obteniendo directorio de Minecraft: {e}")