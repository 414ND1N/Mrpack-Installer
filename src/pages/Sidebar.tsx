import { memo, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
// Componentes
import SidebarMinecraftComponent from '@/components/SidebarMinecraft/SidebarMinecraft'

// Iconos
import HomeIcon from '@/icons/home.svg'
import CraftingIcon from '@/icons/crafting_icon.png'
import AnvilIcon from '@/icons/anvil_icon.png'
import TuneIcon from '@/icons/tune.svg'

// Types
import { SidebarLink  } from "@/types/Sidebar";

function Sidebar({ current_path = "/" }: { current_path?: string }) {

    const [version, setVersion] = useState<string>("N/A")

    useEffect(() => {
        // Obtener la versión de la aplicación al cargar el componente
        const getVersion = async () => {
            const appVersion = await ipcRenderer.invoke('get-version');
            setVersion(appVersion);
        }
        getVersion()
    }, []);

    // Definicion de los enlaces del sidebar
    let SidebarLinks: Record<string, SidebarLink> = {
        "NOTICIAS": {
            href: `/`,
            icon: HomeIcon,
            subtitle: "Minecraft",
        },
        "DESCUBRIR": {
            href: `/Discover`,
            icon: CraftingIcon,
            subtitle: "Proyectos",
        },
        "INSTALAR": {
            href: `/Install`,
            icon: AnvilIcon,
            subtitle: "Mrpacks",
        }
        ,"CONFIGURACIÓN": {
            href: `/Settings`,
            icon: TuneIcon,
            footer: true
        }
    }

    Object.keys(SidebarLinks).forEach(key => {
        if (SidebarLinks[key].href === current_path) {
            SidebarLinks[key].active = true;
        } else {
            SidebarLinks[key].active = false;
        }
    })

    return (
        <SidebarMinecraftComponent
            Links={SidebarLinks}
            Version={version}
        />
    )

}

export default memo(Sidebar)