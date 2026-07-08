import os
import re
import shutil
from hashlib import sha1

def NormalizeSeparators(path: str) -> str:
    return path.replace('\\', '/')

async def PathJoin(*paths: str) -> str:
    sanitized_paths = [NormalizeSeparators(p) for p in paths]
    return os.path.normpath(os.path.join(*sanitized_paths))

async def PathExists(path: str) -> tuple[bool, bool]:
    clean_path = os.path.normpath(NormalizeSeparators(path))
    exists = os.path.exists(clean_path)
    is_file = os.path.isfile(path) if exists else False
    return exists, is_file

async def PathDelete(path: str) -> tuple[str, bool, str | None]:
    try:
        clean_path = NormalizeSeparators(path.strip('"'))
        path = os.path.normpath(os.path.abspath(clean_path))

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
    clean_path = os.path.normpath(NormalizeSeparators(path))
    h = sha1()
    with open(clean_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()