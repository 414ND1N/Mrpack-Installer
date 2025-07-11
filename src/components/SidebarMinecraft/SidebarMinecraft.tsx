import { Component } from "react";
import "./SidebarMinecraft.css";
import { Link } from 'react-router-dom'

// Types
import { SidebarProps } from "../../types/Sidebar";

// Imagenes
import UserIconPeepo from "./peepo.png"

class SidebarMinecraftComponent extends Component<SidebarProps> {
    constructor(props: SidebarProps) {
        super(props);
    }

    renderLinks = (): JSX.Element[] => {
        const { Links } = this.props;
        return Object.keys(Links).map((key, index) => {
            const link = Links[key];
            return (
                <li 
                    key={index} 
                    className={`${link.active ? "active" : ""} ${link.footer ? "footer" : ""}`}
                    style={link.footer ? { marginTop: "auto" } : undefined}
                >
                    {/* <Link to="/Install">Instalar</Link> */}
                    <Link to={link.href || "/"} className={`${link.subtitle?.trim() !== "" ? "multiline" : "singleline"}`}>
                        {link.icon && <img src={link.icon} alt={key} />}
                        <p>
                            <span className="title">{key}</span>
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

    renderHeader = (): JSX.Element => {
        return(
            <li className="header">
                <a className="multiline">
                    <img src={UserIconPeepo} alt="Header" />
                    <p> 
                        <span>Bienvenido !!</span>
                        <br/>
                        <span>Pana fresco</span>
                    </p>
                </a>
            </li>
        )
    }

    render() {
        return (
            <section className="sidebar-component">
                <nav className={`sidebar`}>
                    <ul className="sidebar-header">
                        { this.renderHeader() }
                    </ul>
                    <ul className="sidebar-list">
                        {this.renderLinks()}
                    </ul>
                    <div className="version">
                        <p>v.{this.props.Version || "0.0.0"}</p>
                    </div>
                </nav>
            </section>
        );
    }
}

export default SidebarMinecraftComponent;