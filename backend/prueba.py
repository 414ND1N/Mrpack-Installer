import minecraft_launcher_lib
import sys
import os

async def install_mrpack(minecraft_directory, modpack_directory) -> None:

    mrpack_path = input("Ingrese la ruta del archivo .mrpack: ")

    if not os.path.isfile(mrpack_path):
        sys.exit(1)

    try:
        mrpack_information = minecraft_launcher_lib.mrpack.get_mrpack_information(mrpack_path)
        if not mrpack_information:
            sys.exit(1)
    except Exception:
        sys.exit(1)

    if minecraft_directory == "":
        minecraft_directory = minecraft_launcher_lib.utils.get_minecraft_directory()

    if modpack_directory == "":
        modpack_directory = minecraft_directory

    # Adds the Optional Files
    mrpack_install_options: minecraft_launcher_lib.types.MrpackInstallOptions = {"optionalFiles": []}
    for i in mrpack_information["optionalFiles"]:
        mrpack_install_options["optionalFiles"].append(i)

    minecraft_launcher_lib.mrpack.install_mrpack(
        mrpack_path,
        minecraft_directory,
        modpack_directory=modpack_directory,
        mrpack_install_options=mrpack_install_options,
        callback={"setStatus": print}
    )
