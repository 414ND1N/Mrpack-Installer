import json
from typing import Any
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import os
from urllib import request, error

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

    def get_mod_info(self, mod_id):
        return self.get(f"/v2/project/{mod_id}")
    
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

def get_latest_version(mod_id: str, vers: str, loaders: list[str]):
    mod_versions_data = collection_client.get_mod_version(mod_id)
    if not mod_versions_data:
        print(f"{mod_id} versions not found!")
        return None

    mod_version_to_download = next(
        (
            mod_version
            for mod_version in mod_versions_data
            if vers in mod_version["game_versions"]
            and (
                any(loader in mod_version["loaders"] for loader in loaders)
            )
        ),
        None,
    )
    return mod_version_to_download

def download_mod(mod_id: str, update: bool, version: str, loaders: list[str], download_directory: str, existing_mods: list[dict]):
    try:
        existing_mod = next((mod for mod in existing_mods if mod["id"] == mod_id), None)

        if not update and existing_mod:
            print(f"{mod_id} already exists, skipping...")
            return

        latest_mod = get_latest_version(mod_id, version, loaders)
        if not latest_mod:
            collection_client.mods_not_found.add(mod_id)
            raise Exception(f"No version found for {mod_id} with MC_VERSION={version} and LOADER={', '.join(map(str, loaders))}")

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

def VerifyModsInCollection(collection_id: str, version: str, loaders: list[str]) -> Any:
    try:
        # reset state from previous runs
        collection_client.mods_downloaded.clear()
        collection_client.mods_not_found.clear()
        collection_details = collection_client.get_collection(collection_id)
        if not collection_details:
            raise Exception("Collection not found")

        mods: list[str] = collection_details.get("projects", [])
        available_mods: list[str] = []
        unavailable_mods: list[str] = []

        # Caches to avoid duplicate network calls
        versions_cache: dict[str, Any] = {}
        info_cache: dict[str, str] = {}

        def process_mod(mod_id: str):
            try:
                # fetch versions (cached)
                mod_versions = versions_cache.get(mod_id)
                if mod_versions is None:
                    mod_versions = collection_client.get_mod_version(mod_id)
                    versions_cache[mod_id] = mod_versions

                # determine if a compatible version exists
                has_compatible = False
                if mod_versions:
                    for mv in mod_versions:
                        game_versions = mv.get("game_versions", [])
                        loaders_list = mv.get("loaders", [])
                        if version in game_versions and (
                            any(loader in loaders_list for loader in loaders)
                        ):
                            has_compatible = True
                            break

                # fetch mod info (cached)
                title = info_cache.get(mod_id)
                if title is None:
                    try:
                        info = collection_client.get_mod_info(mod_id)
                        if isinstance(info, dict):
                            title = info.get("title") or info.get("name") or "Unknown"
                        else:
                            title = "Unknown"
                    except Exception:
                        title = "Unknown"
                    info_cache[mod_id] = title

                return (mod_id, has_compatible, title)
            except Exception:
                return (mod_id, False, "Unknown")

        # Parallelize network calls for large collections
        with ThreadPoolExecutor(max_workers=min(20, max(4, len(mods)))) as executor:
            futures = [executor.submit(process_mod, m) for m in mods]
            for f in futures:
                try:
                    _, ok, title = f.result()
                    if ok:
                        available_mods.append(title)
                    else:
                        unavailable_mods.append(title)
                except Exception:
                    # best-effort: mark as unavailable
                    unavailable_mods.append("Unknown")

        return {
            "collection_id": collection_id,
            "mc_version": version,
            "loader": ', '.join(map(str, loaders)) if loaders else "",
            "available_mods": available_mods,
            "unavailable_mods": unavailable_mods,
            "ok": True
        }

    except Exception as e:
        raise e

def GetCollectionInfo(collection_id: str) -> Any:
    try:
        collection_details = collection_client.get_collection(collection_id)
        if not collection_details:
            raise Exception("Collection not found")
        
        return {
            "collection_id": collection_id,
            "user": collection_details.get("user"),
            "name": collection_details.get("name"),
            "description": collection_details.get("description"),
            "projects": collection_details.get("projects", []),
            "status": collection_details.get("status"),
            "created": collection_details.get("created"),
            "updated": collection_details.get("updated"),
            "icon_url": collection_details.get("icon_url"),
            "ok": True
        }

    except Exception as e:
        raise e

def DownloadCollectionMods(collection_id: str, version: str, loaders: list[str], download_directory: str, update_existing: bool = False, log: bool = False) -> Any:
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
                        loaders,
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
                    log_file.write(f"Loader: {', '.join(map(str, loaders))}\n")
                    log_file.write(f"Mods downloaded {len(collection_client.mods_downloaded)}:\n")
                    for mod_id in collection_client.mods_downloaded:
                        info = collection_client.get_mod_info(mod_id)
                        log_file.write(f"{info['title']} - https://modrinth.com/mod/{mod_id}\n")
                    log_file.write(f"Mods not found {len(collection_client.mods_not_found)}:\n")
                    for mod_id in collection_client.mods_not_found:
                        info = collection_client.get_mod_info(mod_id)
                        log_file.write(f"{info['title']} - https://modrinth.com/mod/{mod_id}\n")
            except Exception as e:
                print(f"Failed to write log file {log_path}: {e}")

        if log and log_path:
            # Abrir el archivo de log para que el usuario pueda revisarlo
            os.startfile(log_path)

        return {
            "collection_id": collection_id,
            "mc_version": version,
            "loader": ', '.join(map(str, loaders)),
            "ok": True,
            "mods_downloaded": list(collection_client.mods_downloaded),
            "mods_not_found": list(collection_client.mods_not_found),
            "log_path": str(log_path) if log else None
        }

    except Exception as e:
        raise e