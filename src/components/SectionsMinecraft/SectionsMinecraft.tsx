import { useState, FC, ReactNode, memo} from "react";
import "./SectionsMinecraft.css";


interface SectionProps {
    id: string
    title: string
    content: ReactNode
}

const SectionsMinecraftComponent: FC<{ title: string, sections: SectionProps[] }> = ({ title, sections }) => {
    const [activeTab, setActiveTab] = useState(sections[0]?.id || "")

    return (
        <section className="sections-minecraft">
            <section className="navbar-minecraft">
                <div className="navbar-title">
                    <h1>{title}</h1>
                </div>
                <div className="navbar-actions">
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            className={activeTab === section.id ? "active" : ""}
                            onClick={() => setActiveTab(section.id)}
                        >
                            {section.title}
                        </a>
                    ))}
                </div>
            </section>
            <section className="container">
                {sections.map((section) => (
                    <section
                        key={section.id}
                        className={`section-${section.id.toLowerCase()} ${
                            activeTab === section.id ? "active" : ""
                        }`}
                    >
                        {section.content}
                    </section>
                ))}
            </section>
        </section>
    )
}

export default memo(SectionsMinecraftComponent)