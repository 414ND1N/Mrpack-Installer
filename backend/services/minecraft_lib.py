# This file is an extension of minecraft-launcher-lib (https://codeberg.org/JakobDev/minecraft-launcher-lib) to add some features that are not available in the library
from minecraft_launcher_lib._helper import download_file, empty, check_path_inside_minecraft_directory
from minecraft_launcher_lib.types import MrpackInstallOptions, CallbackDict, VanillaLauncherProfile
from minecraft_launcher_lib._internal_types.mrpack_types import MrpackIndex
from minecraft_launcher_lib.install import install_minecraft_version
from minecraft_launcher_lib.mod_loader import get_mod_loader
from minecraft_launcher_lib.mrpack import _filter_mrpack_files

import minecraft_launcher_lib.vanilla_launcher as vanilla_launcher
from minecraft_launcher_lib.exceptions import InvalidVanillaLauncherProfile
from minecraft_launcher_lib._internal_types.vanilla_launcher_types import VanillaLauncherProfilesJson, VanillaLauncherProfilesJsonProfile

import zipfile
import json
import datetime
import os
from uuid import uuid4
from os.path import abspath, join, dirname
from os import PathLike, makedirs
from services.utils import NormalizedModName


def VerifyFileExists(file: dict, modpack_directory: str | PathLike) -> tuple[bool, str]:
    """
    Verifica si existe un archivo del mismo mod en el directorio.
    Compara solo el nombre del mod, ignorando los números de versión.
    
    Args:
        file: Diccionario con la clave "path" que contiene la ruta del archivo
        modpack_directory: Directorio base del modpack
    
    Returns:
        True si existe un archivo del mismo mod, False en caso contrario
    """
    file_path = file["path"]
    file_name = os.path.basename(file_path)
    directory = os.path.dirname(file_path)

    mod_name = NormalizedModName(file_name)
    if not mod_name:
        return False, ""
    
    # Construir la ruta del directorio donde buscar
    search_directory = abspath(join(modpack_directory, directory))
    
    # Si el directorio no existe, el archivo no existe
    if not os.path.exists(search_directory):
        return False, ""
    
    # Buscar archivos que coincidan con el nombre del mod normalizado
    try:
        for filename in os.listdir(search_directory):
            if NormalizedModName(filename) == mod_name:
                return True, filename
    except (OSError, PermissionError):
        return False, ""
    
    return False, ""

def install_mrpack(
    path: str | os.PathLike,
    minecraft_directory: str | os.PathLike,
    modpack_directory: str | os.PathLike | None = None,
    callback: CallbackDict | None = None,
    mrpack_install_options: MrpackInstallOptions | None = None,
    update_files: bool = True,
) -> None:
    """
    Installs a .mrpack file

    ``mrpack_install_options`` is a dict. All Options are Optional.

    .. code:: python

        mrpack_install_options = {
            "optionalFiles": [], # List with all Optional files
            "skipDependenciesInstall": False # If you want to skip the Dependencies install. Only used for testing purposes.
        }

    Example:

    .. code:: python

        path = "/path/to/mrpack"
        minecraft_directory = minecraft_directory.utils.get_minecraft_directory()
        minecraft_launcher_lib.mrpack.install_mrpack(path, minecraft_directory)

    :param path: The Path the the .mrpack file
    :param minecraft_directory: he path to your Minecraft directory
    :param modpack_directory: If you want to install the Pack in another Directory than your Minecraft directory, set it here.
    :param callback: The same dict as for :func:`~minecraft_launcher_lib.install.install_minecraft_version`
    :param mrpack_install_options: Some Options to install the Pack (see below)
    :raises FileOutsideMinecraftDirectory: A File should be placed outside the given Minecraft directory
    """
    minecraft_directory = os.path.abspath(minecraft_directory)
    path = os.path.abspath(path)

    if modpack_directory is None:
        modpack_directory = minecraft_directory
    else:
        modpack_directory = os.path.abspath(modpack_directory)

    if callback is None:
        callback = {}

    if mrpack_install_options is None:
        mrpack_install_options = {}

    with zipfile.ZipFile(path, "r") as zf:
        with zf.open("modrinth.index.json", "r") as f:
            index: MrpackIndex = json.load(f)

        # Download the files
        callback.get("setStatus", empty)("Download mrpack files")
        file_list = _filter_mrpack_files(index["files"], mrpack_install_options)
        callback.get("setMax", empty)(len(file_list))
        for count, file in enumerate(file_list):

            already_exists, existing_file_name = VerifyFileExists(file, modpack_directory)
            if already_exists:

                if existing_file_name == file["path"]:
                    # The file already exists with the same name, so we can skip it
                    callback.get("setProgress", empty)(count + 1)
                    continue
                if not update_files:
                    callback.get("setProgress", empty)(count + 1)
                    continue
                else: 
                    callback.get("setStatus", empty)(f"Updating {file['path']}")
                    # Remove the existing file
                    existing_file_path = abspath(join(modpack_directory, os.path.dirname(file["path"]), existing_file_name))
                    try:
                        os.remove(existing_file_path)
                    except OSError:
                        pass

            full_path = os.path.abspath(os.path.join(modpack_directory, file["path"]))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            download_file(file["downloads"][0], full_path, sha1=file["hashes"]["sha1"], callback=callback)

            callback.get("setProgress", empty)(count + 1)

        # Extract the overrides
        callback.get("setStatus", empty)("Extract overrides")
        for zip_name in zf.namelist():
            # Check if the entry is in the overrides and if it is a file
            if (not zip_name.startswith("overrides/") and not zip_name.startswith("client-overrides/")) and not zip_name.startswith("server-overrides/") or zf.getinfo(zip_name).file_size == 0:
                continue

            # Remove the overrides at the start of the Name
            # We don't have removeprefix() in Python 3.8
            if zip_name.startswith("client-overrides/"):
                file_name = zip_name[len("client-overrides/"):]
            elif zip_name.startswith("server-overrides/"):
                file_name = zip_name[len("server-overrides/"):]
            else:
                file_name = zip_name[len("overrides/"):]

            # Constructs the full Path
            full_path = os.path.abspath(os.path.join(modpack_directory, file_name))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            callback.get("setStatus", empty)(f"Extract {zip_name}]")

            try:
                os.makedirs(os.path.dirname(full_path))
            except FileExistsError:
                pass

            with open(full_path, "wb") as f:
                f.write(zf.read(zip_name))

        if mrpack_install_options.get("skipDependenciesInstall"):
            return

        # Install dependencies
        callback.get("setStatus", empty)("Installing Minecraft " + index["dependencies"]["minecraft"])
        install_minecraft_version(index["dependencies"]["minecraft"], minecraft_directory, callback=callback)

        if "forge" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Forge " + index["dependencies"]["forge"] + " for Minecraft " + index["dependencies"]["minecraft"])
            forge = get_mod_loader("forge")
            forge.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["forge"], callback=callback)

        if "neoforge" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Neoforge " + index["dependencies"]["neoforge"] + " for Minecraft " + index["dependencies"]["minecraft"])
            neoforge = get_mod_loader("neoforge")
            neoforge.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["neoforge"], callback=callback)

        if "fabric-loader" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Fabric " + index["dependencies"]["fabric-loader"] + " for Minecraft " + index["dependencies"]["minecraft"])
            fabric = get_mod_loader("fabric")
            fabric.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["fabric-loader"], callback=callback)

        if "quilt-loader" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Quilt " + index["dependencies"]["quilt-loader"] + " for Minecraft " + index["dependencies"]["minecraft"])
            quilt = get_mod_loader("quilt")
            quilt.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["quilt-loader"], callback=callback)

def install_mrpack_clientside(
    path: str | PathLike,
    minecraft_directory: str | PathLike,
    modpack_directory: str | PathLike | None = None,
    callback: CallbackDict | None = None,
    mrpack_install_options: MrpackInstallOptions | None = None,
    update_files: bool = True,
) -> None:

    path = abspath(path)

    if modpack_directory is None:
        modpack_directory = abspath(minecraft_directory)
    else:
        modpack_directory = abspath(modpack_directory)

    if callback is None:
        callback = {}

    if mrpack_install_options is None:
        mrpack_install_options = {}

    with zipfile.ZipFile(path, "r") as zf:
        with zf.open("modrinth.index.json", "r") as f:
            index: MrpackIndex = json.load(f)

        # Download the files
        callback.get("setStatus", empty)("Download mrpack files")
        file_list = _filter_mrpack_files(index["files"], mrpack_install_options)
        callback.get("setMax", empty)(len(file_list))
        for count, file in enumerate(file_list):

            already_exists, existing_file_name = VerifyFileExists(file, modpack_directory)
            if already_exists:
                if existing_file_name == file["path"]:
                    # The file already exists with the same name, so we can skip it
                    callback.get("setProgress", empty)(count + 1)
                    continue
                if not update_files:
                    callback.get("setProgress", empty)(count + 1)
                    continue
                else: 
                    callback.get("setStatus", empty)(f"Updating {file['path']}")
                    # Remove the existing file
                    existing_file_path = abspath(join(modpack_directory, os.path.dirname(file["path"]), existing_file_name))
                    try:
                        os.remove(existing_file_path)
                    except OSError:
                        pass

            full_path = abspath(join(modpack_directory, file["path"]))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            download_file(file["downloads"][0], full_path, sha1=file["hashes"]["sha1"], callback=callback)

            callback.get("setProgress", empty)(count + 1)

        # Extract the overrides
        callback.get("setStatus", empty)("Extract overrides")
        for zip_name in zf.namelist():
            # Check if the entry is in the overrides and if it is a file
            if (not zip_name.startswith("overrides/") and not zip_name.startswith("client-overrides/")) or zf.getinfo(zip_name).file_size == 0:
                continue

            # Remove the overrides at the start of the Name
            # We don't have removeprefix() in Python 3.8
            if zip_name.startswith("client-overrides/"):
                file_name = zip_name[len("client-overrides/"):]
            else:
                file_name = zip_name[len("overrides/"):]

            # Constructs the full Path
            full_path = abspath(join(modpack_directory, file_name))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            callback.get("setStatus", empty)(f"Extract {zip_name}]")

            try:
                makedirs(dirname(full_path))
            except FileExistsError:
                pass

            with open(full_path, "wb") as f:
                f.write(zf.read(zip_name))

        if mrpack_install_options.get("skipDependenciesInstall"):
            return

        # Install dependencies
        callback.get("setStatus", empty)("Installing Minecraft " + index["dependencies"]["minecraft"])
        install_minecraft_version(index["dependencies"]["minecraft"], minecraft_directory, callback=callback)

        if "forge" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Forge " + index["dependencies"]["forge"] + " for Minecraft " + index["dependencies"]["minecraft"])
            forge = get_mod_loader("forge")
            forge.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["forge"], callback=callback)

        if "neoforge" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Neoforge " + index["dependencies"]["neoforge"] + " for Minecraft " + index["dependencies"]["minecraft"])
            neoforge = get_mod_loader("neoforge")
            neoforge.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["neoforge"], callback=callback)

        if "fabric-loader" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Fabric " + index["dependencies"]["fabric-loader"] + " for Minecraft " + index["dependencies"]["minecraft"])
            fabric = get_mod_loader("fabric")
            fabric.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["fabric-loader"], callback=callback)

        if "quilt-loader" in index["dependencies"]:
            callback.get("setStatus", empty)("Installing Quilt " + index["dependencies"]["quilt-loader"] + " for Minecraft " + index["dependencies"]["minecraft"])
            quilt = get_mod_loader("quilt")
            quilt.install(index["dependencies"]["minecraft"], minecraft_directory, loader_version=index["dependencies"]["quilt-loader"], callback=callback)

def install_mrpack_serverside(
    path: str | PathLike,
    minecraft_directory: str | PathLike,
    modpack_directory: str | PathLike | None = None,
    callback: CallbackDict | None = None,
    mrpack_install_options: MrpackInstallOptions | None = None,
    update_files: bool = True
) -> None:

    path = abspath(path)

    if modpack_directory is None:
        modpack_directory = abspath(minecraft_directory)
    else:
        modpack_directory = abspath(modpack_directory)

    if callback is None:
        callback = {}

    if mrpack_install_options is None:
        mrpack_install_options = {}

    with zipfile.ZipFile(path, "r") as zf:
        with zf.open("modrinth.index.json", "r") as f:
            index: MrpackIndex = json.load(f)

        # Download the files
        callback.get("setStatus", empty)("Download mrpack files")
        file_list = _filter_mrpack_files(index["files"], mrpack_install_options)
        callback.get("setMax", empty)(len(file_list))
        for count, file in enumerate(file_list):

            already_exists, existing_file_name = VerifyFileExists(file, modpack_directory)
            if already_exists:
                if existing_file_name == file["path"]:
                    # The file already exists with the same name, so we can skip it
                    callback.get("setProgress", empty)(count + 1)
                    continue
                if not update_files:
                    callback.get("setProgress", empty)(count + 1)
                    continue
                else: 
                    callback.get("setStatus", empty)(f"Updating {file['path']}")
                    # Remove the existing file
                    existing_file_path = abspath(join(modpack_directory, os.path.dirname(file["path"]), existing_file_name))
                    try:
                        os.remove(existing_file_path)
                    except OSError:
                        pass

            full_path = abspath(join(modpack_directory, file["path"]))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            download_file(file["downloads"][0], full_path, sha1=file["hashes"]["sha1"], callback=callback)

            callback.get("setProgress", empty)(count + 1)

        # Extract the overrides
        callback.get("setStatus", empty)("Extract overrides")
        for zip_name in zf.namelist():
            # Check if the entry is in the overrides and if it is a file
            if (not zip_name.startswith("overrides/") and not zip_name.startswith("server-overrides/")) or zf.getinfo(zip_name).file_size == 0:
                continue

            # Remove the overrides at the start of the Name
            if zip_name.startswith("server-overrides/"):
                file_name = zip_name[len("server-overrides/"):]
            else:
                file_name = zip_name[len("overrides/"):]

            # Constructs the full Path
            full_path = abspath(join(modpack_directory, file_name))

            check_path_inside_minecraft_directory(modpack_directory, full_path)

            callback.get("setStatus", empty)(f"Extract {zip_name}]")

            try:
                makedirs(dirname(full_path))
            except FileExistsError:
                pass

            with open(full_path, "wb") as f:
                f.write(zf.read(zip_name))

# Vanilla Launcher

VANILLA_BLOCK_OPTIONS: list[str] = [
    "Bedrock", "Bookshelf", "Brick", "Cake", "Carved_Pumpkin",
    "Chest", "Clay", "Coal_Block", "Coal_Ore", "Cobblestone",
    "Crafting_Table", "Creeper_Head", "Diamond_Block", "Diamond_Ore",
    "Dirt", "Dirt_Podzol", "Dirt_Snow", "Emerald_Block", "Emerald_Ore",
    "Enchanting_Table", "End_Stone", "Farmland", "Furnace", "Furnace_On",
    "Glass", "Glazed_Terracotta_Light_Blue", "Glazed_Terracotta_Orange",
    "Glazed_Terracotta_White", "Glowstone", "Gold_Block", "Gold_Ore",
    "Grass", "Gravel", "Hardened_Clay", "Ice_Packed", "Iron_Block",
    "Iron_Ore", "Lapis_Ore", "Leaves_Birch", "Leaves_Jungle", "Leaves_Oak",
    "Leaves_Spruce", "Lectern_Book", "Log_Acacia", "Log_Birch", "Log_DarkOak",
    "Log_Jungle", "Log_Oak", "Log_Spruce", "Mycelium", "Nether_Brick",
    "Netherrack", "Obsidian", "Planks_Acacia", "Planks_Birch", "Planks_DarkOak",
    "Planks_Jungle", "Planks_Oak", "Planks_Spruce", "Quartz_Ore", "Red_Sand",
    "Red_Sandstone", "Redstone_Block", "Redstone_Ore", "Sand", "Sandstone",
    "Skeleton_Skull", "Snow", "Soul_Sand", "Stone", "Stone_Andesite",
    "Stone_Diorite", "Stone_Granite", "TNT", "Water", "Wool",
]

class NewVanillaLauncherProfile(VanillaLauncherProfile):
    icon: str | None = None

    def getVanillaLauncherProfile(self) -> VanillaLauncherProfile:
        profile = VanillaLauncherProfile(
            name=self.name,
            versionType=self.versionType,
            version=self.version,
            gameDirectory=self.gameDirectory,
            javaExecutable=self.javaExecutable,
            javaArguments=self.javaArguments,
            customResolution=self.customResolution
        )

        return profile

def add_vanilla_launcher_profile(
    minecraft_directory: str | PathLike,
    vanilla_profile: NewVanillaLauncherProfile
) -> None:
    """
    Adds a new Profile to the Vanilla Launcher

    Example:

    .. code:: python

        profile: minecraft_launcher_lib.types.VanillaLauncherProfile = {
            "name": "test",
            "versionType": "latest-release",
        }

        minecraft_directory = minecraft_launcher_lib.utils.get_minecraft_directory()
        minecraft_launcher_lib.vanilla_launcher.add_vanilla_launcher_profile(minecraft_directory, profile)

    :param minecraft_directory: The Minecraft directory
    :param vanilla_profile: The new Profile
    :raises InvalidVanillaLauncherProfile: The given Profile is invalid
    """
    if not vanilla_launcher._is_vanilla_launcher_profile_valid(vanilla_profile):
        raise InvalidVanillaLauncherProfile(vanilla_profile)

    with open(join(minecraft_directory, "launcher_profiles.json"), "r", encoding="utf-8") as f:
        data: VanillaLauncherProfilesJson = json.load(f)

    new_profile: VanillaLauncherProfilesJsonProfile = {}
    new_profile["name"] = vanilla_profile["name"]

    if vanilla_profile["versionType"] == "latest-release":
        new_profile["lastVersionId"] = "latest-release"
    elif vanilla_profile["versionType"] == "latest-snapshot":
        new_profile["lastVersionId"] = "latest-snapshot"
    elif vanilla_profile["versionType"] == "custom":
        # _is_vanilla_launcher_profile_valid() ensures that version is not None, when versionType is set to custom, so we can ignore the mypy error here
        new_profile["lastVersionId"] = vanilla_profile["version"]  # type: ignore

    if (game_directory := vanilla_profile.get("gameDirectory")) is not None:
        new_profile["gameDir"] = game_directory

    if (java_executable := vanilla_profile.get("javaExecutable")) is not None:
        new_profile["javaDir"] = java_executable

    if (java_arguments := vanilla_profile.get("javaArguments")) is not None:
        new_profile["javaArgs"] = " ".join(java_arguments)

    if (custom_resolution := vanilla_profile.get("customResolution")) is not None:
        new_profile["resolution"] = {
            "height": custom_resolution["height"],
            "width": custom_resolution["width"]
        }

    if (icon := vanilla_profile.get("icon")) is not None:
        new_profile["icon"] = icon if icon in VANILLA_BLOCK_OPTIONS else "Furnace"

    new_profile["created"] = datetime.datetime.now().isoformat()
    new_profile["lastUsed"] = datetime.datetime.now().isoformat()
    new_profile["type"] = "custom"

    # Generate a Key for the Profile
    while True:
        key = str(uuid4())
        if key not in data["profiles"]:
            break

    data["profiles"][key] = new_profile

    with open(join(minecraft_directory, "launcher_profiles.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)