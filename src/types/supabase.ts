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
      custom_log_categories: {
        Row: {
          color_theme: string
          created_at: string
          icon: string
          id: string
          name: string
          track_cost: boolean
          vehicle_id: string
        }
        Insert: {
          color_theme: string
          created_at?: string
          icon: string
          id?: string
          name: string
          track_cost?: boolean
          vehicle_id: string
        }
        Update: {
          color_theme?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          track_cost?: boolean
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_log_categories_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_logs: {
        Row: {
          category_id: string
          cost: number | null
          created_at: string
          date: string
          id: string
          notes: string | null
          vehicle_id: string
        }
        Insert: {
          category_id: string
          cost?: number | null
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          vehicle_id: string
        }
        Update: {
          category_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_logs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "custom_log_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          calculated_efficiency: number | null
          created_at: string | null
          date: string
          energy_type: string | null
          estimated_range: number | null
          fuel_volume: number
          id: string
          odometer: number
          total_cost: number
          vehicle_id: string
        }
        Insert: {
          calculated_efficiency?: number | null
          created_at?: string | null
          date: string
          energy_type?: string | null
          estimated_range?: number | null
          fuel_volume: number
          id?: string
          odometer: number
          total_cost: number
          vehicle_id: string
        }
        Update: {
          calculated_efficiency?: number | null
          created_at?: string | null
          date?: string
          energy_type?: string | null
          estimated_range?: number | null
          fuel_volume?: number
          id?: string
          odometer?: number
          total_cost?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          cost: number
          created_at: string | null
          date: string
          id: string
          notes: string | null
          service_type: string
          user_id: string | null
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          service_type: string
          user_id?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          service_type?: string
          user_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          currency: string | null
          display_name: string | null
          distance_unit: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          distance_unit?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          distance_unit?: string | null
          id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          baseline_odometer: number
          battery_capacity_kwh: number | null
          color: string | null
          created_at: string | null
          custom_fields: Json | null
          engine_type: string | null
          id: string
          image_url: string | null
          license_plate: string | null
          make: string
          model: string
          notes: string | null
          powertrain: string | null
          transmission: string | null
          tyre_info: Json | null
          user_id: string
          vehicle_type: string | null
          vin: string | null
          year: number
        }
        Insert: {
          baseline_odometer: number
          battery_capacity_kwh?: number | null
          color?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          engine_type?: string | null
          id?: string
          image_url?: string | null
          license_plate?: string | null
          make: string
          model: string
          notes?: string | null
          powertrain?: string | null
          transmission?: string | null
          tyre_info?: Json | null
          user_id: string
          vehicle_type?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          baseline_odometer?: number
          battery_capacity_kwh?: number | null
          color?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          engine_type?: string | null
          id?: string
          image_url?: string | null
          license_plate?: string | null
          make?: string
          model?: string
          notes?: string | null
          powertrain?: string | null
          transmission?: string | null
          tyre_info?: Json | null
          user_id?: string
          vehicle_type?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
    Enums: {},
  },
} as const
