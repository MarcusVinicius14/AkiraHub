export interface Work {
  id: number;
  type: "anime" | "manga";
  title: string;
  synopsis: string;
  genres: string[];
  themes: string[];
  demographic: string | null;
  year: number | null;
  mal_id?: number | null;
  image?: string | null;
}

export type UserTypeFilter = "anime" | "manga" | null;
