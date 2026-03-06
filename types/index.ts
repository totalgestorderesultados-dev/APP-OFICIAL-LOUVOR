export type Role =
  | "Ministro"
  | "Backvocal"
  | "Violão"
  | "Cajón"
  | "Contrabaixo"
  | "Mesa de som";

export type SongCategory = "Celebração" | "Exaltação" | "Adoração";

export interface Member {
  id: string;
  name: string;
  roles: Role[];
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  category: SongCategory;
  link?: string;
}

export interface Schedule {
  id: string;
  date: string; // ISO string
  eventName: string;
  eventType: string;
  minister: string; // Member ID
  backvocals: string[]; // Member IDs
  guitar: string; // Member ID
  cajon: string; // Member ID
  bass: string; // Member ID
  soundDesk: string; // Member ID
  songs: string[]; // Song IDs
  createdAt: string; // ISO string
}
