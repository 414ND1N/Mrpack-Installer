import { Project } from '@/interfaces/modrinth/Projects';
import { SearchHit } from '@/interfaces/modrinth/Hit';
import { MrpackInfo, MrpackMetadata } from '@/interfaces/modrinth/MrPack'
import { InstallationModpackProps } from "@/hooks/minecraft/minecraft"
import { CollectionInfo, CollectionDownloadInfo, ModsInCollectionInfo } from '@/interfaces/modrinth/Collection'

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

const FetchRandomProjects = async (count: number = 10): Promise<Project[]> => {
    try {
        const url = new URL('http://127.0.0.1:8001/modrinth/projects_random/')
        url.searchParams.set('count', count.toString())

        const resp = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as Project[]
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
}

const SearchProjects = async (count: number = 10, type?: string, querry?: string, offset?: number): Promise<SearchHit> => {
    try {
        const url = new URL('http://127.0.0.1:8001/modrinth/search/')
        url.searchParams.set('limit', count.toString())
        if (querry) url.searchParams.set('query', querry)
        if (offset != null) url.searchParams.set('offset', offset.toString())
        if (type) url.searchParams.set('facets', JSON.stringify([[`project_type:${type}`]]))

        const resp = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as SearchHit
    } catch (error) {
        console.error('Error fetching search projects:', error)
        throw error
    }
}

const GetMrpackMedatadaInfo = async (filePath: string): Promise<MrpackMetadata> => {
    try {
        const resp = await fetch(`http://127.0.0.1:8001/mrpack/metadata/?file_path=${encodeURIComponent(filePath)}`, { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as MrpackMetadata
    } catch (error) {
        console.error('Error fetching Mrpack metadata:', error)
        throw error
    }
}

const GetMrpackInfo = async (filePath: string): Promise<MrpackInfo> => {
    try {
        const resp = await fetch(`http://127.0.0.1:8001/mrpack/info/?file_path=${encodeURIComponent(filePath)}`, { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as MrpackInfo
    } catch (error) {
        console.error('Error fetching Mrpack metadata:', error)
        throw error
    }
}

const DownloadCollection = async (collectionId: string, version: string, loader: string, directory: string, updateExisting: boolean, log: boolean = false): Promise<CollectionDownloadInfo> => {
    try {
        const payload = { collection_id: collectionId.trim(), version, loader, directory, update: updateExisting, log}
        const res = await fetch('http://127.0.0.1:8001/modrinth/collection/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const body = await res.text().catch(() => res.statusText)
            throw new Error(`Request failed (${res.status}): ${body}`)
        }
        const result = await res.json()
        return result as CollectionDownloadInfo
    } catch (error) {
        console.error('downloadCollection error', error)
        throw error
    }
}

const GetCollectionInfo = async (collectionId:string): Promise<CollectionInfo> => {
    try {
        const url = new URL('http://127.0.0.1:8001/modrinth/collection/info/')
        url.searchParams.set('collection_id', collectionId)
        const res = await fetch(url, { method: 'GET', cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data as CollectionInfo
    } catch (error) {
        console.error('Error fetching collection info:', error)
        throw error
    }
}

const GetModsInCollectionInfo = async (collectionId:string, version: string, loader: string): Promise<ModsInCollectionInfo> => {
    try {
        const url = new URL('http://127.0.0.1:8001/modrinth/collection/mods/verify')
        url.searchParams.set('collection_id', collectionId)
        url.searchParams.set('version', version)
        url.searchParams.set('loader', loader)
        const res = await fetch(url, { method: 'GET', cache: 'no-store' })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data as ModsInCollectionInfo

    } catch (error) {
        console.error('Error fetching mods in collection info:', error)
        throw error
    }
}

export {
    FetchRandomProjects,
    SearchProjects,
    GetMrpackMedatadaInfo,
    GetMrpackInfo,
    DownloadCollection,
    StartMrpackInstallation,
    GetCollectionInfo,
    GetModsInCollectionInfo
}