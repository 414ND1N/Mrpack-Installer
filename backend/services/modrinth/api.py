import json
from typing import Any
import requests

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