const OpenFolder = async (title: string, message: string) => {
    try {
        const result = await (window as any).winConfig.ShowOpenDialog({
            title: title,
            properties: ['openDirectory'],
            createDirectory: true,
            promptToCreate: true,
            message: message
        })
        if (!result || result.canceled) return
        const selected = result.filePaths && result.filePaths[0]
        if (selected) return selected
        return null
    } catch (error) {
        console.error("Error opening folder:", error)
    }
}

export {
    OpenFolder
}