import json
from typing import Any
import requests
from pathlib import Path
import zipfile
import io
from concurrent.futures import ThreadPoolExecutor
import os
from urllib import request, error

# Modrinth API functions
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

# MrPack

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

# Modrinth Collections
class ModrinthCollectionClient:
    def __init__(self):
        self.base_url = "https://api.modrinth.com"
        self.mods_not_found = set()
        self.mods_downloaded = set()

    def get(self, url):
        try:
            with request.urlopen(self.base_url + url) as response:
                return json.loads(response.read())
        except error.URLError as e:
            print(f"Network error: {e}")
            return None

    def download_file(self, url, filename):
        try:
            request.urlretrieve(url, filename)
        except error.URLError as e:
            print(f"Failed to download file: {e}")

    def get_mod_version(self, mod_id):
        return self.get(f"/v2/project/{mod_id}/version")

    def get_collection(self, collection_id):
        return self.get(f"/v3/collection/{collection_id}")
    
collection_client = ModrinthCollectionClient()

def get_existing_mods(directory: str) -> list[dict]:
    # If directory doesn't exist, return empty list
    if not os.path.isdir(directory):
        return []

    file_names = os.listdir(directory)
    return [
        {"id": file_name.split(".")[-2], "filename": file_name}
        for file_name in file_names
    ]

def get_latest_version(mod_id: str, vers: str, loader: str):
    mod_versions_data = collection_client.get_mod_version(mod_id)
    if not mod_versions_data:
        print(f"{mod_id} versions not found!")
        return None

    mod_version_to_download = next(
        (
            mod_version
            for mod_version in mod_versions_data
            if vers in mod_version["game_versions"]
            and loader in mod_version["loaders"]
        ),
        None,
    )
    return mod_version_to_download

def download_mod(mod_id: str, update: bool, version: str, loader: str, download_directory: str, existing_mods: list[dict]):
    try:
        existing_mod = next((mod for mod in existing_mods if mod["id"] == mod_id), None)

        if not update and existing_mod:
            print(f"{mod_id} already exists, skipping...")
            return

        latest_mod = get_latest_version(mod_id, version, loader)
        if not latest_mod:
            collection_client.mods_not_found.add(mod_id)
            raise Exception(f"No version found for {mod_id} with MC_VERSION={version} and LOADER={loader}")

        file_to_download: dict | None = next(
            (file for file in latest_mod["files"] if file["primary"] == True), None
        )

        if not file_to_download:
            raise Exception(f"Couldn't find a file to download for {mod_id}")
        
        filename: str = file_to_download["filename"]
        filename_parts = filename.split(".")
        filename_parts.insert(-1, mod_id)
        filename_with_id = ".".join(filename_parts)

        if existing_mod and existing_mod["filename"] == filename_with_id:
            print(f"{filename_with_id} latest version already exists.")
            return

        print(
            "UPDATING: " if existing_mod else "DOWNLOADING: ",
            file_to_download["filename"],
            latest_mod["loaders"],
            latest_mod["game_versions"],
        )
        collection_client.download_file(
            file_to_download["url"], f"{download_directory}/{filename_with_id}"
        )

        if existing_mod:
            print(f"REMOVING previous version:  {existing_mod['filename']}")
            os.remove(f"{download_directory}/{existing_mod['filename']}")
        
        collection_client.mods_downloaded.add(mod_id)
    
    except Exception as e:
        print(f"Failed to download {mod_id}: {e}")

def DownloadCollectionMods(collection_id: str, version: str, loader: str, download_directory: str, update_existing: bool = False, log: bool = True) -> Any:
    try:
        # reset state from previous runs
        collection_client.mods_downloaded.clear()
        collection_client.mods_not_found.clear()

        # Ensure download directory exists
        try:
            Path(download_directory).mkdir(parents=True, exist_ok=True)
        except Exception:
            pass

        collection_details = collection_client.get_collection(collection_id)
        if not collection_details:
            raise Exception("Collection not found")
        
        mods: str = collection_details["projects"]
        existing_mods = get_existing_mods(download_directory)

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = []
            for mod in mods:
                futures.append(
                    executor.submit(
                        download_mod,
                        mod,
                        update_existing,
                        version,
                        loader,
                        download_directory,
                        existing_mods,
                    )
                )
            for f in futures:
                try:
                    f.result()
                except Exception:
                    pass
        
        if log:
            log_path = Path(download_directory) / f"report_{collection_id}.txt"
            # remove existing log file if present
            if log_path.exists():
                try:
                    log_path.unlink()
                except Exception:
                    # ignore unlink errors
                    pass

            # ensure parent directory exists
            try:
                log_path.parent.mkdir(parents=True, exist_ok=True)
            except Exception:
                # if we can't create the parent, let the open() raise later
                pass

            try:
                with log_path.open("a", encoding="utf-8") as log_file:
                    log_file.write(f"Version: {version}\n")
                    log_file.write(f"Loader: {loader}\n")
                    log_file.write("Mods downloaded:\n")
                    for mod_id in collection_client.mods_downloaded:
                        log_file.write(f"https://modrinth.com/mod/{mod_id}\n")
                    log_file.write("Mods not found:\n")
                    for mod_id in collection_client.mods_not_found:
                        log_file.write(f"https://modrinth.com/mod/{mod_id}\n")
            except Exception as e:
                print(f"Failed to write log file {log_path}: {e}")

        if log and log_path:
            # Abrir el archivo de log para que el usuario pueda revisarlo
            os.startfile(log_path)

        return {
            "collection_id": collection_id,
            "mc_version": version,
            "loader": loader,
            "ok": True,
            "mods_downloaded": list(collection_client.mods_downloaded),
            "mods_not_found": list(collection_client.mods_not_found),
            "log_path": str(log_path) if log else None
        }

    except Exception as e:
        raise e