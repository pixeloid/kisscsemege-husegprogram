import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  name: string;
  phone_number: string;
  pin_code: string;
  qr_code_url?: string;
  created_at: Date;
}

export interface Purchase {
  id: string;
  user_id: string;
  purchase_date: Date;
  total_amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  created_at: Date;
}

export interface UserLevel {
  id: string;
  user_id: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  updated_at: Date;
  created_at: Date;
}

export const LEVEL_DISCOUNTS = {
  bronze: 5,
  silver: 10,
  gold: 15,
  platinum: 20
} as const;

export async function registerUser(name: string, phoneNumber: string, pinCode: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          phone_number: phoneNumber,
          pin_code: pinCode,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function verifyUser(phoneNumber: string, pinCode: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('phone_number', phoneNumber)
      .eq('pin_code', pinCode)
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
}

export async function getUserLevel(userId: string): Promise<UserLevel | null> {
  try {
    const { data, error } = await supabase
      .from('user_levels')
      .select()
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as UserLevel;
  } catch (error) {
    console.error('Error fetching user level:', error);
    return null;
  }
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select()
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data as Purchase[];
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }
}