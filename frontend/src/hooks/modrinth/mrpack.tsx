import fs from 'fs'
import JSZip from 'jszip'
import path from 'path'


import Downloader from "@/hooks/minecraft-java-core/src/utils/Downloader"
import { MrpackInfo, MrpackMetadata, MrpackDependency } from './Types'

const GetMrpackInfo = async (filePath: string): Promise<MrpackInfo> => {

    /*
        Obtener los datos obtenidos de un mrpack

        :param filePath: Ruta al archivo mrpack
    */

    try {
        console.log('Fetching mrpack metadata from local file:', filePath)

        // Leer el archivo como un buffer
        const fileData = fs.readFileSync(filePath)

        // Cargar el archivo ZIP
        const zip = await JSZip.loadAsync(fileData)

        // Leer el archivo `modrinth.index.json` dentro del ZIP
        const _indexFile = await zip.file('modrinth.index.json')?.async('string')
        if (!_indexFile) {
            throw new Error('modrinth.index.json not found in the mrpack file')
        }

        const index = JSON.parse(_indexFile)

        // Normalizar las dependencias si vienen como un objeto
        const _dependencies: MrpackDependency[] = Array.isArray(index.dependencies)
            ? index.dependencies
            : Object.entries(index.dependencies).map(([id, version]) => ({ id, version }))

        // Crear el objeto de metadatos
        const _metadata: MrpackMetadata = {
            game: index.game,
            formatVersion: index.formatVersion,
            versionId: index.versionId,
            name: index.name,
            summary: index.summary || '',
            files: index.files,
            dependencies: _dependencies,
        }

        // Generar optional files
        let _optionalFiles: string[] = []
        _metadata.files.forEach((file) => {
            if (file.env && file.env.client === 'optional') {
                _optionalFiles.push(file.path)
            }
        })

        let mrpackData: MrpackInfo = {
            metadata: _metadata,
            optionalFiles: _optionalFiles,
            minecraftVersion: Array.isArray(_dependencies)
                ? _dependencies.find(dep => dep.id === 'minecraft')?.version || ''
                : '',
            overrides: zip.file('overrides') !== null,
            server_overrides: zip.file('server-overrides') !== null,
            client_overrides: zip.file('client-overrides') !== null,
        }

        // Buscar si hay una dependencia de tipo loader
        const loaderDependency = _dependencies.find(dep => dep.id !== 'minecraft')
        if (loaderDependency) {
            mrpackData.loader = {
                type: loaderDependency.id,
                version: loaderDependency.version,
            }
        }

        return mrpackData

    } catch (error) {
        console.error('Error fetching mrpack metadata:', error)
        throw error
    }
}

const MinecraftVersionFromDependencies = (deps: any): string => {
    if (!deps) return "latest"
    if (Array.isArray(deps)) {
        const mcDep = deps.find((d: any) => d?.id === "minecraft")
        if (mcDep?.version) return mcDep.version
    } else if (typeof deps === "object") {
        // posible formas: { minecraft: "1.18.2" } o { minecraft: { version: "1.18.2" } } o { version: "1.18.2" }
        if (typeof deps.minecraft === "string") return deps.minecraft
        if (deps.minecraft?.version) return deps.minecraft.version
        if (typeof deps.version === "string") return deps.version
    }
    return "latest"
}

const GetMrpackMedatadaInfo = async (filePath: string): Promise<MrpackMetadata> => {

    /*
        Obtener la metadata de un mrpack
        :param filePath: Ruta al archivo mrpack
    */

    try {
        console.log('Fetching mrpack metadata from local file:', filePath)

        // Leer el archivo como un buffer
        const fileData = fs.readFileSync(filePath)

        // Cargar el archivo ZIP
        const zip = await JSZip.loadAsync(fileData)

        // Leer el archivo `modrinth.index.json` dentro del ZIP
        const _indexFile = await zip.file('modrinth.index.json')?.async('string')
        if (!_indexFile) {
            throw new Error('modrinth.index.json not found in the mrpack file')
        }

        const index = JSON.parse(_indexFile)

        // Normalizar las dependencias si vienen como un objeto
        const _dependencies: MrpackDependency[] = Array.isArray(index.dependencies)
            ? index.dependencies
            : Object.entries(index.dependencies).map(([id, version]) => ({ id, version }))

        return {
            game: index.game,
            formatVersion: index.formatVersion,
            versionId: index.versionId,
            name: index.name,
            summary: index.summary || '',
            files: index.files,
            dependencies: _dependencies,
        } as MrpackMetadata

    } catch (error) {
        console.error('Error fetching mrpack metadata:', error)
        throw error
    }
}

const DownloadMarpackFiles = async (filePath: string, downloadPath: string, downloadType: string = 'singleplayer'): Promise<void> => {
    try {
        console.log('Fetching mrpack metadata from local file:', filePath)

        // Leer el archivo como un buffer
        const fileData = fs.readFileSync(filePath)

        // Cargar el archivo ZIP
        const zip = await JSZip.loadAsync(fileData)

        // Leer el archivo `modrinth.index.json` dentro del ZIP
        const _indexFile = await zip.file('modrinth.index.json')?.async('string')
        if (!_indexFile) {
            throw new Error('modrinth.index.json not found in the mrpack file')
        }

        const index = JSON.parse(_indexFile)

        // Descargar archivos
        // let _download_files: DownloadOptions[] = []
        let _download_files: any[] = []
        // let total_bytes = 0


        index.files.forEach(async (file: any) => {

            const _url = file.downloads[0]
            // const _path = file.path
            // const _lenght = file.fileSize || 0
            // const _folder = downloadPath

            if (downloadType !== 'singleplayer' && file.env[downloadType] === 'unsupported') {
                console.log(`Skipping unsupported ${downloadType} file: ${file.path}`)
                return // Skip unsupported files
            }

            // _download_files.push({
            //     url: _url,
            //     path: _path,
            //     folder: downloadPath.replace(/\\/g, '/'), // Normalizar la ruta para evitar problemas con las barras invertidas
            //     length: _lenght,
            // })

            const complete_path = path.join(downloadPath, file.path).replace(/\\/g, '/')
            const _file_name = path.basename(complete_path)
            const _downloadPathDir = path.dirname(complete_path)

            _download_files.push({
                url: _url,
                dirPath: _downloadPathDir,
                fileName: _file_name, // Normalizar la ruta para evitar problemas con las barras invertidas
            })

            // total_bytes += _lenght

        })

        if (_download_files.length === 0) {
            console.warn('No files to download. Check the mrpack file and its dependencies.')
            return
        }

        const downloader = new Downloader()
        // downloader.downloadFileMultiple(_download_files, total_bytes, 5)

        _download_files.forEach(async (file: any) => {
            await downloader.downloadFile(file.url, file.dirPath, file.fileName)
        })

        const zipEntries = zip.file(/.*/)
        const overridesFiles = zipEntries.filter(entry => entry.name.startsWith('overrides/'))
        const clientOverridesFiles = zipEntries.filter(entry => entry.name.startsWith('client-overrides/'))
        const serverOverridesFiles = zipEntries.filter(entry => entry.name.startsWith('server-overrides/'))

        // Procesar los archivos de cada carpeta
        if (overridesFiles.length > 0) {
            for (const file of overridesFiles) {
                const content = await file.async('nodebuffer')
                const outputPath = path.join(downloadPath, file.name.replace(/^overrides\//, ''))
                const outputDir = path.dirname(outputPath)

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true })
                }

                fs.writeFileSync(outputPath, content)
            }
        }

        if (clientOverridesFiles.length > 0 && (downloadType === 'client' || downloadType === 'singleplayer')) {
            for (const file of clientOverridesFiles) {
                const content = await file.async('nodebuffer')
                const outputPath = path.join(downloadPath, file.name.replace(/^client-overrides\//, ''))
                const outputDir = path.dirname(outputPath)

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true })
                }

                fs.writeFileSync(outputPath, content)
            }
        }

        if (serverOverridesFiles.length > 0 && (downloadType === 'server' || downloadType === 'singleplayer')) {
            for (const file of serverOverridesFiles) {
                const content = await file.async('nodebuffer')
                const outputPath = path.join(downloadPath, file.name.replace(/^server-overrides\//, ''))
                const outputDir = path.dirname(outputPath)

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true })
                }

                fs.writeFileSync(outputPath, content)
            }
        }

    } catch (error) {
        console.error('Error fetching mrpack metadata:', error)
        throw error
    }
}


export {
    GetMrpackInfo,
    GetMrpackMedatadaInfo,
    DownloadMarpackFiles,
    MinecraftVersionFromDependencies
}