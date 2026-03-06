import { createClient } from '@supabase/supabase-js';
import { Member, Song, Schedule } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MEMBERS ---
export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
};

export const addMember = async (member: Omit<Member, 'id'>): Promise<Member> => {
  const { data, error } = await supabase
    .from('members')
    .insert([member])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding member:', error);
    throw error;
  }
  return data;
};

export const updateMember = async (id: string, updates: Partial<Member>): Promise<Member> => {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating member:', error);
    throw error;
  }
  return data;
};

export const deleteMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

// --- SONGS ---
export const getSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
  return data || [];
};

export const addSong = async (song: Omit<Song, 'id'>): Promise<Song> => {
  const { data, error } = await supabase
    .from('songs')
    .insert([song])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding song:', error);
    throw error;
  }
  return data;
};

export const updateSong = async (id: string, updates: Partial<Song>): Promise<Song> => {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating song:', error);
    throw error;
  }
  return data;
};

export const deleteSong = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
};

// --- SCHEDULES ---
export const getSchedules = async (): Promise<Schedule[]> => {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
  return data || [];
};

export const addSchedule = async (schedule: Omit<Schedule, 'id' | 'createdAt'>): Promise<Schedule> => {
  const { data, error } = await supabase
    .from('schedules')
    .insert([schedule])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding schedule:', error);
    throw error;
  }
  return data;
};

export const updateSchedule = async (id: string, updates: Partial<Schedule>): Promise<Schedule> => {
  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
  return data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};
