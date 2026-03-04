import { v4 as uuidv4 } from "uuid";
import { Member, Song, Schedule } from "@/types";

// Helper to delay the response slightly to simulate network
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorage = <T>(key: string, value: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// --- MEMBERS ---
export const getMembers = async (): Promise<Member[]> => {
  await delay(200);
  return getStorage<Member>("lvc_members", []);
};

export const addMember = async (
  member: Omit<Member, "id">,
): Promise<Member> => {
  await delay(300);
  const members = await getMembers();
  const newMember = { ...member, id: uuidv4() };
  setStorage("lvc_members", [...members, newMember]);
  return newMember;
};

export const updateMember = async (
  id: string,
  updates: Partial<Member>,
): Promise<Member> => {
  await delay(300);
  const members = await getMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Member not found");
  const updatedMember = { ...members[index], ...updates };
  members[index] = updatedMember;
  setStorage("lvc_members", members);
  return updatedMember;
};

export const deleteMember = async (id: string): Promise<void> => {
  await delay(300);
  const members = await getMembers();
  setStorage(
    "lvc_members",
    members.filter((m) => m.id !== id),
  );
};

// --- SONGS ---
export const getSongs = async (): Promise<Song[]> => {
  await delay(200);
  return getStorage<Song>("lvc_songs", []);
};

export const addSong = async (song: Omit<Song, "id">): Promise<Song> => {
  await delay(300);
  const songs = await getSongs();
  const newSong = { ...song, id: uuidv4() };
  setStorage("lvc_songs", [...songs, newSong]);
  return newSong;
};

export const updateSong = async (
  id: string,
  updates: Partial<Song>,
): Promise<Song> => {
  await delay(300);
  const songs = await getSongs();
  const index = songs.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Song not found");
  const updatedSong = { ...songs[index], ...updates };
  songs[index] = updatedSong;
  setStorage("lvc_songs", songs);
  return updatedSong;
};

export const deleteSong = async (id: string): Promise<void> => {
  await delay(300);
  const songs = await getSongs();
  setStorage(
    "lvc_songs",
    songs.filter((s) => s.id !== id),
  );
};

// --- SCHEDULES ---
export const getSchedules = async (): Promise<Schedule[]> => {
  await delay(200);
  return getStorage<Schedule>("lvc_schedules", []);
};

export const addSchedule = async (
  schedule: Omit<Schedule, "id" | "createdAt">,
): Promise<Schedule> => {
  await delay(300);
  const schedules = await getSchedules();
  const newSchedule = {
    ...schedule,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  setStorage("lvc_schedules", [...schedules, newSchedule]);
  return newSchedule;
};

export const updateSchedule = async (
  id: string,
  updates: Partial<Schedule>,
): Promise<Schedule> => {
  await delay(300);
  const schedules = await getSchedules();
  const index = schedules.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Schedule not found");
  const updatedSchedule = { ...schedules[index], ...updates };
  schedules[index] = updatedSchedule;
  setStorage("lvc_schedules", schedules);
  return updatedSchedule;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await delay(300);
  const schedules = await getSchedules();
  setStorage(
    "lvc_schedules",
    schedules.filter((s) => s.id !== id),
  );
};
