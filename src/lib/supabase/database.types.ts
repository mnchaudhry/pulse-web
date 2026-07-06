// Hand-authored to match supabase/migrations/*.sql. Regenerate with
//   supabase gen types typescript --linked > src/lib/supabase/database.types.ts
// after any schema change, then copy into pulse-extension (tech-stack §5).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          home_timezone: string
          notif_chrome: boolean
          notif_email_daily: boolean
          notif_email_weekly: boolean
          disclosure_confirmed_at: string | null
          tour_completed_at: string | null
          first_data_seen_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          home_timezone?: string
          notif_chrome?: boolean
          notif_email_daily?: boolean
          notif_email_weekly?: boolean
          disclosure_confirmed_at?: string | null
          tour_completed_at?: string | null
          first_data_seen_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: []
      }
      devices: {
        Row: {
          id: string
          user_id: string
          client_id: string
          label: string
          platform: string | null
          is_paused: boolean
          renamed: boolean
          last_synced_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          label: string
          platform?: string | null
          is_paused?: boolean
          renamed?: boolean
          last_synced_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['devices']['Insert']>
        Relationships: []
      }
      raw_events: {
        Row: {
          id: string
          user_id: string
          device_id: string
          url: string
          domain: string
          title: string | null
          referrer_domain: string | null
          category: string
          started_at: string
          ended_at: string
          active_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id: string
          url: string
          domain: string
          title?: string | null
          referrer_domain?: string | null
          category?: string
          started_at: string
          ended_at: string
          active_seconds?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['raw_events']['Insert']>
        Relationships: []
      }
      exclude_rules: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          pattern: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          pattern: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['exclude_rules']['Insert']>
        Relationships: []
      }
      category_overrides: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          domain: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          domain: string
          category: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['category_overrides']['Insert']>
        Relationships: []
      }
      daily_aggregates: {
        Row: {
          id: string
          user_id: string
          device_id: string
          day: string
          category: string
          active_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id: string
          day: string
          category: string
          active_seconds?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['daily_aggregates']['Insert']>
        Relationships: []
      }
      insights: {
        Row: {
          id: string
          user_id: string
          device_id: string | null
          kind: string
          title: string
          body: string
          payload: Json
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          device_id?: string | null
          kind: string
          title: string
          body: string
          payload?: Json
          created_at?: string
          read_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['insights']['Insert']>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type UserRow = Database['public']['Tables']['users']['Row']
export type DeviceRow = Database['public']['Tables']['devices']['Row']
export type RawEventRow = Database['public']['Tables']['raw_events']['Row']
export type ExcludeRuleRow = Database['public']['Tables']['exclude_rules']['Row']
export type CategoryOverrideRow = Database['public']['Tables']['category_overrides']['Row']
export type DailyAggregateRow = Database['public']['Tables']['daily_aggregates']['Row']
export type InsightRow = Database['public']['Tables']['insights']['Row']
