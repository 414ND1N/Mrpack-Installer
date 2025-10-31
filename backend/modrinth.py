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
