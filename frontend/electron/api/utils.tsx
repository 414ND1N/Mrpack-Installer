const PathJoin = async (...paths: string[]): Promise<string> => {
    try {
        const url = new URL('http://127.0.0.1:8001/utils/path_join/')
        // Enviar cada path como parámetro repeated para que FastAPI lo reciba como lista
        paths.forEach(p => url.searchParams.append('paths', p))

        const res = await fetch(url.toString(), { method: 'GET' })
        if (!res.ok) {
            const body = await res.text().catch(() => res.statusText)
            throw new Error(`Request failed (${res.status}): ${body}`)
        }

        const result = await res.text()
        return result
    } catch (error) {
        console.error('Error joining paths:', error)
        throw error
    }
}

export {
    PathJoin
}