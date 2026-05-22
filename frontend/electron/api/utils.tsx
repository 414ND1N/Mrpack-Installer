const PathJoin = async (...paths: string[]): Promise<string> => {
    try {
        const url = new URL('http://127.0.0.1:8002/utils/path/join')
        // Enviar cada path como parámetro repeated para que FastAPI lo reciba como lista
        paths.forEach(p => url.searchParams.append('paths', p))

        const res = await fetch(url.toString(), { method: 'GET' })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const detail = (errorData as any).detail || `Request failed (${res.status})`
            throw new Error(detail)
        }

        const result = await res.text()
        return result
    } catch (error) {
        console.error('Error joining paths:', error)
        throw error
    }
}

const PathExists = async (path: string): Promise<{
    exists: boolean,
    is_file: boolean
}> => {
    try {
        const url = new URL('http://127.0.0.1:8002/utils/path/exists')
        url.searchParams.append('path', path)

        const res = await fetch(url.toString(), { method: 'GET' })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const detail = (errorData as any).detail || `Request failed (${res.status})`
            throw new Error(detail)
        }

        const result = await res.json()
        return result
    } catch (error) {
        console.error('Error checking file existence:', error)
        throw error
    }
}

const PathDelete = async (path: string): Promise<{
    success: boolean,
    is_file: boolean
    error?: string
}> => {
    try {
        const url = new URL('http://127.0.0.1:8002/utils/path/delete')
        url.searchParams.append('path', path)

        const res = await fetch(url.toString(), { method: 'DELETE' })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const detail = (errorData as any).detail || `Request failed (${res.status})`
            throw new Error(detail)
        }
        const result = await res.json()
        return result
    } catch (error) {
        console.error('Error deleting path:', error)
        throw error
    }
}

const GetVersion = async (): Promise<string> => {
    try {
        const url = new URL('http://127.0.0.1:8002/')
    
        const res = await fetch(url.toString(), { method: 'GET' })
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            const detail = (errorData as any).detail || `Connection failed (${res.status})`
            throw new Error(detail)
        }
    
        const data = await res.json()
        return data.version || 'unknown'
    } catch (error) {
        console.error('Error fetching version:', error)
        throw error
    }
}

export {
    PathJoin,
    GetVersion,
    PathExists,
    PathDelete
}