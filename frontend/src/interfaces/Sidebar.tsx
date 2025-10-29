export interface SidebarLink {
    href?: string;
    icon?: string;
    title?: string;
    subtitle?: string;
    active?: boolean;
    footer?: boolean;
}

export interface SidebarProps {
    Tittle?: string;
    Links: Record<string, SidebarLink>;
    Version?: string;
}
