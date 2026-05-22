import { InstallationModpackProps } from "@/hooks/minecraft/minecraft"

const GetMinecraftDirectory = async (): Promise<string> => {
    try {
        const url = new URL('http://127.0.0.1:8002/minecraft/minecraft_directory/')

        const resp = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as string
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
}

const AddVanillaLauncher = async (
    props: InstallationModpackProps
) => {
    try {
        const url = new URL('http://127.0.0.1:8002/minecraft/add_vanilla_launcher/')

        url.searchParams.set('mrpack_directory', props.mrpack_path)
        url.searchParams.set('profile_directory', props.installation_directory)

        if (props.memory?.min && props.memory?.max) {
            url.searchParams.set('java_min', props.memory?.min != "" ? String(props.memory.min) : '2')
            url.searchParams.set('java_max', props.memory?.max != "" ? String(props.memory.max) : '4')
        }

        if (props.profile_icon) url.searchParams.set('icon', props.profile_icon ?? 'Furnace')

        const resp = await fetch(url.toString(), { method: 'POST', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as string
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
}

const IsModdedMinecraftDirectory = async (directory: string): Promise<boolean> => {
    try {
        const url = new URL('http://127.0.0.1:8002/minecraft/directory/is_modded')

        url.searchParams.append('directory', directory)

        const res = await fetch(url.toString(), { method: 'GET' })
        if (!res.ok) {
            throw new Error(`Request failed (${res.status})`)
        }

        const result = await res.json()
        return result
    } catch (error) {
        console.error('Error checking if directory is modded:', error)
        throw error
    }
}

export {
    GetMinecraftDirectory,
    AddVanillaLauncher,
    IsModdedMinecraftDirectory,
}