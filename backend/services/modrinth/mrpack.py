import json
from typing import Any
from pathlib import Path
import zipfile
import io
from pydantic import BaseModel
import shutil
from os.path import abspath, expanduser, normpath, isfile
from services.minecraft_lib import install_mrpack, install_mrpack_clientside, install_mrpack_serverside, get_mrpack_information
import minecraft_launcher_lib as McLib
import traceback

async def GetMrpackMetadata(file_path: str) -> Any:
    try:
        file_path_obj = Path(file_path)

        if not file_path_obj.exists() or not file_path_obj.is_file():
            raise Exception(f"File not found: {file_path}")

        file_bytes = file_path_obj.read_bytes()

        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            if "modrinth.index.json" not in z.namelist():
                raise Exception(f"modrinth.index.json not found in the mrpack file")

            with z.open("modrinth.index.json") as f:
                index_content = f.read().decode("utf-8")

        index = json.loads(index_content)

        raw_deps = index.get("dependencies", [])
        if isinstance(raw_deps, dict):
            dependencies = [{"id": k, "version": v} for k, v in raw_deps.items()]
        elif isinstance(raw_deps, list):
            dependencies = raw_deps
        else:
            dependencies = []

        optional_files = []
        for fl in index.get("files", []):
            if not isinstance(fl, dict):
                continue
            env = fl.get("env")
            if isinstance(env, dict):
                if isinstance(env.get("client"), str) and env.get("client").lower() == "optional":
                    optional_files.append(fl)
                if isinstance(env.get("server"), str) and env.get("server").lower() == "optional":
                    optional_files.append(fl)

        return {
            "game": index.get("game"),
            "formatVersion": index.get("formatVersion"),
            "versionId": index.get("versionId"),
            "name": index.get("name"),
            "summary": index.get("summary", ""),
            "files": index.get("files", []),
            "dependencies": dependencies,
            "optionalFiles": optional_files,
        }
    except Exception as e:
        raise e
    
# def GetMrpackInfo(file_path: str) -> Any:
#     try:
#         file_path_obj = Path(file_path)

#         if not file_path_obj.exists() or not file_path_obj.is_file():
#             raise Exception(f"File not found: {file_path}")

#         file_bytes = file_path_obj.read_bytes()

#         with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
#             names = z.namelist()
#             if "modrinth.index.json" not in names:
#                 raise Exception("modrinth.index.json not found in the mrpack file")

#             with z.open("modrinth.index.json") as f:
#                 index_content = f.read().decode("utf-8")

#             index = json.loads(index_content)

#             # Normalize dependencies
#             raw_deps = index.get("dependencies", [])
#             if isinstance(raw_deps, dict):
#                 dependencies = [{"id": k, "version": v} for k, v in raw_deps.items()]
#             elif isinstance(raw_deps, list):
#                 dependencies = raw_deps
#             else:
#                 dependencies = []

#             # Build metadata
#             metadata = {
#                 "game": index.get("game"),
#                 "formatVersion": index.get("formatVersion"),
#                 "versionId": index.get("versionId"),
#                 "name": index.get("name"),
#                 "summary": index.get("summary", ""),
#                 "files": index.get("files", []),
#                 "dependencies": dependencies,
#             }

#             # Optional client files (paths)
#             optional_files = []
#             optional_server_files = []
#             for fl in metadata.get("files", []):
#                 if not isinstance(fl, dict):
#                     continue
#                 env = fl.get("env")
#                 if isinstance(env, dict):
#                     if isinstance(env.get("client"), str) and env.get("client").lower() == "optional":
#                         path = fl.get("path") or fl.get("filename") or fl.get("name")
#                         if path:
#                             optional_files.append(path)
#                     if isinstance(env.get("server"), str) and env.get("server").lower() == "optional":
#                         path = fl.get("path") or fl.get("filename") or fl.get("name")
#                         if path:
#                             optional_server_files.append(path)

#             # Minecraft version from dependencies (if present)
#             minecraft_version = ""
#             for dep in dependencies:
#                 if not isinstance(dep, dict):
#                     continue
#                 dep_id = dep.get("id") or dep.get("project_id")
#                 if dep_id == "minecraft":
#                     minecraft_version = dep.get("version") or ""
#                     break

#             # Overrides presence (check for directory or file entries)
#             def has_entry(prefix: str) -> bool:
#                 return any(n == prefix or n.startswith(prefix + "/") for n in names)

#             has_overrides = has_entry("overrides")
#             has_server_overrides = has_entry("server-overrides")
#             has_client_overrides = has_entry("client-overrides")

#             # Loader detection: first dependency that is not minecraft
#             loader = None
#             for dep in dependencies:
#                 if not isinstance(dep, dict):
#                     continue
#                 dep_id = dep.get("id") or dep.get("project_id")
#                 if dep_id and dep_id != "minecraft":
#                     loader = {"type": dep_id, "version": dep.get("version")}
#                     break

#             mrpack_data = {
#                 "metadata": metadata,
#                 "optionalFiles": optional_files,
#                 "optionalServerFiles": optional_server_files,
#                 "minecraftVersion": minecraft_version,
#                 "overrides": has_overrides,
#                 "server_overrides": has_server_overrides,
#                 "client_overrides": has_client_overrides,
#             }

#             if loader:
#                 mrpack_data["loader"] = loader

#             return mrpack_data

#     except Exception as e:
#         raise e

class InstallMrpackRequest(BaseModel):
    profile_directory: str
    mrpack_directory: str
    installation_type: str = "singleplayer"
    minecraft_directory: str = ""
    install_optfional_files: bool = True
    callbacks: dict | None = None

def InstallMrpack(
    profile_directory: InstallMrpackRequest | str,
    mrpack_directory: str | None = None,
    installation_type: str = "singleplayer",
    minecraft_directory: str = "",
    callbacks: dict | None = None,
    optional_files: list[str] = [],
    install_optfional_files: bool = True
):
    try:
        err = ""

        # Verificar que el ejecutable 'java' esté disponible
        java_exec = shutil.which("java")
        if not java_exec:
            raise RuntimeError("Java executable not found in PATH. Please install a compatible Java (e.g. OpenJDK 17+) and ensure 'java' is available in PATH.")

        # Verificar que el archivo .mrpack exista
        if not isfile(mrpack_directory):
            err = f"{mrpack_directory} was not found"
            print(err)
            raise FileNotFoundError(err)

        # Verificar que el archivo .mrpack sea válido
        _mrpack_information = get_mrpack_information(mrpack_directory)
        if not _mrpack_information:
            err = f"{mrpack_directory} is not a valid .mrpack File"
            print(err)
            raise Exception(err)

        # Verificar que el tipo de instalación sea válido
        if installation_type not in ["serverside", "clientside", "singleplayer"]:
            err = f"Invalid installation_type: {installation_type}"
            print(err)
            raise ValueError(err)

        if not minecraft_directory:
            # use sync utils to get minecraft directory
            minecraft_directory = McLib.utils.get_minecraft_directory()
        minecraft_directory = abspath(expanduser(minecraft_directory))

        # Adds the Optional Files
        if install_optfional_files:
            _mrpack_install_options: McLib.types.MrpackInstallOptions = {"optionalFiles": []}
            for opt_file in optional_files:
                if opt_file in _mrpack_information.get("optionalFiles", []):
                    _mrpack_install_options["optionalFiles"].append(opt_file)

        # Normalize modpack directory
        _modpack_directory = abspath(expanduser(normpath(profile_directory)))

        cb = callbacks if callbacks is not None else {"setStatus": print}

        if installation_type == "serverside":
            install_mrpack_serverside(
                path=mrpack_directory,
                minecraft_directory=minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )
        elif installation_type == "clientside":
            install_mrpack_clientside(
                path=mrpack_directory,
                minecraft_directory=minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )
        else:
            install_mrpack(
                path=mrpack_directory,
                minecraft_directory=minecraft_directory,
                modpack_directory=_modpack_directory,
                mrpack_install_options=_mrpack_install_options,
                callback=cb,
            )

        return {"ok": True}
    except Exception as e:
        traceback.print_exc()
        raise e