import { InstallationModpackProps } from "@/hooks/minecraft/minecraft"

const GetMinecraftDirectory = async (): Promise<string> => {
    try {
        const url = new URL('http://127.0.0.1:8001/minecraft/minecraft_directory/')

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
        const url = new URL('http://127.0.0.1:8001/minecraft/add_vanilla_launcher/')

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

const StartMrpackInstallation = async (
    props: InstallationModpackProps,
    cbStatus?: (status: string) => void,
    cbMax?: (max: number) => void,
    cbProgress?: (progress: number) => void,
    cbFinish?: (status: string) => void,
    cbError?: (error: string) => void,
) => {
    try {
        const url = 'http://127.0.0.1:8001/mrpack/install/start/'

        const resp = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                installation_type: props.type,
                mrpack_directory: props.mrpack_path,
                profile_directory: props.installation_directory,
            }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const { install_id } = await resp.json()

        const es = new EventSource(`http://127.0.0.1:8001/install/stream/${install_id}`);
        es.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if (data.type === 'status' && cbStatus) {
                cbStatus(data.message)
            } else if (data.type === 'max' && cbMax) {
                cbMax(data.message)
            } else if (data.type === 'progress' && cbProgress) {
                cbProgress(data.message)
            } else if (data.type === 'error' && cbError) {
                es.close();
                cbError(data.message)
            } else if (data.type === 'done') {
                es.close();
                if (cbFinish) cbFinish(data.message)
                else if (cbStatus) cbStatus('Installation completed!')
            }
            // console.log('SSE', data);
        };
        es.onerror = (err) => {
            console.error('SSE error', err);
            if (cbError) cbError(err.toString())
            else if (cbStatus) cbStatus(err.toString())
        };

    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
    
}

export {
    GetMinecraftDirectory,
    AddVanillaLauncher,
    StartMrpackInstallation
}