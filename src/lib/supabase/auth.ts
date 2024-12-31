import { toast } from '@/hooks/use-toast';
import { supabase } from './client';

export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Sign in error:', error);
    toast({
      title: 'Sign in failed',
      description: 'Please check your credentials and try again.',
      variant: 'destructive',
    });
    throw error;
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
): Promise<void> {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user data returned');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: authData.user.id, username }]);
  
    if (profileError) throw profileError;
  
  } catch (error) {
    console.error('Sign up error:', error);
    toast({
      title: 'Sign up failed',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    toast({
      title: 'Sign out failed',
      description: 'Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}