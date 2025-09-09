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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comment_likes: {
        Row: {
          comment_id: number
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string | null
          id?: number
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: number
          parent_id: number | null
          post_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          parent_id?: number | null
          post_id: number
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          parent_id?: number | null
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_restaurants: {
        Row: {
          id: number
          restaurant_id: number
          user_id: string
        }
        Insert: {
          id?: number
          restaurant_id: number
          user_id: string
        }
        Update: {
          id?: number
          restaurant_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_restaurants_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_restaurants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      help: {
        Row: {
          contents: string
          created_at: string | null
          help_id: number
          help_type: Database["public"]["Enums"]["help_type_enum"]
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contents: string
          created_at?: string | null
          help_id?: number
          help_type: Database["public"]["Enums"]["help_type_enum"]
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contents?: string
          created_at?: string | null
          help_id?: number
          help_type?: Database["public"]["Enums"]["help_type_enum"]
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "help_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          category: string
          id: number
          name: string
        }
        Insert: {
          category: string
          id?: number
          name: string
        }
        Update: {
          category?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      matching_participants: {
        Row: {
          id: number
          joined_at: string | null
          matching_id: number
          user_id: string
        }
        Insert: {
          id?: number
          joined_at?: string | null
          matching_id: number
          user_id: string
        }
        Update: {
          id?: number
          joined_at?: string | null
          matching_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_participants_matching_id_fkey"
            columns: ["matching_id"]
            isOneToOne: false
            referencedRelation: "matchings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matching_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matchings: {
        Row: {
          created_at: string | null
          description: string | null
          desired_members: number | null
          host_user_id: string
          id: number
          met_at: string | null
          restaurant_id: number
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          desired_members?: number | null
          host_user_id: string
          id?: number
          met_at?: string | null
          restaurant_id: number
          status?: string
          type?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          desired_members?: number | null
          host_user_id?: string
          id?: number
          met_at?: string | null
          restaurant_id?: number
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "matchings_host_user_id_fkey"
            columns: ["host_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          category: Database["public"]["Enums"]["menu_category_enum"]
          description: string | null
          image_url: string | null
          is_active: boolean | null
          menu_id: number
          name: string
          price: number
          restaurant_id: number
        }
        Insert: {
          category: Database["public"]["Enums"]["menu_category_enum"]
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          menu_id?: number
          name: string
          price: number
          restaurant_id: number
        }
        Update: {
          category?: Database["public"]["Enums"]["menu_category_enum"]
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          menu_id?: number
          name?: string
          price?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: number
          post_category: Database["public"]["Enums"]["post_category_enum"]
          tag: Database["public"]["Enums"]["post_tag_enum"]
          title: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          post_category: Database["public"]["Enums"]["post_category_enum"]
          tag: Database["public"]["Enums"]["post_tag_enum"]
          title: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          post_category?: Database["public"]["Enums"]["post_category_enum"]
          tag?: Database["public"]["Enums"]["post_tag_enum"]
          title?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          avg_rating: number
          birth: string
          comment: string | null
          gender: boolean
          id: string
          name: string
          nickname: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string
          avg_rating?: number
          birth: string
          comment?: string | null
          gender?: boolean
          id: string
          name: string
          nickname: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string
          avg_rating?: number
          birth?: string
          comment?: string | null
          gender?: boolean
          id?: string
          name?: string
          nickname?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      reports: {
        Row: {
          accused_user_id: string
          created_at: string | null
          id: number
          penalty: Database["public"]["Enums"]["penalty_type_enum"]
          reason: string
          report_id: string | null
          report_int: number | null
          report_type: Database["public"]["Enums"]["report_type_enum"]
          reporter_id: string
          status: Database["public"]["Enums"]["report_status_enum"]
        }
        Insert: {
          accused_user_id: string
          created_at?: string | null
          id?: number
          penalty?: Database["public"]["Enums"]["penalty_type_enum"]
          reason: string
          report_id?: string | null
          report_int?: number | null
          report_type: Database["public"]["Enums"]["report_type_enum"]
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status_enum"]
        }
        Update: {
          accused_user_id?: string
          created_at?: string | null
          id?: number
          penalty?: Database["public"]["Enums"]["penalty_type_enum"]
          reason?: string
          report_id?: string | null
          report_int?: number | null
          report_type?: Database["public"]["Enums"]["report_type_enum"]
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_accused_user_id_fkey"
            columns: ["accused_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_interests: {
        Row: {
          id: number
          interest_id: number
          restaurant_id: number
        }
        Insert: {
          id?: number
          interest_id: number
          restaurant_id: number
        }
        Update: {
          id?: number
          interest_id?: number
          restaurant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_interests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          business_number: string | null
          category_id: number | null
          closeday: string[] | null
          closetime: string | null
          created_at: string | null
          favorite: number | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string
          opentime: string | null
          phone: string
          send_avg_rating: number | null
          storeintro: string | null
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          address: string
          business_number?: string | null
          category_id?: number | null
          closeday?: string[] | null
          closetime?: string | null
          created_at?: string | null
          favorite?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name: string
          opentime?: string | null
          phone: string
          send_avg_rating?: number | null
          storeintro?: string | null
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          address?: string
          business_number?: string | null
          category_id?: number | null
          closeday?: string[] | null
          closetime?: string | null
          created_at?: string | null
          favorite?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string
          opentime?: string | null
          phone?: string
          send_avg_rating?: number | null
          storeintro?: string | null
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string | null
          like_id: number
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          like_id?: number
          review_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          like_id?: number
          review_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "review_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_photos: {
        Row: {
          created_at: string | null
          photo_id: number
          photo_url: string
          review_id: number
        }
        Insert: {
          created_at?: string | null
          photo_id?: number
          photo_url: string
          review_id: number
        }
        Update: {
          created_at?: string | null
          photo_id?: number
          photo_url?: string
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          rating_ambience: number | null
          rating_food: number | null
          rating_service: number | null
          restaurant_id: number
          review_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          rating_ambience?: number | null
          rating_food?: number | null
          rating_service?: number | null
          restaurant_id: number
          review_id?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          rating_ambience?: number | null
          rating_food?: number | null
          rating_service?: number | null
          restaurant_id?: number
          review_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          id: number
          interest_id: number
          user_id: string
        }
        Insert: {
          id?: number
          interest_id: number
          user_id: string
        }
        Update: {
          id?: number
          interest_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          id: number
          point: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: number
          point?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: number
          point?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
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
      help_type_enum:
        | "계정 관련"
        | "결제/환불 관련"
        | "매칭/이용 관련"
        | "리뷰/신고"
        | "서비스 개선 제안"
        | "광고/제휴 문의"
        | "기타"
      menu_category_enum: "메인메뉴" | "사이드" | "음료 및 주류"
      penalty_type_enum: "없음" | "경고" | "7일정지" | "탈퇴"
      post_category_enum: "자유게시판" | "팁과노하우" | "맛집추천요청"
      post_tag_enum: "자유" | "맛집추천요청" | "Q&A" | "팁&노하우"
      report_status_enum: "대기" | "차단" | "검토완료"
      report_type_enum:
        | "사용자"
        | "가게"
        | "댓글"
        | "리뷰"
        | "게시글"
        | "매칭"
        | "채팅"
      user_role: "member" | "partner" | "admin"
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
      help_type_enum: [
        "계정 관련",
        "결제/환불 관련",
        "매칭/이용 관련",
        "리뷰/신고",
        "서비스 개선 제안",
        "광고/제휴 문의",
        "기타",
      ],
      menu_category_enum: ["메인메뉴", "사이드", "음료 및 주류"],
      penalty_type_enum: ["없음", "경고", "7일정지", "탈퇴"],
      post_category_enum: ["자유게시판", "팁과노하우", "맛집추천요청"],
      post_tag_enum: ["자유", "맛집추천요청", "Q&A", "팁&노하우"],
      report_status_enum: ["대기", "차단", "검토완료"],
      report_type_enum: [
        "사용자",
        "가게",
        "댓글",
        "리뷰",
        "게시글",
        "매칭",
        "채팅",
      ],
      user_role: ["member", "partner", "admin"],
    },
  },
} as const
