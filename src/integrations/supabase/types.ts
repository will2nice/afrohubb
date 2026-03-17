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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          properties: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          properties?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          properties?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      bottle_packages: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          includes: string[] | null
          name: string
          price_cents: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          includes?: string[] | null
          name?: string
          price_cents?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          includes?: string[] | null
          name?: string
          price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "bottle_packages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          checked_in_at: string
          checked_in_by: string | null
          event_id: string
          id: string
          method: string
          order_id: string | null
          reservation_id: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          checked_in_by?: string | null
          event_id: string
          id?: string
          method?: string
          order_id?: string | null
          reservation_id?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string
          checked_in_by?: string | null
          event_id?: string
          id?: string
          method?: string
          order_id?: string | null
          reservation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      city_agent_logs: {
        Row: {
          action: string
          city: string
          created_at: string
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          city: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          city?: string
          created_at?: string
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      city_agent_messages: {
        Row: {
          city: string
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          city: string
          content: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          city?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_broadcasts: {
        Row: {
          created_at: string
          event_id: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_broadcasts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_promoters: {
        Row: {
          created_at: string
          event_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_promoters_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string
          city: string
          created_at: string
          creator_id: string
          date: string
          description: string | null
          end_date: string | null
          external_id: string | null
          external_url: string | null
          id: string
          image_url: string | null
          is_approved: boolean | null
          location: string | null
          price: string | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category?: string
          city: string
          created_at?: string
          creator_id: string
          date: string
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          location?: string | null
          price?: string | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string
          city?: string
          created_at?: string
          creator_id?: string
          date?: string
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          location?: string | null
          price?: string | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          group_id: string
          id: string
          image_url: string | null
          likes_count: number
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          group_id: string
          id?: string
          image_url?: string | null
          likes_count?: number
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          creator_id: string
          description: string
          icon_emoji: string
          id: string
          is_featured: boolean
          member_count: number
          name: string
          slug: string
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          creator_id: string
          description?: string
          icon_emoji?: string
          id?: string
          is_featured?: boolean
          member_count?: number
          name: string
          slug: string
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          creator_id?: string
          description?: string
          icon_emoji?: string
          id?: string
          is_featured?: boolean
          member_count?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      help_requests: {
        Row: {
          category: string
          city: string
          created_at: string
          description: string
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      like_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          place_id: string
          price: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          place_id: string
          price?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          place_id?: string
          price?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          event_invites: boolean
          group_activity: boolean
          id: string
          messages: boolean
          nearby_events: boolean
          profile_views: boolean
          ticket_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_invites?: boolean
          group_activity?: boolean
          id?: string
          messages?: boolean
          nearby_events?: boolean
          profile_views?: boolean
          ticket_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_invites?: boolean
          group_activity?: boolean
          id?: string
          messages?: boolean
          nearby_events?: boolean
          profile_views?: boolean
          ticket_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          application_fee_cents: number
          check_in_code: string | null
          created_at: string
          event_id: string
          id: string
          quantity: number
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          ticket_type_id: string
          total_cents: number
          user_id: string
        }
        Insert: {
          application_fee_cents?: number
          check_in_code?: string | null
          created_at?: string
          event_id: string
          id?: string
          quantity?: number
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          ticket_type_id: string
          total_cents: number
          user_id: string
        }
        Update: {
          application_fee_cents?: number
          check_in_code?: string | null
          created_at?: string
          event_id?: string
          id?: string
          quantity?: number
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          ticket_type_id?: string
          total_cents?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          category: string
          city: string
          created_at: string
          cuisine_type: string | null
          description: string | null
          id: string
          image_url: string | null
          is_halal: boolean | null
          is_lent_friendly: boolean | null
          is_ramadan_friendly: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          price_range: string | null
          source: string | null
          subcategory: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string
          city: string
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_halal?: boolean | null
          is_lent_friendly?: boolean | null
          is_ramadan_friendly?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_range?: string | null
          source?: string | null
          subcategory?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_halal?: boolean | null
          is_lent_friendly?: boolean | null
          is_ramadan_friendly?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_range?: string | null
          source?: string | null
          subcategory?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          city: string | null
          comments_count: number
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          post_type: string
          user_id: string
        }
        Insert: {
          city?: string | null
          comments_count?: number
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          post_type?: string
          user_id: string
        }
        Update: {
          city?: string | null
          comments_count?: number
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          post_type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          diaspora_roots: string | null
          display_name: string
          id: string
          interests: string[] | null
          is_verified: boolean
          languages: string[] | null
          looking_for: string[] | null
          nationality: string | null
          onboarding_completed: boolean
          profile_mode: string | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
          updated_at: string
          username: string | null
          vibe: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          diaspora_roots?: string | null
          display_name?: string
          id: string
          interests?: string[] | null
          is_verified?: boolean
          languages?: string[] | null
          looking_for?: string[] | null
          nationality?: string | null
          onboarding_completed?: boolean
          profile_mode?: string | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          updated_at?: string
          username?: string | null
          vibe?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          diaspora_roots?: string | null
          display_name?: string
          id?: string
          interests?: string[] | null
          is_verified?: boolean
          languages?: string[] | null
          looking_for?: string[] | null
          nationality?: string | null
          onboarding_completed?: boolean
          profile_mode?: string | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
          updated_at?: string
          username?: string | null
          vibe?: string | null
        }
        Relationships: []
      }
      promoter_stripe_accounts: {
        Row: {
          created_at: string
          id: string
          onboarding_complete: boolean
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          onboarding_complete?: boolean
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          channel: string | null
          converted_at: string | null
          created_at: string
          id: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          channel?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          channel?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          arrival_time: string | null
          bottle_package_id: string | null
          check_in_code: string | null
          created_at: string
          deposit_paid_cents: number
          event_id: string
          guest_count: number
          id: string
          special_notes: string | null
          status: string
          stripe_session_id: string | null
          table_type_id: string | null
          total_cents: number
          user_id: string
        }
        Insert: {
          arrival_time?: string | null
          bottle_package_id?: string | null
          check_in_code?: string | null
          created_at?: string
          deposit_paid_cents?: number
          event_id: string
          guest_count?: number
          id?: string
          special_notes?: string | null
          status?: string
          stripe_session_id?: string | null
          table_type_id?: string | null
          total_cents?: number
          user_id: string
        }
        Update: {
          arrival_time?: string | null
          bottle_package_id?: string | null
          check_in_code?: string | null
          created_at?: string
          deposit_paid_cents?: number
          event_id?: string
          guest_count?: number
          id?: string
          special_notes?: string | null
          status?: string
          stripe_session_id?: string | null
          table_type_id?: string | null
          total_cents?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_bottle_package_id_fkey"
            columns: ["bottle_package_id"]
            isOneToOne: false
            referencedRelation: "bottle_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_type_id_fkey"
            columns: ["table_type_id"]
            isOneToOne: false
            referencedRelation: "table_types"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          image_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          image_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string
          user_id?: string
        }
        Relationships: []
      }
      table_types: {
        Row: {
          capacity: number
          created_at: string
          deposit_cents: number
          description: string | null
          event_id: string
          id: string
          name: string
          price_cents: number
          quantity_available: number
          quantity_total: number
        }
        Insert: {
          capacity?: number
          created_at?: string
          deposit_cents?: number
          description?: string | null
          event_id: string
          id?: string
          name?: string
          price_cents?: number
          quantity_available?: number
          quantity_total?: number
        }
        Update: {
          capacity?: number
          created_at?: string
          deposit_cents?: number
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          price_cents?: number
          quantity_available?: number
          quantity_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_transfers: {
        Row: {
          claimed_at: string | null
          created_at: string
          from_user_id: string
          id: string
          order_id: string
          status: string
          to_email: string
          to_user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          order_id: string
          status?: string
          to_email: string
          to_user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          order_id?: string
          status?: string
          to_email?: string
          to_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_transfers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          created_at: string
          currency: string
          event_id: string
          id: string
          name: string
          price_cents: number
          quantity_sold: number
          quantity_total: number
        }
        Insert: {
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          name?: string
          price_cents?: number
          quantity_sold?: number
          quantity_total?: number
        }
        Update: {
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          name?: string
          price_cents?: number
          quantity_sold?: number
          quantity_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_user_id: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          instagram_handle: string | null
          name: string
          phone: string | null
          position: number
          referral_code: string
          referral_count: number
          referred_by: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          instagram_handle?: string | null
          name: string
          phone?: string | null
          position?: number
          referral_code?: string
          referral_count?: number
          referred_by?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          instagram_handle?: string | null
          name?: string
          phone?: string | null
          position?: number
          referral_code?: string
          referral_count?: number
          referred_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_signups_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "waitlist_signups"
            referencedColumns: ["referral_code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dau: {
        Args: { days_back?: number }
        Returns: {
          count: number
          day: string
        }[]
      }
      get_event_counts: {
        Args: { days_back?: number }
        Returns: {
          count: number
          event_name: string
        }[]
      }
      get_referral_leaderboard: {
        Args: { lim?: number }
        Returns: {
          avatar_url: string
          display_name: string
          is_verified: boolean
          referral_count: number
          user_id: string
        }[]
      }
      get_retention: {
        Args: never
        Returns: {
          period: string
          retention_pct: number
        }[]
      }
      get_top_cities: {
        Args: { lim?: number }
        Returns: {
          city: string
          user_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      join_event_chat: { Args: { p_event_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
