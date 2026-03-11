// lib/auth.ts - Updated with Microsoft OAuth and Magic Link support

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Existing functions (keep these)
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
}

export async function signInWithGoogle(redirectTo = '/dashboard') {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
    },
  })
}

// NEW: Microsoft OAuth
export async function signInWithMicrosoft(redirectTo = '/dashboard') {
  return await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback/microsoft?redirect=${redirectTo}`,
      scopes: 'email profile openid User.Read',
    },
  })
}

// NEW: Magic Link (Passwordless)
export async function sendMagicLink(email: string) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

// NEW: Sign in with magic token
export async function signInWithMagicToken(token: string) {
  return await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'magiclink',
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getSession() {
  return await supabase.auth.getSession()
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// NEW: Reset password
export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  })
}

// NEW: Update password
export async function updatePassword(newPassword: string) {
  return await supabase.auth.updateUser({
    password: newPassword,
  })
}
