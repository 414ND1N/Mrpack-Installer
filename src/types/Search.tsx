import { Project } from "@/hooks/modrinth/ProjectType"

export interface Search {
    hits: Project[];
    offset: number;
    limit: number;
    total_hits: number;
}