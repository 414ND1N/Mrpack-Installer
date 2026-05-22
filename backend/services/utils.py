import os
import re
import shutil
from hashlib import sha1

async def PathJoin(*paths: str) -> str:
    return os.path.normpath(os.path.join(*paths))

async def PathExists(path: str) -> tuple[bool, bool]:
    exists = os.path.exists(path)
    is_file = os.path.isfile(path) if exists else False
    return exists, is_file

async def PathDelete(path: str) -> tuple[str, bool, str | None]:
    try:
        path = os.path.normpath(os.path.abspath(path.strip('"')))

        if os.path.isfile(path):
            os.remove(path)
            return  True, True, None
        elif os.path.isdir(path):
            shutil.rmtree(path)
            return True, False, None
        else:
            return False, False, "Path does not exist or is not a file/directory"
    except Exception as e:
        return False, False, str(e)

def NormalizedModName(name: str) -> str:
    normalized = name.lower()

    # Quitar extensiones frecuentes de mods/artefactos.
    for suffix in (".disabled", ".jar", ".zip"):
        if normalized.endswith(suffix):
            normalized = normalized[: -len(suffix)]

    # Separar nombre/version: tomamos todo antes del primer bloque de versión.
    match = re.match(r"^(.+?)(-|_)v?\d[\w.+-]*$", normalized)
    if match:
        return match.group(1)

    return normalized

def FileSha1(path: str) -> str:
    h = sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()