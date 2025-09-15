import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Session storage - options: 'localStorage', 'sessionStorage', 'cookies'
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    
    // Auto-refresh the session
    autoRefreshToken: true,
    
    // Persist session across browser restarts
    persistSession: true,
    
    // Detect session changes (e.g., user signs out in another tab)
    detectSessionInUrl: true,
    
    // Custom session configuration (optional)
    // You can customize these in your Supabase Dashboard → Authentication → Settings
    flowType: 'pkce', // More secure flow
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          location: string
          image_url: string | null
          is_available: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          location: string
          image_url?: string | null
          is_available?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          location?: string
          image_url?: string | null
          is_available?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          content: string
          rating: number
          user_id: string
          resource_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          rating: number
          user_id: string
          resource_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          rating?: number
          user_id?: string
          resource_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          value: number
          user_id: string
          resource_id: string
          created_at: string
        }
        Insert: {
          id?: string
          value: number
          user_id: string
          resource_id: string
          created_at?: string
        }
        Update: {
          id?: string
          value?: number
          user_id?: string
          resource_id?: string
          created_at?: string
        }
      }
    }
  }
}
