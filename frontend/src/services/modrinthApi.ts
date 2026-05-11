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
    FetchRandomProjects,
    SearchProjects
}