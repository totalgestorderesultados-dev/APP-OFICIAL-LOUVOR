import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Member, Song, Schedule } from '@/types';

let supabaseClient: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check for valid URL and Key
    const isValidUrl = (url: string | undefined): url is string => {
      if (!url || url === 'undefined' || url === 'null' || url.trim() === '') return false;
      try {
        new URL(url);
        return url.startsWith('http');
      } catch {
        return false;
      }
    };

    const isValidKey = (key: string | undefined): key is string => {
      return !!(key && key !== 'undefined' && key !== 'null' && key.trim() !== '');
    };

    if (!isValidUrl(supabaseUrl)) {
      supabaseUrl = 'https://srnrfjcelesvobhvjfzi.supabase.co';
    }
    if (!isValidKey(supabaseAnonKey)) {
      supabaseAnonKey = 'sb_publishable_dX60htrGw_jTJ-Sej5MZJA_7Nxn2Iz9';
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

// --- MEMBERS ---
export const getMembers = async (): Promise<Member[]> => {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};
