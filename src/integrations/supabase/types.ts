export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ad_events: {
        Row: {
          created_at: string
          id: number
          purpose: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          purpose: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          purpose?: string
          user_id?: number
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          role?: string
          username: string
        }
        Update: {
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      clau_ad_views: {
        Row: {
          completed_at: string | null
          id: string
          placement: string
          started_at: string
          tg_id: number
          used_at: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          placement: string
          started_at?: string
          tg_id: number
          used_at?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          placement?: string
          started_at?: string
          tg_id?: number
          used_at?: string | null
        }
        Relationships: []
      }
      clau_admins: {
        Row: {
          added_by: string | null
          created_at: string
          id: string
          role: string
          tg_id: number | null
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: string
          role?: string
          tg_id?: number | null
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: string
          role?: string
          tg_id?: number | null
          username?: string
        }
        Relationships: []
      }
      clau_bonus_offers: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          source: string
          tg_id: number
          used_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string
          id?: string
          source: string
          tg_id: number
          used_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          source?: string
          tg_id?: number
          used_at?: string | null
        }
        Relationships: []
      }
      clau_broadcasts: {
        Row: {
          created_at: string
          cursor: number
          done: boolean
          failed: number
          gift_id: string | null
          id: string
          key: string
          kind: string
          locked_until: string | null
          photo_url: string | null
          sent: number
          text: string
        }
        Insert: {
          created_at?: string
          cursor?: number
          done?: boolean
          failed?: number
          gift_id?: string | null
          id?: string
          key: string
          kind?: string
          locked_until?: string | null
          photo_url?: string | null
          sent?: number
          text: string
        }
        Update: {
          created_at?: string
          cursor?: number
          done?: boolean
          failed?: number
          gift_id?: string | null
          id?: string
          key?: string
          kind?: string
          locked_until?: string | null
          photo_url?: string | null
          sent?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "clau_broadcasts_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "clau_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      clau_game_sessions: {
        Row: {
          finished_at: string | null
          game: string
          id: string
          reward: number | null
          score: number | null
          started_at: string
          tg_id: number
        }
        Insert: {
          finished_at?: string | null
          game: string
          id?: string
          reward?: number | null
          score?: number | null
          started_at?: string
          tg_id: number
        }
        Update: {
          finished_at?: string | null
          game?: string
          id?: string
          reward?: number | null
          score?: number | null
          started_at?: string
          tg_id?: number
        }
        Relationships: []
      }
      clau_gift_claims: {
        Row: {
          created_at: string
          gift_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          gift_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          gift_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clau_gift_claims_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "clau_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      clau_gifts: {
        Row: {
          amount: number
          claims: number
          created_at: string
          expires_at: string
          id: string
          max_claims: number | null
          title: string
        }
        Insert: {
          amount: number
          claims?: number
          created_at?: string
          expires_at?: string
          id?: string
          max_claims?: number | null
          title?: string
        }
        Update: {
          amount?: number
          claims?: number
          created_at?: string
          expires_at?: string
          id?: string
          max_claims?: number | null
          title?: string
        }
        Relationships: []
      }
      clau_jobs: {
        Row: {
          key: string
          last_run_at: string
        }
        Insert: {
          key: string
          last_run_at?: string
        }
        Update: {
          key?: string
          last_run_at?: string
        }
        Relationships: []
      }
      clau_news: {
        Row: {
          id: string
          message_id: number | null
          posted_at: string
          slot: string
          text: string
        }
        Insert: {
          id?: string
          message_id?: number | null
          posted_at?: string
          slot: string
          text: string
        }
        Update: {
          id?: string
          message_id?: number | null
          posted_at?: string
          slot?: string
          text?: string
        }
        Relationships: []
      }
      clau_payments: {
        Row: {
          amount_nano: number
          confirmed_at: string | null
          created_at: string
          expires_at: string
          id: string
          kind: string
          memo: string
          ref_id: string | null
          result: Json | null
          sender: string | null
          status: string
          tg_id: number
          tx_hash: string | null
        }
        Insert: {
          amount_nano: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          kind?: string
          memo: string
          ref_id?: string | null
          result?: Json | null
          sender?: string | null
          status?: string
          tg_id: number
          tx_hash?: string | null
        }
        Update: {
          amount_nano?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          kind?: string
          memo?: string
          ref_id?: string | null
          result?: Json | null
          sender?: string | null
          status?: string
          tg_id?: number
          tx_hash?: string | null
        }
        Relationships: []
      }
      clau_servers: {
        Row: {
          active: boolean
          created_at: string
          duration_days: number
          hue: number
          id: string
          name: string
          price_ton: number
          rate_per_hour: number
          slug: string
          sort: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          duration_days?: number
          hue?: number
          id?: string
          name: string
          price_ton: number
          rate_per_hour: number
          slug: string
          sort?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          duration_days?: number
          hue?: number
          id?: string
          name?: string
          price_ton?: number
          rate_per_hour?: number
          slug?: string
          sort?: number
        }
        Relationships: []
      }
      clau_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      clau_task_claims: {
        Row: {
          claimed_at: string | null
          started_at: string
          status: string
          task_id: string
          tg_id: number
        }
        Insert: {
          claimed_at?: string | null
          started_at?: string
          status?: string
          task_id: string
          tg_id: number
        }
        Update: {
          claimed_at?: string | null
          started_at?: string
          status?: string
          task_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clau_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "clau_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      clau_tasks: {
        Row: {
          active: boolean
          chat_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      clau_user_servers: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          payment_id: string | null
          rate_per_hour: number
          server_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          payment_id?: string | null
          rate_per_hour: number
          server_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          payment_id?: string | null
          rate_per_hour?: number
          server_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clau_user_servers_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "clau_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clau_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "clau_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      clau_users: {
        Row: {
          ads_date: string | null
          ads_today: number
          ads_total: number
          balance: number
          bonus_date: string | null
          boost_from: string | null
          boost_until: string | null
          boosts_today: number
          bot_blocked: boolean
          boxes_today: number
          created_at: string
          doubles_today: number
          first_name: string | null
          free_spin_used: boolean
          games_date: string | null
          games_today: number
          games_total: number
          is_banned: boolean
          last_ad_at: string | null
          last_seen: string
          mining_ends_at: string | null
          mining_last_tick: string | null
          mining_pending: number
          mining_rate: number
          mining_started_at: string | null
          photo_url: string | null
          ref_count: number
          ref_earned: number
          referrer_id: number | null
          spins_today: number
          started_bot: boolean
          streak: number
          streak_date: string | null
          streak_lost: number
          streak_lost_at: string | null
          tg_id: number
          total_mined: number
          username: string | null
          vip_until: string | null
          wallet_address: string | null
        }
        Insert: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bonus_date?: string | null
          boost_from?: string | null
          boost_until?: string | null
          boosts_today?: number
          bot_blocked?: boolean
          boxes_today?: number
          created_at?: string
          doubles_today?: number
          first_name?: string | null
          free_spin_used?: boolean
          games_date?: string | null
          games_today?: number
          games_total?: number
          is_banned?: boolean
          last_ad_at?: string | null
          last_seen?: string
          mining_ends_at?: string | null
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          spins_today?: number
          started_bot?: boolean
          streak?: number
          streak_date?: string | null
          streak_lost?: number
          streak_lost_at?: string | null
          tg_id: number
          total_mined?: number
          username?: string | null
          vip_until?: string | null
          wallet_address?: string | null
        }
        Update: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bonus_date?: string | null
          boost_from?: string | null
          boost_until?: string | null
          boosts_today?: number
          bot_blocked?: boolean
          boxes_today?: number
          created_at?: string
          doubles_today?: number
          first_name?: string | null
          free_spin_used?: boolean
          games_date?: string | null
          games_today?: number
          games_total?: number
          is_banned?: boolean
          last_ad_at?: string | null
          last_seen?: string
          mining_ends_at?: string | null
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          spins_today?: number
          started_bot?: boolean
          streak?: number
          streak_date?: string | null
          streak_lost?: number
          streak_lost_at?: string | null
          tg_id?: number
          total_mined?: number
          username?: string | null
          vip_until?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      clau_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          id: string
          note: string | null
          processed_at: string | null
          processed_by: string | null
          status: string
          tg_id: number
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          tg_id: number
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          tg_id?: number
        }
        Relationships: []
      }
      gama_ad_views: {
        Row: {
          created_at: string
          id: number
          purpose: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          purpose: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          purpose?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_admins: {
        Row: {
          added_by: string | null
          created_at: string
          role: string
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          role?: string
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      gama_game_sessions: {
        Row: {
          finished: boolean
          game: string
          id: string
          reward: number
          score: number
          started_at: string
          user_id: number
        }
        Insert: {
          finished?: boolean
          game: string
          id?: string
          reward?: number
          score?: number
          started_at?: string
          user_id: number
        }
        Update: {
          finished?: boolean
          game?: string
          id?: string
          reward?: number
          score?: number
          started_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_gifts: {
        Row: {
          amount: number
          claimed: boolean
          claimed_at: string | null
          created_at: string
          expires_at: string
          id: string
          user_id: number
        }
        Insert: {
          amount: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          user_id: number
        }
        Update: {
          amount?: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_gifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_jobs: {
        Row: {
          created_at: string
          cursor: number
          done: boolean
          key: string
          sent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cursor?: number
          done?: boolean
          key: string
          sent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cursor?: number
          done?: boolean
          key?: string
          sent?: number
          updated_at?: string
        }
        Relationships: []
      }
      gama_news: {
        Row: {
          body: string
          created_at: string
          id: string
          message_id: number | null
          slot: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          message_id?: number | null
          slot: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          message_id?: number | null
          slot?: string
        }
        Relationships: []
      }
      gama_payments: {
        Row: {
          amount_nano: number
          confirmed_at: string | null
          created_at: string
          expires_at: string
          id: string
          kind: string
          memo: string
          ref_id: string | null
          status: string
          tx_hash: string | null
          user_id: number
          wallet: string | null
        }
        Insert: {
          amount_nano: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          kind?: string
          memo: string
          ref_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id: number
          wallet?: string | null
        }
        Update: {
          amount_nano?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          kind?: string
          memo?: string
          ref_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id?: number
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gama_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_post_pipeline: {
        Row: {
          created_at: string
          key: string
          lease_until: string | null
          paused_reason: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          key: string
          lease_until?: string | null
          paused_reason?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          key?: string
          lease_until?: string | null
          paused_reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gama_servers: {
        Row: {
          active: boolean
          created_at: string
          duration_days: number
          id: string
          name: string
          price_ton: number
          rate_per_hour: number
          slug: string
          sort: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          duration_days?: number
          id?: string
          name: string
          price_ton: number
          rate_per_hour: number
          slug: string
          sort?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          duration_days?: number
          id?: string
          name?: string
          price_ton?: number
          rate_per_hour?: number
          slug?: string
          sort?: number
        }
        Relationships: []
      }
      gama_task_claims: {
        Row: {
          created_at: string
          task_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "gama_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gama_task_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_tasks: {
        Row: {
          active: boolean
          chat_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          reward: number
          sort?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      gama_user_servers: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          payment_id: string | null
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          payment_id?: string | null
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          payment_id?: string | null
          rate_per_hour?: number
          server_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "gama_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gama_user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gama_users: {
        Row: {
          ads_date: string | null
          ads_today: number
          ads_total: number
          balance: number
          bot_blocked: boolean
          created_at: string
          first_name: string | null
          games_date: string | null
          games_today: number
          games_total: number
          is_banned: boolean
          last_ad_at: string | null
          last_seen: string
          mining_last_tick: string | null
          mining_pending: number
          mining_rate: number
          mining_started_at: string | null
          photo_url: string | null
          ref_count: number
          ref_earned: number
          referrer_id: number | null
          session_boosts: number
          started_bot: boolean
          tg_id: number
          total_mined: number
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bot_blocked?: boolean
          created_at?: string
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          games_total?: number
          is_banned?: boolean
          last_ad_at?: string | null
          last_seen?: string
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          session_boosts?: number
          started_bot?: boolean
          tg_id: number
          total_mined?: number
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bot_blocked?: boolean
          created_at?: string
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          games_total?: number
          is_banned?: boolean
          last_ad_at?: string | null
          last_seen?: string
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          session_boosts?: number
          started_bot?: boolean
          tg_id?: number
          total_mined?: number
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      gama_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          id: string
          note: string | null
          processed_at: string | null
          status: string
          user_id: number
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id: number
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gama_withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gama_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          finished: boolean
          game: string
          id: string
          reward: number
          started_at: string
          user_id: number
        }
        Insert: {
          finished?: boolean
          game: string
          id?: string
          reward?: number
          started_at?: string
          user_id: number
        }
        Update: {
          finished?: boolean
          game?: string
          id?: string
          reward?: number
          started_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      gifts: {
        Row: {
          amount: number
          claimed: boolean
          claimed_at: string | null
          created_at: string
          id: string
          user_id: number
        }
        Insert: {
          amount: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          id?: string
          user_id: number
        }
        Update: {
          amount?: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      hm27_ad_views: {
        Row: {
          created_at: string
          id: string
          reward: number
          tg_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          reward?: number
          tg_id: number
        }
        Update: {
          created_at?: string
          id?: string
          reward?: number
          tg_id?: number
        }
        Relationships: []
      }
      hm27_game_plays: {
        Row: {
          created_at: string
          game: string
          id: string
          reward: number
          tg_id: number
        }
        Insert: {
          created_at?: string
          game: string
          id?: string
          reward: number
          tg_id: number
        }
        Update: {
          created_at?: string
          game?: string
          id?: string
          reward?: number
          tg_id?: number
        }
        Relationships: []
      }
      hm27_gifts: {
        Row: {
          amount: number
          claimed: boolean
          created_at: string
          id: string
          tg_id: number
        }
        Insert: {
          amount: number
          claimed?: boolean
          created_at?: string
          id?: string
          tg_id: number
        }
        Update: {
          amount?: number
          claimed?: boolean
          created_at?: string
          id?: string
          tg_id?: number
        }
        Relationships: []
      }
      hm27_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          memo: string
          server_id: string
          status: string
          tg_id: number
          tx_hash: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          memo: string
          server_id: string
          status?: string
          tg_id: number
          tx_hash?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          memo?: string
          server_id?: string
          status?: string
          tg_id?: number
          tx_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hm27_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      hm27_servers: {
        Row: {
          id: string
          image: string
          name: string
          price_ton: number
          rate: number
          sort: number
        }
        Insert: {
          id: string
          image: string
          name: string
          price_ton: number
          rate: number
          sort?: number
        }
        Update: {
          id?: string
          image?: string
          name?: string
          price_ton?: number
          rate?: number
          sort?: number
        }
        Relationships: []
      }
      hm27_task_done: {
        Row: {
          created_at: string
          task_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hm27_task_done_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hm27_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hm27_tasks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      hm27_user_servers: {
        Row: {
          created_at: string
          id: string
          server_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          server_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          id?: string
          server_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hm27_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "hm27_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      hm27_users: {
        Row: {
          balance: number
          base_rate: number
          created_at: string
          first_name: string | null
          last_checkin: string | null
          mining_started_at: string | null
          ref_count: number
          referrer_id: number | null
          tg_id: number
          updated_at: string
          username: string | null
        }
        Insert: {
          balance?: number
          base_rate?: number
          created_at?: string
          first_name?: string | null
          last_checkin?: string | null
          mining_started_at?: string | null
          ref_count?: number
          referrer_id?: number | null
          tg_id: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          balance?: number
          base_rate?: number
          created_at?: string
          first_name?: string | null
          last_checkin?: string | null
          mining_started_at?: string | null
          ref_count?: number
          referrer_id?: number | null
          tg_id?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      hm27_withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          tg_id: number
          updated_at: string
          wallet: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          tg_id: number
          updated_at?: string
          wallet: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          tg_id?: number
          updated_at?: string
          wallet?: string
        }
        Relationships: []
      }
      job_runs: {
        Row: {
          created_at: string
          cursor_id: number
          done: boolean
          key: string
          sent: number
        }
        Insert: {
          created_at?: string
          cursor_id?: number
          done?: boolean
          key: string
          sent?: number
        }
        Update: {
          created_at?: string
          cursor_id?: number
          done?: boolean
          key?: string
          sent?: number
        }
        Relationships: []
      }
      lumen_gift_claims: {
        Row: {
          created_at: string
          gift_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          gift_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          gift_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lumen_gift_claims_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "lumen_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      lumen_gifts: {
        Row: {
          amount: number
          created_at: string
          id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      lumen_jobs: {
        Row: {
          cursor: number
          last_run: string
          name: string
        }
        Insert: {
          cursor?: number
          last_run?: string
          name: string
        }
        Update: {
          cursor?: number
          last_run?: string
          name?: string
        }
        Relationships: []
      }
      lumen_payments: {
        Row: {
          amount_ton: number
          comment: string
          created_at: string
          id: string
          server_id: string | null
          status: string
          tg_id: number
          tx_hash: string | null
        }
        Insert: {
          amount_ton: number
          comment: string
          created_at?: string
          id?: string
          server_id?: string | null
          status?: string
          tg_id: number
          tx_hash?: string | null
        }
        Update: {
          amount_ton?: number
          comment?: string
          created_at?: string
          id?: string
          server_id?: string | null
          status?: string
          tg_id?: number
          tx_hash?: string | null
        }
        Relationships: []
      }
      lumen_servers: {
        Row: {
          id: string
          image: string
          name: string
          price_ton: number
          rate_boost: number
          sort: number
        }
        Insert: {
          id?: string
          image: string
          name: string
          price_ton: number
          rate_boost: number
          sort?: number
        }
        Update: {
          id?: string
          image?: string
          name?: string
          price_ton?: number
          rate_boost?: number
          sort?: number
        }
        Relationships: []
      }
      lumen_task_admins: {
        Row: {
          created_at: string
          username: string
        }
        Insert: {
          created_at?: string
          username: string
        }
        Update: {
          created_at?: string
          username?: string
        }
        Relationships: []
      }
      lumen_task_done: {
        Row: {
          created_at: string
          task_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lumen_task_done_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "lumen_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      lumen_tasks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          reward: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      lumen_user_servers: {
        Row: {
          created_at: string
          id: string
          server_id: string
          tg_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          server_id: string
          tg_id: number
        }
        Update: {
          created_at?: string
          id?: string
          server_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lumen_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "lumen_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      lumen_users: {
        Row: {
          balance: number
          base_rate: number
          created_at: string
          first_name: string | null
          games_played: number
          last_game_at: string | null
          last_task_ad_at: string | null
          mining_ends_at: string | null
          mining_started_at: string | null
          notified_on: string | null
          photo_url: string | null
          ref_count: number
          referrer_id: number | null
          tg_id: number
          username: string | null
        }
        Insert: {
          balance?: number
          base_rate?: number
          created_at?: string
          first_name?: string | null
          games_played?: number
          last_game_at?: string | null
          last_task_ad_at?: string | null
          mining_ends_at?: string | null
          mining_started_at?: string | null
          notified_on?: string | null
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          tg_id: number
          username?: string | null
        }
        Update: {
          balance?: number
          base_rate?: number
          created_at?: string
          first_name?: string | null
          games_played?: number
          last_game_at?: string | null
          last_task_ad_at?: string | null
          mining_ends_at?: string | null
          mining_started_at?: string | null
          notified_on?: string | null
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          tg_id?: number
          username?: string | null
        }
        Relationships: []
      }
      lumen_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          id: string
          status: string
          tg_id: number
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          id?: string
          status?: string
          tg_id: number
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          id?: string
          status?: string
          tg_id?: number
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          body: string
          created_at: string
          id: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      notm_gifts: {
        Row: {
          amount: number
          claimed: boolean
          created_at: string
          id: string
          user_id: number
        }
        Insert: {
          amount: number
          claimed?: boolean
          created_at?: string
          id?: string
          user_id: number
        }
        Update: {
          amount?: number
          claimed?: boolean
          created_at?: string
          id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notm_gifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "notm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notm_payments: {
        Row: {
          amount_ton: number
          created_at: string
          id: string
          memo: string
          purpose: string
          status: string
          tx_hash: string | null
          user_id: number
        }
        Insert: {
          amount_ton: number
          created_at?: string
          id?: string
          memo: string
          purpose: string
          status?: string
          tx_hash?: string | null
          user_id: number
        }
        Update: {
          amount_ton?: number
          created_at?: string
          id?: string
          memo?: string
          purpose?: string
          status?: string
          tx_hash?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notm_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "notm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notm_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      notm_task_done: {
        Row: {
          created_at: string
          task_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notm_task_done_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "notm_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notm_task_done_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "notm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notm_task_managers: {
        Row: {
          created_at: string
          username: string
        }
        Insert: {
          created_at?: string
          username: string
        }
        Update: {
          created_at?: string
          username?: string
        }
        Relationships: []
      }
      notm_tasks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      notm_user_servers: {
        Row: {
          created_at: string
          id: string
          server_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          server_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: string
          server_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notm_user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "notm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notm_users: {
        Row: {
          ads_watched: number
          balance: number
          blocked: boolean
          created_at: string
          first_name: string | null
          id: number
          joined_community: boolean
          last_checkin: string | null
          last_game_at: string | null
          mining_started_at: string | null
          paid_gram: boolean
          photo_url: string | null
          ref_count: number
          referrer_id: number | null
          username: string | null
        }
        Insert: {
          ads_watched?: number
          balance?: number
          blocked?: boolean
          created_at?: string
          first_name?: string | null
          id: number
          joined_community?: boolean
          last_checkin?: string | null
          last_game_at?: string | null
          mining_started_at?: string | null
          paid_gram?: boolean
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          username?: string | null
        }
        Update: {
          ads_watched?: number
          balance?: number
          blocked?: boolean
          created_at?: string
          first_name?: string | null
          id?: number
          joined_community?: boolean
          last_checkin?: string | null
          last_game_at?: string | null
          mining_started_at?: string | null
          paid_gram?: boolean
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          username?: string | null
        }
        Relationships: []
      }
      notm_withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          user_id: number
          wallet: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          user_id: number
          wallet: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          user_id?: number
          wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "notm_withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "notm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_ad_views: {
        Row: {
          consumed: boolean
          created_at: string
          id: number
          kind: string
          telegram_id: number
        }
        Insert: {
          consumed?: boolean
          created_at?: string
          id?: number
          kind: string
          telegram_id: number
        }
        Update: {
          consumed?: boolean
          created_at?: string
          id?: number
          kind?: string
          telegram_id?: number
        }
        Relationships: []
      }
      orai_admins: {
        Row: {
          added_by: string | null
          created_at: string
          role: string
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          role?: string
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      orai_broadcasts: {
        Row: {
          created_at: string
          cursor_id: number
          failed: number
          finished_at: string | null
          id: string
          kind: string
          payload: Json
          sent: number
          status: string
        }
        Insert: {
          created_at?: string
          cursor_id?: number
          failed?: number
          finished_at?: string | null
          id?: string
          kind: string
          payload?: Json
          sent?: number
          status?: string
        }
        Update: {
          created_at?: string
          cursor_id?: number
          failed?: number
          finished_at?: string | null
          id?: string
          kind?: string
          payload?: Json
          sent?: number
          status?: string
        }
        Relationships: []
      }
      orai_game_sessions: {
        Row: {
          finished_at: string | null
          game: string
          id: string
          reward: number | null
          score: number | null
          started_at: string
          telegram_id: number
        }
        Insert: {
          finished_at?: string | null
          game: string
          id?: string
          reward?: number | null
          score?: number | null
          started_at?: string
          telegram_id: number
        }
        Update: {
          finished_at?: string | null
          game?: string
          id?: string
          reward?: number | null
          score?: number | null
          started_at?: string
          telegram_id?: number
        }
        Relationships: []
      }
      orai_gift_campaigns: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          title: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string
          id?: string
          title?: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      orai_gift_claims: {
        Row: {
          campaign_id: string
          claimed_at: string
          telegram_id: number
        }
        Insert: {
          campaign_id: string
          claimed_at?: string
          telegram_id: number
        }
        Update: {
          campaign_id?: string
          claimed_at?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orai_gift_claims_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "orai_gift_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_jobs: {
        Row: {
          last_key: string | null
          locked_until: string | null
          name: string
          updated_at: string
        }
        Insert: {
          last_key?: string | null
          locked_until?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          last_key?: string | null
          locked_until?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      orai_news: {
        Row: {
          body: string | null
          created_at: string
          error: string | null
          id: string
          message_id: number | null
          slot: string | null
          status: string
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          error?: string | null
          id?: string
          message_id?: number | null
          slot?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          error?: string | null
          id?: string
          message_id?: number | null
          slot?: string | null
          status?: string
          title?: string | null
        }
        Relationships: []
      }
      orai_payments: {
        Row: {
          action: string
          amount_nano: number
          confirmed_at: string | null
          created_at: string
          expires_at: string
          id: string
          memo: string
          ref_id: string | null
          status: string
          telegram_id: number
          tx_hash: string | null
        }
        Insert: {
          action: string
          amount_nano: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          memo: string
          ref_id?: string | null
          status?: string
          telegram_id: number
          tx_hash?: string | null
        }
        Update: {
          action?: string
          amount_nano?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          memo?: string
          ref_id?: string | null
          status?: string
          telegram_id?: number
          tx_hash?: string | null
        }
        Relationships: []
      }
      orai_server_ad_progress: {
        Row: {
          ads: number
          server_id: string
          telegram_id: number
          updated_at: string
        }
        Insert: {
          ads?: number
          server_id: string
          telegram_id: number
          updated_at?: string
        }
        Update: {
          ads?: number
          server_id?: string
          telegram_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orai_server_ad_progress_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "orai_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_servers: {
        Row: {
          active: boolean
          ads_required: number | null
          created_at: string
          duration_days: number
          id: string
          name: string
          price_ton: number
          rate_boost: number
          slug: string
          sort: number
          tagline: string
        }
        Insert: {
          active?: boolean
          ads_required?: number | null
          created_at?: string
          duration_days?: number
          id?: string
          name: string
          price_ton: number
          rate_boost: number
          slug: string
          sort?: number
          tagline?: string
        }
        Update: {
          active?: boolean
          ads_required?: number | null
          created_at?: string
          duration_days?: number
          id?: string
          name?: string
          price_ton?: number
          rate_boost?: number
          slug?: string
          sort?: number
          tagline?: string
        }
        Relationships: []
      }
      orai_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      orai_task_claims: {
        Row: {
          completed_at: string | null
          started_at: string
          task_id: string
          telegram_id: number
        }
        Insert: {
          completed_at?: string | null
          started_at?: string
          task_id: string
          telegram_id: number
        }
        Update: {
          completed_at?: string | null
          started_at?: string
          task_id?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orai_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "orai_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_tasks: {
        Row: {
          active: boolean
          chat_id: string | null
          created_at: string
          created_by: string | null
          description: string
          icon: string
          id: string
          kind: string
          reward: number
          reward_server_id: string | null
          sort: number
          target: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          icon?: string
          id?: string
          kind?: string
          reward?: number
          reward_server_id?: string | null
          sort?: number
          target?: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          icon?: string
          id?: string
          kind?: string
          reward?: number
          reward_server_id?: string | null
          sort?: number
          target?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orai_tasks_reward_server_id_fkey"
            columns: ["reward_server_id"]
            isOneToOne: false
            referencedRelation: "orai_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_user_servers: {
        Row: {
          expires_at: string
          id: string
          payment_id: string | null
          purchased_at: string
          server_id: string
          telegram_id: number
        }
        Insert: {
          expires_at: string
          id?: string
          payment_id?: string | null
          purchased_at?: string
          server_id: string
          telegram_id: number
        }
        Update: {
          expires_at?: string
          id?: string
          payment_id?: string | null
          purchased_at?: string
          server_id?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orai_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "orai_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      orai_users: {
        Row: {
          ads_day: string | null
          ads_today: number
          ads_total: number
          balance: number
          bot_blocked: boolean
          bot_started: boolean
          created_at: string
          first_name: string | null
          language_code: string | null
          last_name: string | null
          last_seen_at: string
          mine_accrued: number
          mine_boosts: number
          mine_ends_at: string | null
          mine_rate: number
          mine_segment_at: string | null
          mine_started_at: string | null
          photo_url: string | null
          referrals_count: number
          referrer_id: number | null
          telegram_id: number
          total_mined: number
          total_withdrawn: number
          username: string | null
          withdraw_unlocked: boolean
        }
        Insert: {
          ads_day?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bot_blocked?: boolean
          bot_started?: boolean
          created_at?: string
          first_name?: string | null
          language_code?: string | null
          last_name?: string | null
          last_seen_at?: string
          mine_accrued?: number
          mine_boosts?: number
          mine_ends_at?: string | null
          mine_rate?: number
          mine_segment_at?: string | null
          mine_started_at?: string | null
          photo_url?: string | null
          referrals_count?: number
          referrer_id?: number | null
          telegram_id: number
          total_mined?: number
          total_withdrawn?: number
          username?: string | null
          withdraw_unlocked?: boolean
        }
        Update: {
          ads_day?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          bot_blocked?: boolean
          bot_started?: boolean
          created_at?: string
          first_name?: string | null
          language_code?: string | null
          last_name?: string | null
          last_seen_at?: string
          mine_accrued?: number
          mine_boosts?: number
          mine_ends_at?: string | null
          mine_rate?: number
          mine_segment_at?: string | null
          mine_started_at?: string | null
          photo_url?: string | null
          referrals_count?: number
          referrer_id?: number | null
          telegram_id?: number
          total_mined?: number
          total_withdrawn?: number
          username?: string | null
          withdraw_unlocked?: boolean
        }
        Relationships: []
      }
      orai_withdrawals: {
        Row: {
          address: string
          amount: number
          attempts: number
          created_at: string
          error: string | null
          id: string
          processed_at: string | null
          seqno: number | null
          status: string
          telegram_id: number
        }
        Insert: {
          address: string
          amount: number
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          processed_at?: string | null
          seqno?: number | null
          status?: string
          telegram_id: number
        }
        Update: {
          address?: string
          amount?: number
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          processed_at?: string | null
          seqno?: number | null
          status?: string
          telegram_id?: number
        }
        Relationships: []
      }
      orange_ad_views: {
        Row: {
          created_at: string
          id: number
          purpose: string
          used: boolean
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          purpose: string
          used?: boolean
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          purpose?: string
          used?: boolean
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_ad_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_admins: {
        Row: {
          added_by: string | null
          created_at: string
          role: string
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          role?: string
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      orange_game_sessions: {
        Row: {
          doubled: boolean
          finished: boolean
          game: string
          id: string
          reward: number
          score: number
          started_at: string
          user_id: number
        }
        Insert: {
          doubled?: boolean
          finished?: boolean
          game: string
          id?: string
          reward?: number
          score?: number
          started_at?: string
          user_id: number
        }
        Update: {
          doubled?: boolean
          finished?: boolean
          game?: string
          id?: string
          reward?: number
          score?: number
          started_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_gifts: {
        Row: {
          amount: number
          claimed: boolean
          claimed_at: string | null
          created_at: string
          expires_at: string
          id: string
          user_id: number
        }
        Insert: {
          amount: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          user_id: number
        }
        Update: {
          amount?: number
          claimed?: boolean
          claimed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_gifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_jobs: {
        Row: {
          created_at: string
          cursor_id: number
          done: boolean
          key: string
          kind: string
          sent: number
        }
        Insert: {
          created_at?: string
          cursor_id?: number
          done?: boolean
          key: string
          kind: string
          sent?: number
        }
        Update: {
          created_at?: string
          cursor_id?: number
          done?: boolean
          key?: string
          kind?: string
          sent?: number
        }
        Relationships: []
      }
      orange_news: {
        Row: {
          body: string
          created_at: string
          id: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      orange_payments: {
        Row: {
          amount_nano: number
          confirmed_at: string | null
          created_at: string
          id: string
          kind: string
          memo: string
          ref_id: string | null
          status: string
          tx_hash: string | null
          user_id: number
        }
        Insert: {
          amount_nano: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          kind?: string
          memo: string
          ref_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id: number
        }
        Update: {
          amount_nano?: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          kind?: string
          memo?: string
          ref_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_servers: {
        Row: {
          active: boolean
          color: string
          duration_days: number
          id: string
          name: string
          price_ton: number
          rate_per_hour: number
          sort: number
          tier: number
        }
        Insert: {
          active?: boolean
          color?: string
          duration_days?: number
          id: string
          name: string
          price_ton: number
          rate_per_hour: number
          sort?: number
          tier?: number
        }
        Update: {
          active?: boolean
          color?: string
          duration_days?: number
          id?: string
          name?: string
          price_ton?: number
          rate_per_hour?: number
          sort?: number
          tier?: number
        }
        Relationships: []
      }
      orange_task_claims: {
        Row: {
          created_at: string
          task_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "orange_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orange_task_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_tasks: {
        Row: {
          active: boolean
          chat_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          icon: string
          id: string
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      orange_user_servers: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          rate_per_hour?: number
          server_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "orange_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orange_user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      orange_users: {
        Row: {
          ads_date: string | null
          ads_today: number
          ads_total: number
          balance: number
          boost_until: string | null
          bot_blocked: boolean
          created_at: string
          daily_last: string | null
          daily_streak: number
          first_name: string | null
          games_date: string | null
          games_today: number
          last_ad_at: string | null
          last_seen: string
          mining_last_tick: string | null
          mining_pending: number
          mining_rate: number
          mining_started_at: string | null
          photo_url: string | null
          ref_count: number
          ref_earned: number
          referrer_id: number | null
          started_bot: boolean
          tg_id: number
          total_mined: number
          username: string | null
        }
        Insert: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          boost_until?: string | null
          bot_blocked?: boolean
          created_at?: string
          daily_last?: string | null
          daily_streak?: number
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          last_ad_at?: string | null
          last_seen?: string
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          started_bot?: boolean
          tg_id: number
          total_mined?: number
          username?: string | null
        }
        Update: {
          ads_date?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          boost_until?: string | null
          bot_blocked?: boolean
          created_at?: string
          daily_last?: string | null
          daily_streak?: number
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          last_ad_at?: string | null
          last_seen?: string
          mining_last_tick?: string | null
          mining_pending?: number
          mining_rate?: number
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          started_bot?: boolean
          tg_id?: number
          total_mined?: number
          username?: string | null
        }
        Relationships: []
      }
      orange_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          id: string
          note: string | null
          processed_at: string | null
          status: string
          user_id: number
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id: number
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "orange_withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "orange_users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_ton: number
          confirmed_at: string | null
          created_at: string
          id: string
          memo: string
          server_id: string | null
          status: string
          tx_hash: string | null
          user_id: number
        }
        Insert: {
          amount_ton: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          memo: string
          server_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id: number
        }
        Update: {
          amount_ton?: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          memo?: string
          server_id?: string | null
          status?: string
          tx_hash?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      servers: {
        Row: {
          active: boolean
          duration_days: number
          id: string
          image: string
          max_supply: number | null
          name: string
          price_ton: number
          rate_per_hour: number
          sort: number
          tier: number
        }
        Insert: {
          active?: boolean
          duration_days?: number
          id?: string
          image?: string
          max_supply?: number | null
          name: string
          price_ton: number
          rate_per_hour: number
          sort?: number
          tier?: number
        }
        Update: {
          active?: boolean
          duration_days?: number
          id?: string
          image?: string
          max_supply?: number | null
          name?: string
          price_ton?: number
          rate_per_hour?: number
          sort?: number
          tier?: number
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          created_at: string
          task_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          task_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          task_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tasks: {
        Row: {
          active: boolean
          chat_id: string | null
          created_at: string
          description: string | null
          icon: string
          id: string
          image: string | null
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          image?: string | null
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_id?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          image?: string | null
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      user_servers: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          rate_per_hour: number
          server_id: string
          user_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          rate_per_hour?: number
          server_id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      users: {
        Row: {
          ad_boost_until: string | null
          ads_date: string | null
          ads_today: number
          balance: number
          blocked: boolean
          created_at: string
          first_name: string | null
          games_date: string | null
          games_today: number
          last_seen: string
          mining_started_at: string | null
          photo_url: string | null
          ref_count: number
          ref_earned: number
          referrer_id: number | null
          started_bot: boolean
          tg_id: number
          total_mined: number
          username: string | null
        }
        Insert: {
          ad_boost_until?: string | null
          ads_date?: string | null
          ads_today?: number
          balance?: number
          blocked?: boolean
          created_at?: string
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          last_seen?: string
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          started_bot?: boolean
          tg_id: number
          total_mined?: number
          username?: string | null
        }
        Update: {
          ad_boost_until?: string | null
          ads_date?: string | null
          ads_today?: number
          balance?: number
          blocked?: boolean
          created_at?: string
          first_name?: string | null
          games_date?: string | null
          games_today?: number
          last_seen?: string
          mining_started_at?: string | null
          photo_url?: string | null
          ref_count?: number
          ref_earned?: number
          referrer_id?: number | null
          started_bot?: boolean
          tg_id?: number
          total_mined?: number
          username?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          id: string
          status: string
          tx_note: string | null
          user_id: number
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          id?: string
          status?: string
          tx_note?: string | null
          user_id: number
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          id?: string
          status?: string
          tx_note?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["tg_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_balance: { Args: { _amount: number; _uid: number }; Returns: number }
      clau_claim_gift: { Args: { _gift: string; _tg: number }; Returns: number }
      clau_claim_job: {
        Args: { _every_seconds: number; _key: string }
        Returns: boolean
      }
      clau_credit: {
        Args: { _amount: number; _mined?: boolean; _tg: number }
        Returns: number
      }
      clau_debit: { Args: { _amount: number; _tg: number }; Returns: boolean }
      clau_lock_broadcast: {
        Args: never
        Returns: {
          created_at: string
          cursor: number
          done: boolean
          failed: number
          gift_id: string | null
          id: string
          key: string
          kind: string
          locked_until: string | null
          photo_url: string | null
          sent: number
          text: string
        }[]
        SetofOptions: {
          from: "*"
          to: "clau_broadcasts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      gama_claim_gift: { Args: { _gid: string; _uid: number }; Returns: number }
      gama_claim_task: {
        Args: { _task_id: string; _uid: number }
        Returns: number
      }
      gama_confirm_payment: {
        Args: { _pid: string; _tx: string }
        Returns: Json
      }
      gama_game_finish: {
        Args: { _score: number; _sid: string; _uid: number }
        Returns: number
      }
      gama_game_start: {
        Args: { _game: string; _uid: number }
        Returns: string
      }
      gama_mining_boost: { Args: { _uid: number }; Returns: number }
      gama_mining_claim: { Args: { _uid: number }; Returns: number }
      gama_mining_start: { Args: { _uid: number }; Returns: undefined }
      gama_post_lock: { Args: { _key: string }; Returns: boolean }
      gama_rate: { Args: { _uid: number }; Returns: number }
      gama_record_ad: {
        Args: { _purpose: string; _uid: number }
        Returns: undefined
      }
      gama_register: {
        Args: {
          _first: string
          _from_bot: boolean
          _photo: string
          _ref: number
          _uid: number
          _username: string
        }
        Returns: boolean
      }
      gama_session_hours: { Args: never; Returns: number }
      gama_stats: { Args: never; Returns: Json }
      gama_tick: { Args: { _uid: number }; Returns: undefined }
      gama_watch_ad: { Args: { _uid: number }; Returns: number }
      gama_withdraw: {
        Args: { _address: string; _amount: number; _uid: number }
        Returns: string
      }
      gama_withdraw_process: {
        Args: { _note: string; _status: string; _wid: string }
        Returns: number
      }
      orai_claim_gift: { Args: { _cid: string; _tid: number }; Returns: number }
      orai_claim_job: {
        Args: { _key: string; _name: string }
        Returns: boolean
      }
      orai_claim_mining: {
        Args: { _ref_share: number; _tid: number }
        Returns: number
      }
      orai_complete_task: {
        Args: { _task: string; _tid: number }
        Returns: number
      }
      orai_consume_ad: {
        Args: {
          _id: number
          _kind: string
          _max_age_seconds: number
          _tid: number
        }
        Returns: boolean
      }
      orai_credit: {
        Args: { _amount: number; _mined?: boolean; _tid: number }
        Returns: number
      }
      orai_rebase_mining: {
        Args: { _add_boost?: number; _new_rate: number; _tid: number }
        Returns: undefined
      }
      orai_record_ad: {
        Args: {
          _cap: number
          _gap_seconds: number
          _kind: string
          _reward: number
          _tid: number
        }
        Returns: number
      }
      orai_refund_withdrawal: {
        Args: { _error: string; _status: string; _wid: string }
        Returns: boolean
      }
      orai_register_user: {
        Args: {
          _bonus: number
          _first: string
          _from_bot: boolean
          _lang: string
          _last: string
          _photo: string
          _ref: number
          _tid: number
          _username: string
        }
        Returns: Json
      }
      orai_request_withdrawal: {
        Args: { _address: string; _amount: number; _tid: number }
        Returns: string
      }
      orai_server_ad_step: {
        Args: { _need: number; _server: string; _tid: number }
        Returns: number
      }
      orai_stats: { Args: never; Returns: Json }
      orai_try_lock: {
        Args: { _name: string; _seconds: number }
        Returns: boolean
      }
      orai_unlock: { Args: { _name: string }; Returns: undefined }
      orange_add_balance: {
        Args: { _amount: number; _uid: number }
        Returns: number
      }
      orange_base_rate: { Args: never; Returns: number }
      orange_claim_gift: {
        Args: { _gid: string; _uid: number }
        Returns: number
      }
      orange_claim_task: {
        Args: { _task_id: string; _uid: number }
        Returns: number
      }
      orange_confirm_payment: {
        Args: { _pid: string; _tx: string }
        Returns: Json
      }
      orange_daily_checkin: { Args: { _uid: number }; Returns: Json }
      orange_game_double: {
        Args: { _ad_id: number; _sid: string; _uid: number }
        Returns: number
      }
      orange_game_finish: {
        Args: { _reward: number; _score: number; _sid: string; _uid: number }
        Returns: number
      }
      orange_game_start: {
        Args: { _ad_id: number; _game: string; _uid: number }
        Returns: string
      }
      orange_mining_boost: {
        Args: { _ad_id: number; _uid: number }
        Returns: string
      }
      orange_mining_claim: { Args: { _uid: number }; Returns: number }
      orange_mining_start: {
        Args: { _ad_id: number; _uid: number }
        Returns: undefined
      }
      orange_rate: { Args: { _uid: number }; Returns: number }
      orange_record_ad: {
        Args: { _purpose: string; _uid: number }
        Returns: number
      }
      orange_register: {
        Args: {
          _first: string
          _from_bot: boolean
          _photo: string
          _ref: number
          _uid: number
          _username: string
        }
        Returns: boolean
      }
      orange_session_hours: { Args: never; Returns: number }
      orange_tick: { Args: { _uid: number }; Returns: undefined }
      orange_use_ad: {
        Args: { _ad_id: number; _purpose: string; _uid: number }
        Returns: boolean
      }
      orange_withdraw: {
        Args: { _address: string; _amount: number; _uid: number }
        Returns: string
      }
      orange_withdraw_process: {
        Args: { _note: string; _status: string; _wid: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
