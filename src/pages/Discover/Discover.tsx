// Componentes
import Sidebar from "@/pages/Sidebar"
import { useState, useEffect } from "react"

// Css
import "./Discover.css"

// Hooks
import { searchProjects } from "@/hooks/modrinth/api"

// Types
import { Hit } from "@/types/Hit"

function Discover() {

    // Obtener projectos random
    const [projects, setProjects] = useState<Hit[]>([])
    const [page, setPage] = useState(0)
    const [totalProjects, setTotalProjects] = useState(0)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [projectType, setProjectType] = useState<string>("")

    const loadProjects = async () => {
        try {
            const projects = await searchProjects(30, projectType ? projectType : undefined, searchQuery ? searchQuery : undefined, page * 30)
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
            <Sidebar current_path="/Discover"/>
            <section className="discover-container">
                <section className="header">
                    <input type="text" className="minecraft" placeholder="Nombre de proyecto"
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                        }}
                    />
                    <button className="minecraft"
                        onClick={() => {
                            setPage(0)
                            loadProjects()
                        }}
                    >
                        Buscar
                    </button>
                    <select name="" id="" className="minecraft"
                        onChange={(e) => {
                            setProjectType(e.target.value)
                        }}
                    >
                        <option value="">Todas</option>
                        <option value="modpack">Modpack</option>
                        <option value="mod">Mod</option>
                        <option value="resourcepack">Resource Pack</option>
                        <option value="shader">Shader</option>
                    </select>

                    <div className="pagination">
                        <button
                            className="minecraft back-button block"
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
                        </button>
                        <button
                            className="minecraft next-button block"
                            onClick={() => {
                                if ((page + 1) * 30 < totalProjects) {
                                    setPage((prevPage) => prevPage + 1)
                                }
                            }}
                            disabled={
                                (page + 1) * 30 >= totalProjects
                            }
                        >
                            )
                        </button>
                        <div className="actual-page">
                            <p>{page + 1} / {Math.ceil(totalProjects / 30)}</p>
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
                <section className="footer">
                    <div className="pagination">
                        <button
                            className="minecraft back-button block"
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
                        </button>
                        <button
                            className="minecraft next-button block"
                            onClick={() => {
                                if ((page + 1) * 30 < totalProjects) {
                                    setPage((prevPage) => prevPage + 1)
                                }
                            }}
                            disabled={
                                (page + 1) * 30 >= totalProjects
                            }
                        >
                            )
                        </button>
                        <div className="actual-page">
                            <p>{page + 1} / {Math.ceil(totalProjects / 30)}</p>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )

}

export default Discover