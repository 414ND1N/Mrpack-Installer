import minecraft_launcher_lib
import subprocess
import sys
import os


def run_modpack(modpack_directory, mrpack_path, minecraft_directory):
    options = minecraft_launcher_lib.utils.generate_test_options()
    options["gameDirectory"] = modpack_directory
    command = minecraft_launcher_lib.command.get_minecraft_command(
        minecraft_launcher_lib.mrpack.get_mrpack_launch_version(mrpack_path),
        minecraft_directory, options
    )
    subprocess.run(command)

def get_mrpack_information(mrpack_path):
    try:
        return minecraft_launcher_lib.mrpack.get_mrpack_information(mrpack_path)
    except Exception:
        print(f"{mrpack_path} is not a valid .mrpack File")
        return None

def add_vanilla_profile(minecraft_directory, mrpack_path, profile_directory, jargs=None, icon=None) -> bool:
    
    print("\nCREANDO PERFIL...")
    print("Directorio del modpack: ", profile_directory)
    print("Directorio del mrpack a instalar: ", mrpack_path)

    if not os.path.isfile(mrpack_path):
        print(f"{mrpack_path} was not found", file=sys.stderr)
        sys.exit(1)

    try:
        mrpack_information = get_mrpack_information(mrpack_path)

        if not mrpack_information:
            sys.exit(1)

    except Exception:
        print(f"{mrpack_path} no es un archivo .mrpack válido !!")
        sys.exit(1)

    # Print some Information
    #print("Name: ", mrpack_information["name"])    
    #print("Summary: ", mrpack_information["summary"])
    #print("versionId: ", mrpack_information["versionId"])
    #print("formatVersion: ", mrpack_information["formatVersion"])
    #print("Minecraft version: ", mrpack_information["minecraftVersion"])
    #print("optionalFiles: ", mrpack_information["optionalFiles"])

    if not minecraft_launcher_lib.vanilla_launcher.do_vanilla_launcher_profiles_exists(minecraft_directory):
        print("No se encontraron perfiles de Minecraft !!")
        sys.exit(1)

    # Profile
    profile = {
        "name": mrpack_information["name"],
        "version": minecraft_launcher_lib.mrpack.get_mrpack_launch_version(mrpack_path),
        "versionType": "custom",
        "gameDirectory": profile_directory,
        "javaExecutable": None,
        "javaArguments": jargs,
        "customResolution": None,
        "icon": icon,
    }

    print("\nDatos del perfil a crear:")
    print(profile)

    minecraft_launcher_lib.vanilla_launcher.add_vanilla_launcher_profile(minecraft_directory, profile)


async def install_mrpack(minecraft_directory, modpack_directory, mrpack_path) -> None:

    print("\nINSTALANDO MODPACK...")

    if not os.path.isfile(mrpack_path):
        print(f"{mrpack_path} no fue encontrado !!", file=sys.stderr)
        sys.exit(1)

    try:
        mrpack_information = get_mrpack_information(mrpack_path)
        if not mrpack_information:
            sys.exit(1)
    except Exception:
        print(f"{mrpack_path} no es un archivo .mrpack válido !!")
        sys.exit(1)

    # Print some Information
    print("\nDatos del modpack encontrado:")
    print("Nombre: ", mrpack_information["name"])    
    print("Resumen: ", mrpack_information["summary"])
    print("Version Minecraft: ", mrpack_information["minecraftVersion"])

    if minecraft_directory == "":
        minecraft_directory = minecraft_launcher_lib.utils.get_minecraft_directory()

    if modpack_directory == "":
        modpack_directory = minecraft_directory

    # Adds the Optional Files
    mrpack_install_options: minecraft_launcher_lib.types.MrpackInstallOptions = {"optionalFiles": []}
    for i in mrpack_information["optionalFiles"]:
        mrpack_install_options["optionalFiles"].append(i)

    # Install
    print("\nInstalando modpack...")
    print("Directorio del modpack: ", modpack_directory)
    print("Directorio del mrpack: ", mrpack_path)
    print("Archivos opcionales: ", mrpack_install_options)

    minecraft_launcher_lib.mrpack.install_mrpack(
        mrpack_path,
        minecraft_directory,
        modpack_directory=modpack_directory,
        mrpack_install_options=mrpack_install_options,
        callback={"setStatus": print}
    )
    print("\nSe ha instalado el Pack con éxito !!")
