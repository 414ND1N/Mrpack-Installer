import axios from 'axios'

// Interfaces
import { Project } from '@/interfaces/Projects';
import { SearchHit } from '@/interfaces/Hit';

export const fetchRandomProjects = async (count: number = 10): Promise<Project[]> => {
    try {
        const url = new URL('https://api.modrinth.com/v2/projects_random')
        url.searchParams.set('count', count.toString())
        const response = await axios.get(url.toString())

        return  response.data as Project[]
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
}

export const searchProjects = async ( count: number = 10, type?: string , querry?: string, offset?:number): Promise<SearchHit> => {
    try {
        const url = new URL('https://api.modrinth.com/v2/search')
        url.searchParams.set('limit', count.toString())
        if (querry) { url.searchParams.set('query', querry) }
        if (offset) { url.searchParams.set('offset', offset.toString()) }
        if (type) { url.searchParams.set('facets', JSON.stringify([[`project_type:${type}`]])) }

        const response = await axios.get(url.toString())

        return response.data as SearchHit
    } catch (error) {
        console.error('Error fetching random projects:', error)
        throw error
    }
}