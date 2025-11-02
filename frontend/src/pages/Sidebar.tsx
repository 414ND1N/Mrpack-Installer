import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Componentes
import SidebarMinecraftComponent from '@/components/SidebarMinecraft/SidebarMinecraft'

// Iconos
import HomeIcon from '@/icons/home.svg'
import CraftingIcon from '@/icons/crafting_icon.png'
import AnvilIcon from '@/icons/anvil_icon.png'
import TuneIcon from '@/icons/tune.svg'

// Types
import { SidebarLink  } from "@/interfaces/Sidebar";

function Sidebar({ current_path = "/" }: { current_path?: string }) {

    const [version, setVersion] = useState<string>("N/A")
    const { t } = useTranslation(['menu'])
    
    useEffect(() => {
        // Obtener la versión de la aplicación al cargar el componente
        const getVersion = async () => {
            const appVersion = await (window as any).winConfig?.getVersion()
            console.log("win config:", (window as any).winConfig)
            console.log("App version:", appVersion)
            setVersion(appVersion)
        }
        getVersion()
    }, [])

    // Definicion de los enlaces del sidebar
    let SidebarLinks: Record<string, SidebarLink> = {
        "/": {
            title: t('sidebar.views.news.title'),
            subtitle: t('sidebar.views.news.subtitle'),
            icon: HomeIcon,
        },
        "/Discover": {
            title: t('sidebar.views.discover.title'),
            subtitle: t('sidebar.views.discover.subtitle'),
            icon: CraftingIcon,
        },
        "/Install": {
            title: t('sidebar.views.install.title'),
            subtitle: t('sidebar.views.install.subtitle'),
            icon: AnvilIcon,
        }
        ,"/Settings": {
            title: t('sidebar.views.settings.title'),
            icon: TuneIcon,
            footer: true
        }
    }

    Object.keys(SidebarLinks).forEach(key => {
        if (key === current_path) {
            SidebarLinks[key].active = true
        } else {
            SidebarLinks[key].active = false
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