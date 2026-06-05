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
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json
          entity: string
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          entity: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          entity?: string
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption_az: string
          caption_en: string
          caption_ru: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          media_type: string
          sort_order: number
          thumbnail_url: string | null
          title: string
          url: string
        }
        Insert: {
          caption_az?: string
          caption_en?: string
          caption_ru?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          url: string
        }
        Update: {
          caption_az?: string
          caption_en?: string
          caption_ru?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          name_az: string
          name_en: string
          name_ru: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name_az: string
          name_en?: string
          name_ru?: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name_az?: string
          name_en?: string
          name_ru?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      menu_item_extras: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          item_id: string
          name_az: string
          name_en: string
          name_ru: string
          price: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          item_id: string
          name_az: string
          name_en?: string
          name_ru?: string
          price?: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          item_id?: string
          name_az?: string
          name_en?: string
          name_ru?: string
          price?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_extras_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_variants: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          item_id: string
          name_az: string
          name_en: string
          name_ru: string
          price: number
          sort_order: number
          weight_grams: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          item_id: string
          name_az: string
          name_en?: string
          name_ru?: string
          price: number
          sort_order?: number
          weight_grams?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          item_id?: string
          name_az?: string
          name_en?: string
          name_ru?: string
          price?: number
          sort_order?: number
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[]
          badge: string | null
          badges: string[]
          calories: number | null
          category: string
          category_id: string | null
          cooking_time: number | null
          created_at: string
          desc_az: string
          desc_en: string
          desc_ru: string
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name_az: string
          name_en: string
          name_ru: string
          old_price: number | null
          price: number
          sort_order: number
          spicy_level: number | null
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          allergens?: string[]
          badge?: string | null
          badges?: string[]
          calories?: number | null
          category: string
          category_id?: string | null
          cooking_time?: number | null
          created_at?: string
          desc_az?: string
          desc_en?: string
          desc_ru?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name_az: string
          name_en?: string
          name_ru?: string
          old_price?: number | null
          price?: number
          sort_order?: number
          spicy_level?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          allergens?: string[]
          badge?: string | null
          badges?: string[]
          calories?: number | null
          category?: string
          category_id?: string | null
          cooking_time?: number | null
          created_at?: string
          desc_az?: string
          desc_en?: string
          desc_ru?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name_az?: string
          name_en?: string
          name_ru?: string
          old_price?: number | null
          price?: number
          sort_order?: number
          spicy_level?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_templates: {
        Row: {
          accent_color: string
          created_at: string
          description: string
          id: string
          is_default: boolean
          lang_default: string
          name: string
          show_prices: boolean
          updated_at: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          description?: string
          id?: string
          is_default?: boolean
          lang_default?: string
          name: string
          show_prices?: boolean
          updated_at?: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          description?: string
          id?: string
          is_default?: boolean
          lang_default?: string
          name?: string
          show_prices?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          email: string | null
          guests: number
          id: string
          name: string
          note: string
          occasion: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          status: string
          table_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          guests?: number
          id?: string
          name: string
          note?: string
          occasion?: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          status?: string
          table_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          guests?: number
          id?: string
          name?: string
          note?: string
          occasion?: string | null
          phone?: string
          reservation_date?: string
          reservation_time?: string
          status?: string
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number
          created_at: string
          custom_message: string
          id: string
          location: string
          menu_filter: string[]
          qr_active: boolean
          qr_version: number
          table_name: string
          table_number: number
          template_id: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          custom_message?: string
          id?: string
          location?: string
          menu_filter?: string[]
          qr_active?: boolean
          qr_version?: number
          table_name?: string
          table_number: number
          template_id?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          custom_message?: string
          id?: string
          location?: string
          menu_filter?: string[]
          qr_active?: boolean
          qr_version?: number
          table_name?: string
          table_number?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "menu_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_avatar: string | null
          author_name: string
          content: string
          content_az: string
          content_en: string
          content_ru: string
          created_at: string
          id: string
          is_featured: boolean
          rating: number
          review_date: string
          source: string
          status: string
        }
        Insert: {
          author_avatar?: string | null
          author_name: string
          content: string
          content_az?: string
          content_en?: string
          content_ru?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
          review_date?: string
          source?: string
          status?: string
        }
        Update: {
          author_avatar?: string | null
          author_name?: string
          content?: string
          content_az?: string
          content_en?: string
          content_ru?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
          review_date?: string
          source?: string
          status?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          category_id: string
          is_visible: boolean
          sort_order: number
          template_id: string
        }
        Insert: {
          category_id: string
          is_visible?: boolean
          sort_order?: number
          template_id: string
        }
        Update: {
          category_id?: string
          is_visible?: boolean
          sort_order?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_categories_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "menu_templates"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
      waiter_calls: {
        Row: {
          created_at: string
          id: string
          kind: string
          resolved_at: string | null
          status: string
          table_id: string | null
          table_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          resolved_at?: string | null
          status?: string
          table_id?: string | null
          table_number: number
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          resolved_at?: string | null
          status?: string
          table_id?: string | null
          table_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
