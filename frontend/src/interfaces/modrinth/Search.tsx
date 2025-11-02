import { Project } from "@/interfaces/modrinth/Projects"

export interface Search {
    hits: Project[];
    offset: number;
    limit: number;
    total_hits: number;
}