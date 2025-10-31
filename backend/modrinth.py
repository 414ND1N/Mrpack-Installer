import json
from typing import Any
import requests
from pathlib import Path
import zipfile
import io

def GetRandomProjects(count: int = 10) -> Any:
    """Fetch random projects from Modrinth API.

    Returns the parsed JSON response or raises requests.RequestException.
    """
    resp = requests.get("https://api.modrinth.com/v2/projects_random", params={"count": count}, timeout=10)
    resp.raise_for_status()
    return resp.json()

def searchProjects(limit: int = 10, query: str | None = None, offset: int | None = None, type: str | None = None) -> Any:
    """Search projects on Modrinth API.

    limit: number of results
    query: free-text search
    offset: pagination offset
    type: project_type filter
    """
    params = {"limit": limit}
    if query:
        params["query"] = query
    if offset is not None:
        params["offset"] = offset
    if type:
        params["facets"] = json.dumps([[f"project_type:{type}"]])

    resp = requests.get("https://api.modrinth.com/v2/search", params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()

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

        return {
            "game": index.get("game"),
            "formatVersion": index.get("formatVersion"),
            "versionId": index.get("versionId"),
            "name": index.get("name"),
            "summary": index.get("summary", ""),
            "files": index.get("files", []),
            "dependencies": dependencies,
        }
    except Exception as e:
        raise e
    
async def GetMrpackInfo(file_path: str) -> Any:
    try:
        file_path_obj = Path(file_path)

        if not file_path_obj.exists() or not file_path_obj.is_file():
            raise Exception(f"File not found: {file_path}")

        file_bytes = file_path_obj.read_bytes()

        with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
            names = z.namelist()
            if "modrinth.index.json" not in names:
                raise Exception("modrinth.index.json not found in the mrpack file")

            with z.open("modrinth.index.json") as f:
                index_content = f.read().decode("utf-8")

            index = json.loads(index_content)

            # Normalize dependencies
            raw_deps = index.get("dependencies", [])
            if isinstance(raw_deps, dict):
                dependencies = [{"id": k, "version": v} for k, v in raw_deps.items()]
            elif isinstance(raw_deps, list):
                dependencies = raw_deps
            else:
                dependencies = []

            # Build metadata
            metadata = {
                "game": index.get("game"),
                "formatVersion": index.get("formatVersion"),
                "versionId": index.get("versionId"),
                "name": index.get("name"),
                "summary": index.get("summary", ""),
                "files": index.get("files", []),
                "dependencies": dependencies,
            }

            # Optional client files (paths)
            optional_files = []
            for fl in metadata.get("files", []):
                if not isinstance(fl, dict):
                    continue
                env = fl.get("env")
                if isinstance(env, dict):
                    client_env = env.get("client")
                    if isinstance(client_env, str) and client_env.lower() == "optional":
                        path = fl.get("path") or fl.get("filename") or fl.get("name")
                        if path:
                            optional_files.append(path)

            # Minecraft version from dependencies (if present)
            minecraft_version = ""
            for dep in dependencies:
                if not isinstance(dep, dict):
                    continue
                dep_id = dep.get("id") or dep.get("project_id")
                if dep_id == "minecraft":
                    minecraft_version = dep.get("version") or ""
                    break

            # Overrides presence (check for directory or file entries)
            def has_entry(prefix: str) -> bool:
                return any(n == prefix or n.startswith(prefix + "/") for n in names)

            has_overrides = has_entry("overrides")
            has_server_overrides = has_entry("server-overrides")
            has_client_overrides = has_entry("client-overrides")

            # Loader detection: first dependency that is not minecraft
            loader = None
            for dep in dependencies:
                if not isinstance(dep, dict):
                    continue
                dep_id = dep.get("id") or dep.get("project_id")
                if dep_id and dep_id != "minecraft":
                    loader = {"type": dep_id, "version": dep.get("version")}
                    break

            mrpack_data = {
                "metadata": metadata,
                "optionalFiles": optional_files,
                "minecraftVersion": minecraft_version,
                "overrides": has_overrides,
                "server_overrides": has_server_overrides,
                "client_overrides": has_client_overrides,
            }

            if loader:
                mrpack_data["loader"] = loader

            return mrpack_data

    except Exception as e:
        raise e
