import { MrpackInfo, MrpackMetadata } from '@/interfaces/modrinth/MrPack'
import { CollectionInfo, CollectionDownloadInfo, ModsInCollectionInfo } from '@/interfaces/modrinth/Collection'
const StartMrpackInstallation = async (
    installationType: string,
    mrpackDirectory: string,
    profileDirectory: string,
    cbStatus?: (status: string) => void,
    cbMax?: (max: number) => void,
    cbProgress?: (progress: number) => void,
    cbFinish?: (status: string) => void,
    cbError?: (error: string) => void
) => {
    try {
        const url = 'http://127.0.0.1:8002/mrpack/install/start/'

        const resp = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                installation_type: installationType,
                mrpack_directory: mrpackDirectory,
                profile_directory: profileDirectory,
            }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const { install_id } = await resp.json()

        await new Promise<void>((resolve, reject) => {
            const es = new EventSource(`http://127.0.0.1:8002/mrpack/install/stream/${install_id}`)
            let settled = false

            const finishResolve = () => {
                if (settled) return
                settled = true
                es.close()
                resolve()
            }

            const finishReject = (message: string) => {
                if (settled) return
                settled = true
                es.close()
                reject(new Error(message))
            }

            es.onmessage = (ev) => {
                const data = JSON.parse(ev.data)

                if (data.type === 'status' && cbStatus) {
                    cbStatus(data.message)
                } else if (data.type === 'max' && cbMax) {
                    cbMax(data.message)
                } else if (data.type === 'progress' && cbProgress) {
                    cbProgress(data.message)
                } else if (data.type === 'error') {
                    const errorMessage = String(data.message || 'Installation failed')
                    if (cbError) cbError(errorMessage)
                    finishReject(errorMessage)
                } else if (data.type === 'done') {
                    if (cbFinish) cbFinish(data.message)
                    else if (cbStatus) cbStatus('Installation completed!')
                    finishResolve()
                }
            }

            es.onerror = () => {
                const errorMessage = 'Connection error during installation stream'
                console.error('SSE error')
                if (cbError) cbError(errorMessage)
                else if (cbStatus) cbStatus(errorMessage)
                finishReject(errorMessage)
            }
        })

    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }

}

const GetMrpackMedatadaInfo = async (filePath: string): Promise<MrpackMetadata> => {
    try {
        const resp = await fetch(`http://127.0.0.1:8002/mrpack/metadata/?file_path=${encodeURIComponent(filePath)}`, { method: 'GET', cache: 'no-store' })
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
        const resp = await fetch(`http://127.0.0.1:8002/mrpack/info/?file_path=${encodeURIComponent(filePath)}`, { method: 'GET', cache: 'no-store' })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as MrpackInfo
    } catch (error) {
        console.error('Error fetching Mrpack metadata:', error)
        throw error
    }
}

const DownloadCollection = async (
    collectionId: string,
    version: string,
    loaders: string[],
    directory: string,
    updateExisting: boolean,
    log: boolean = true
): Promise<CollectionDownloadInfo> => {
    try {
        const payload = { 
            collection_id: collectionId.trim(),
            version,
            loaders,
            directory,
            update: updateExisting,
            log 
        }
        const res = await fetch('http://127.0.0.1:8002/modrinth/collection/download', {
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

const GetCollectionInfo = async (collectionId: string): Promise<CollectionInfo> => {
    try {
        const url = new URL('http://127.0.0.1:8002/modrinth/collection/info/')
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

const GetModsInCollectionInfo = async (collectionId: string, version: string, loaders: string): Promise<ModsInCollectionInfo> => {
    try {
        const url = new URL('http://127.0.0.1:8002/modrinth/collection/mods/verify')
        url.searchParams.set('collection_id', collectionId)
        url.searchParams.set('version', version)
        url.searchParams.set('loaders', loaders)
        const res = await fetch(url, { method: 'GET', cache: 'no-store' })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data as ModsInCollectionInfo

    } catch (error) {
        console.error('Error fetching mods in collection info:', error)
        throw error
    }
}


import { Project } from '@/interfaces/modrinth/Projects'
import { SearchHit } from '@/interfaces/modrinth/Hit'

const FetchRandomProjects = async (count: number = 10): Promise<Project[]> => {
    const url = new URL('https://api.modrinth.com/v2/projects_random')
    url.searchParams.set('count', count.toString())

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
        const resp = await fetch(url.toString(), { method: 'GET', cache: 'no-store', signal: controller.signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as Project[]
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    } finally {
        clearTimeout(timeout)
    }
}

const SearchProjects = async (count: number = 10, type?: string, query?: string, offset?: number): Promise<SearchHit> => {
    const url = new URL('https://api.modrinth.com/v2/search')
    url.searchParams.set('limit', count.toString())
    if (query) url.searchParams.set('query', query)
    if (offset != null) url.searchParams.set('offset', offset.toString())
    if (type) url.searchParams.set('facets', JSON.stringify([[`project_type:${type}`]]))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
        const resp = await fetch(url.toString(), { method: 'GET', cache: 'no-store', signal: controller.signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        return data as SearchHit
    } catch (error) {
        console.error('Error fetching search projects:', error)
        throw error
    } finally {
        clearTimeout(timeout)
    }
}

export {
    // FetchRandomProjects,
    // SearchProjects,
    GetMrpackMedatadaInfo,
    GetMrpackInfo,
    DownloadCollection,
    StartMrpackInstallation,
    GetCollectionInfo,
    GetModsInCollectionInfo,
    FetchRandomProjects,
    SearchProjects

}