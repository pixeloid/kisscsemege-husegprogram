import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
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

export const PIN_PREFIX = 'PIN-';

export async function signUp(name: string, phoneNumber: string, pinCode: string) {
  try {
    // Generate a random email since Supabase requires one
    const randomEmail = `${Date.now()}-${Math.random().toString(36).substring(2)}@temp.com`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: randomEmail,
      password: `${PIN_PREFIX}${pinCode}`, // Using PIN code as password
      options: {
        data: {
          name,
          phone_number: phoneNumber,
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: authData.user.id,
          name,
          phone_number: phoneNumber,
        }]);

      if (profileError) throw profileError;
    }

    return authData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(phoneNumber: string, pinCode: string) {
  try {
    // First get the user's email by phone number
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('phone_number', phoneNumber)
      .single();

    if (profileError) throw profileError;

    // Then get the user's email
    const { data: authUser, error: userError } = await supabase
      .auth.admin.getUserById(profile.user_id);

    if (userError) throw userError;

    // Finally sign in with email and PIN code
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authUser.user.email!,
      password: `${PIN_PREFIX}${pinCode}`,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select()
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
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

export async function addPurchase(userId: string, totalAmount: number, items: Array<{ name: string, quantity: number, price: number }>) {
  try {
    const { error } = await supabase
      .from('purchases')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        items,
        purchase_date: new Date(),
        created_at: new Date()
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw error;
  }
}