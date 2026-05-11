import React from "react";
import "./SidebarMinecraft.css";
import { Link } from 'react-router-dom'

// Types
import { SidebarProps } from "../../interfaces/Sidebar";

const SidebarMinecraftComponent: React.FC<SidebarProps> = ({ Links, Version }) => {

    const renderLinks = (): JSX.Element[] => {
        return Object.keys(Links).map((key, index) => {
            const link = Links[key];
            return (
                <li 
                    key={index} 
                    className={`${link.active ? "active" : ""} ${link.footer ? "footer" : ""}`}
                    style={link.footer ? { marginTop: "auto" } : undefined}
                >
                    <Link to={key || "/"} className={`${link.subtitle?.trim() !== "" ? "multiline" : "singleline"}`}>
                        {link.icon && <img src={link.icon} alt={link.title} />}
                        <p>
                            <span className="title">{link.title}</span>
                            {link.subtitle && (
                                <>
                                    <br />
                                    <span className="subtitle">{link.subtitle}</span>
                                </>
                            )}
                        </p>
                    </Link>
                </li>
            );
        });
    }

    return (
        <section className="sidebar-component">
            <nav className={`sidebar`}>
                <ul className="sidebar-list">
                    {renderLinks()}
                </ul>
                <div className="version">
                    <p>v.{Version || "0.0.0"}</p>
                </div>
            </nav>
        </section>
    );
};

export default SidebarMinecraftComponent;