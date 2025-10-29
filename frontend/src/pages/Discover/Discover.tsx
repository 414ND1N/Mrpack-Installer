// Componentes
import Sidebar from "@/pages/Sidebar"
import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { MCButton, MCInput, MCSelect } from "@/components/MC/MC"
// Css
import "./Discover.css"

// Hooks
import { searchProjects } from "@/hooks/modrinth/api"

// Types
import { Hit } from "@/interfaces/Hit"

function Discover() {

    // Obtener projectos random
    const [projects, setProjects] = useState<Hit[]>([])
    const [page, setPage] = useState(0)
    const [totalProjects, setTotalProjects] = useState(0)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [projectType, setProjectType] = useState<string>("")
    const { t } = useTranslation(['discover', 'commons'])
    const searchNumber = 32 // Número de proyectos por página

    const loadProjects = async () => {
        try {
            const projects = await searchProjects(searchNumber, projectType ?? undefined, searchQuery ?? undefined, page * searchNumber)
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
        <main className="main-container">
            <Sidebar current_path="/Discover" />
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
                    <MCSelect
                        onChange={(e) => {
                            setProjectType(e.target.value)
                        }}
                    >
                        <option value="">{t('filters_list.all')}</option>
                        <option value="modpack">{t('filters_list.modpack')}</option>
                        <option value="mod">{t('filters_list.mod')}</option>
                        <option value="resourcepack">{t('filters_list.resourcepack')}</option>
                        <option value="shader">{t('filters_list.shader')}</option>
                    </MCSelect>

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
        </main>
    )

}

export default Discover