import { Project } from "@/interfaces/Projects"

export interface Search {
    hits: Project[];
    offset: number;
    limit: number;
    total_hits: number;
}