import { Project } from '@/interfaces/modrinth/Projects';
import { SearchHit } from '@/interfaces/modrinth/Hit';
import { MrpackInfo, MrpackMetadata } from '@/interfaces/modrinth/MrPack'

const modrinthFetchRandomProjects = async (count: number = 10): Promise<Project[]> => {
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

const modrinthSearchProjects = async (count: number = 10, type?: string, querry?: string, offset?: number): Promise<SearchHit> => {
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


export {
    modrinthFetchRandomProjects,
    modrinthSearchProjects,
    GetMrpackMedatadaInfo,
    GetMrpackInfo
}