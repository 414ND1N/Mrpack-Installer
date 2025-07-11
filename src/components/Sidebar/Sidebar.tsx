import React, { Component } from "react";
import "./Sidebar.css";
import ArrowLeftIcon from "./arrow_left.svg";
import ArrowIcon from "./arrow.svg";

interface Link {
    type: "dropdown" | "link";
    icon?: string;
    href?: string;
    active?: boolean;
    [key: string]: any;
}

interface SidebarProps {
    Tittle?: string;
    ExitUrl?: string;
    Icon?: string;
    Links: Record<string, Link>;
}


class SidebarComponent extends Component<SidebarProps> {
    constructor(props: SidebarProps) {
        super(props);
    }

    handleToggleSidebar = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const sidebar = e.currentTarget.closest(".sidebar");
        if (sidebar) {
            sidebar.classList.toggle("collapsed");
            e.currentTarget.classList.toggle("rotate");
            Array.from(sidebar.querySelectorAll(".submenu.show")).forEach((submenu) => {
                submenu.classList.remove("show");
                submenu.previousElementSibling?.classList.remove("rotate");
            })
        }
    }

    handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const sidebar = e.currentTarget.closest(".sidebar");
        const submenu = e.currentTarget.nextElementSibling as HTMLElement;

        if (sidebar && submenu) {
            Array.from(sidebar.querySelectorAll(".submenu.show")).forEach((openSubmenu) => {
                if (openSubmenu !== submenu) {
                    openSubmenu.classList.remove("show")
                    openSubmenu.previousElementSibling?.classList.remove("rotate")
                }
            })

            submenu.classList.toggle("show")
            e.currentTarget.classList.toggle("rotate")

            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed")
                const toggleBtn = sidebar.querySelector(".toggle-btn")
                toggleBtn?.classList.remove("rotate")
            }
        }
    }

    renderLinks = (): JSX.Element[] => {
        const { Links } = this.props
        return Object.keys(Links).map((key, index) => {
            const link = Links[key]
            return (
                <li key={index} className={link.active ? "active" : ""}>
                    {link.type === "dropdown" ? (
                        <>
                            <button className="dropdown-btn" onClick={this.handleDropdownToggle}>
                                {link.icon && <img src={link.icon} alt={key} />}
                                <span><strong>{key}</strong></span>
                                <img src={ArrowIcon} alt="Expand" className="expand-list" />
                            </button>
                            <ul className="submenu">
                                <div>
                                    {Object.keys(link)
                                        .filter((subKey) => !["type", "icon", "active"].includes(subKey))
                                        .map((subKey, subIndex) => (
                                            <li key={subIndex}>
                                                <a href={link[subKey].href}>{subKey}</a>
                                            </li>
                                        ))}
                                </div>
                            </ul>
                        </>
                    ) : (
                        <a href={link.href}>
                            {link.icon && <img src={link.icon} alt={key} />}
                            <span><strong>{key}</strong></span>
                        </a>
                    )}
                </li>
            );
        });
    };

    render() {
        const { Tittle, Icon } = this.props;

        return (
            <section className="sidebar-component">
                <nav className={'sidebar'}>
                    <ul className="sidebar-list">
                        <li className="header">
                            {Icon ? (
                                <div className="header-content">
                                    <img src={Icon} alt="Logo" />
                                </div>
                            ) : Tittle ? (
                                <span className="header-content">
                                    <strong>{Tittle}</strong>
                                </span>
                            ) : null}
                            <button className="toggle-btn" onClick={this.handleToggleSidebar}>
                                <img src={ArrowLeftIcon} alt="Toggle Sidebar" />
                            </button>
                        </li>
                        {this.renderLinks()}
                    </ul>
                </nav>
            </section>
        );
    }
}

export default SidebarComponent;