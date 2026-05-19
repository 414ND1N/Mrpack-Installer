import os
import re
from hashlib import sha1

async def PathJoin(*paths: str) -> str:
    return os.path.normpath(os.path.join(*paths))

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