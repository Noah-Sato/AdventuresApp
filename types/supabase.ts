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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          event_id: string
          id: string
          invited_by: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          invited_by?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          invited_by?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_photos: {
        Row: {
          created_at: string
          event_id: string
          id: string
          image_url: string
          posted_by: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          image_url: string
          posted_by: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          image_url?: string
          posted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_photos_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string | null
          created_at: string
          description: string | null
          description_images: string[] | null
          end_date: string | null
          formatted_address: string | null
          host_id: string
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          place_id: string | null
          start_date: string
          title: string
          visibility: Database["public"]["Enums"]["event_visibility"]
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          description_images?: string[] | null
          end_date?: string | null
          formatted_address?: string | null
          host_id: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          place_id?: string | null
          start_date: string
          title: string
          visibility?: Database["public"]["Enums"]["event_visibility"]
        }
        Update: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          description_images?: string[] | null
          end_date?: string | null
          formatted_address?: string | null
          host_id?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          place_id?: string | null
          start_date?: string
          title?: string
          visibility?: Database["public"]["Enums"]["event_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          pair_key: string | null
          requester_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["friend_status"]
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          pair_key?: string | null
          requester_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friend_status"]
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          pair_key?: string | null
          requester_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["friend_status"]
        }
        Relationships: [
          {
            foreignKeyName: "friends_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          device_id: string | null
          expo_push_token: string
          id: string
          last_seen_at: string
          platform: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          expo_push_token: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          expo_push_token?: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status: "invited" | "going" | "maybe" | "declined"
      event_visibility: "public" | "private"
      friend_status: "pending" | "accepted" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof Database
}
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["invited", "going", "maybe", "declined"],
      event_visibility: ["public", "private"],
      friend_status: ["pending", "accepted", "blocked"],
    },
  },
} as const
