// Componentes
// Sidebar ahora se monta globalmente desde el layout
import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { MCButton, MCInput } from "@/components/MC/MC"
import { Dialog, DialogTitle, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogDescription } from "@/components/Dialog/Dialog"
import { Separator } from "@/components/Separator/separator"
// Css
import "./Discover.css"

// Interfaces
import { Hit, ProjectIndex, Category, ProjectType, HitSide } from "@/interfaces/modrinth/Hit"


function Discover() {

    // Obtener projectos random
    const [projects, setProjects] = useState<Hit[]>([])
    const [page, setPage] = useState(0)
    const [totalProjects, setTotalProjects] = useState(0)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [projectCategories, setProjectCategories] = useState<Category[]>([])
    const [projectSides, setProjectSides] = useState<HitSide[]>([])
    const [projectType, setProjectType] = useState<ProjectType>(ProjectType.Mod)
    const [projectIndex, setProjectIndex] = useState<ProjectIndex | null>(ProjectIndex.Relevance)
    const [versionParts, setVersionParts] = useState({
        major: 0,
        minor: 0,
        patch: 0,
    })
    const { t } = useTranslation(['discover', 'commons'])
    const searchNumber = 32 // Número de proyectos por página

    const toggleCategory = (category: Category) => {
        setProjectCategories((current) => current.includes(category)
            ? current.filter((item) => item !== category)
            : [...current, category])
    }

    const toggleSide = (side: HitSide) => {
        setProjectSides((current) => current.includes(side)
            ? current.filter((item) => item !== side)
            : [...current, side])
    }

    const updateVersionPart = (part: keyof typeof versionParts, value: string) => {
        setVersionParts(prev => ({ ...prev, [part]: value }))
    }

    const clearFilters = () => {
        setProjectType(ProjectType.Mod)
        setProjectIndex(ProjectIndex.Relevance)
        setProjectCategories([])
        setProjectSides([])
        setVersionParts({ major: 0, minor: 0, patch: 0 })
    }

    const loadProjects = async () => {
        try {
            const facets: string[][] = []

            if (projectType) {
                facets.push([`project_type:${projectType}`])
            }

            if (projectCategories.length > 0) {
                facets.push(projectCategories.map((category) => `categories:${category}`))
            }

            const sideFacets: string[] = []
            if (projectSides.includes(HitSide.ClientSide)) sideFacets.push(`client_side:required`)
            if (projectSides.includes(HitSide.ServerSide)) sideFacets.push(`server_side:required`)
            if (sideFacets.length > 0) {
                facets.push(sideFacets)
            }

            if (
                versionParts.major > 0 && versionParts.minor >= 0 && versionParts.patch >= 0
            ) {
                facets.push([`versions:${versionParts.major}.${versionParts.minor}.${versionParts.patch}`])
            }

            const projects = await (window as any).backend.SearchProjects(
                searchQuery ?? undefined,
                facets.length > 0 ? facets : undefined,
                projectIndex ?? undefined,
                page * searchNumber,
                searchNumber
            )

            setProjects(projects.hits)
            setTotalProjects(projects.total_hits)
        } catch (error) {
            console.error("Error loading projects:", error)
        }
    }

    // Cargar proyectos al iniciar y cuando cambie la página
    useEffect(() => {
        loadProjects()
    }, [page])


    return (
        <section className="discover-container">
            <section className="header">
                <MCInput
                    placeholder={t('search_field_placeholder')}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}
                />
                <MCButton
                    onClick={() => {
                        setPage(0)
                        loadProjects()
                    }}
                >
                    {t('search_button')}
                </MCButton>
                <Dialog>
                    <DialogTrigger>
                        <MCButton>
                            Filtrar
                        </MCButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader sticky={true}>
                            <DialogTitle>Filtrar proyectos</DialogTitle>
                            <DialogDescription>
                                Elige uno o varios filtros para refinar los resultados.
                            </DialogDescription>
                        </DialogHeader>
                        <Separator />
                        <div className="filter-row">
                            <p className="filter-label">Sort by</p>
                            <div className="filter-button-group">
                                {Object.values(ProjectIndex).map((option) => (
                                    <MCButton
                                        key={option}
                                        variant={projectIndex === option ? "solid" : "ghost"}
                                        onClick={() => setProjectIndex(option)}
                                    >
                                        {option}
                                    </MCButton>
                                ))}
                            </div>
                        </div>

                        <div className="filter-grid">
                            <div className="filter-row">
                                <p className="filter-label">Types</p>
                                <div className="filter-button-group">
                                    {Object.values(ProjectType).map((option) => (
                                        <MCButton
                                            key={option}
                                            variant={projectType === option ? "solid" : "ghost"}
                                            onClick={() => setProjectType(option)}
                                        >
                                            {option}
                                        </MCButton>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-row">
                                <p className="filter-label">Categories</p>
                                <div className="filter-button-group filter-button-group-wrap">
                                    {Object.values(Category).map((option) => {
                                        const active = projectCategories.includes(option)
                                        return (
                                            <MCButton
                                                key={option}
                                                variant={active ? "solid" : "ghost"}
                                                onClick={() => toggleCategory(option)}
                                            >
                                                {option}
                                            </MCButton>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="filter-row">
                                <p className="filter-label">Sides</p>
                                <div className="filter-button-group">
                                    {Object.values(HitSide).map((option) => {
                                        const active = projectSides.includes(option)
                                        return (
                                            <MCButton
                                                key={option}
                                                variant={active ? "solid" : "ghost"}
                                                onClick={() => toggleSide(option)}
                                            >
                                                {option}
                                            </MCButton>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="version-row">
                                <p className="filter-label">Version</p>
                                <div className="filter-button-group">
                                    <MCInput
                                        type="number"
                                        variant={versionParts.major !== 0 ? "solid" : "ghost"}
                                        min={1}
                                        step={1}
                                        className="version-number-input"
                                        value={versionParts.major}
                                        onChange={(e) => updateVersionPart('major', e.target.value)}
                                    />
                                    <span className="version-separator">.</span>
                                    <MCInput
                                        type="number"
                                        variant={versionParts.minor !== 0 ? "solid" : "ghost"}
                                        min={0}
                                        step={1}
                                        className="version-number-input"
                                        value={versionParts.minor}
                                        onChange={(e) => updateVersionPart('minor', e.target.value)}
                                    />
                                    <span className="version-separator">.</span>
                                    <MCInput
                                        type="number"
                                        variant={versionParts.patch !== 0 ? "solid" : "ghost"}
                                        min={0}
                                        step={1}
                                        className="version-number-input"
                                        value={versionParts.patch}
                                        onChange={(e) => updateVersionPart('patch', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <MCButton variant="ghost" onClick={clearFilters}>
                                Limpiar
                            </MCButton>
                            <DialogClose>
                                <MCButton
                                >
                                    {t('actions.close', { ns: 'commons' })}
                                </MCButton>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="pagination">
                    <MCButton
                        variant="block"
                        onClick={() => {
                            if (page > 0) {
                                setPage((prevPage) => prevPage - 1)
                            }
                        }}
                        disabled={
                            page <= 0
                        }
                    >
                        (
                    </MCButton>

                    <MCButton
                        variant="block"
                        className="next-button"
                        onClick={() => {
                            if ((page + 1) * searchNumber < totalProjects) {
                                setPage((prevPage) => prevPage + 1)
                            }
                        }}
                        disabled={
                            (page + 1) * searchNumber >= totalProjects
                        }
                    >
                        )
                    </MCButton>
                    <div className="actual-page">
                        <p>{page + 1} / {Math.ceil(totalProjects / searchNumber)}</p>
                    </div>
                </div>
            </section>
            <section className="projects-list">
                {projects.map((project) => (
                    <a
                        key={project.project_id}
                        className="project item"
                        href={`https://modrinth.com/${project.project_type}/${project.slug || project.project_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div
                            className="project-image"
                            style={{ backgroundColor: `#${project.color ? project.color.toString().substring(0, 6) : "ffff"}` }}

                        >
                            {project.featured_gallery && (
                                <img
                                    src={project.featured_gallery}
                                    alt={project.title}
                                />
                            )}
                        </div>
                        <div className="project-info">
                            <div className="icon" >
                                <img
                                    src={project.icon_url || "https://example.com/default-icon.png"}
                                    alt={`${project.title} Icon`}
                                />
                            </div>
                            <div className="title">
                                <h3>{project.title}</h3>
                            </div>
                            <div className="description">
                                {project.description}
                            </div>

                            <div className="footer">
                                <div className="type">
                                    <p><strong>{project.project_type}</strong></p>
                                </div>
                                <div className="loader">
                                    <p><strong>{project.categories?.join(", ")}</strong> </p>
                                </div>
                                <div className="follows">
                                    <p><strong> {`${project.downloads ?? '?'} descargas | ${project.follows ?? '?'} seguidores`} </strong></p>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </section>
        </section>
    )

}

export default Discover