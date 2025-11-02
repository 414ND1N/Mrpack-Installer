import React from "react";
import "./SidebarMinecraft.css";
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Types
import { SidebarProps } from "../../interfaces/Sidebar";

// Imagenes
import UserIconPeepo from "./peepo.png"

const SidebarMinecraftComponent: React.FC<SidebarProps> = ({ Links, Version }) => {
    const { t } = useTranslation(['menu']);

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
    };

    const renderHeader = (): JSX.Element => {
        return (
            <li className="header">
                <a className="multiline">
                    <img src={UserIconPeepo} alt="Header" />
                    <p> 
                        <span>{t('sidebar.header.title')}</span>
                        <br/>
                        <span>{t('sidebar.header.subtitle')}</span>
                    </p>
                </a>
            </li>
        );
    };

    return (
        <section className="sidebar-component">
            <nav className={`sidebar`}>
                <ul className="sidebar-header">
                    {renderHeader()}
                </ul>
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