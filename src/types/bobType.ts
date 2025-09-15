/**
 * Enums: {
      event_badge_enum: 'HOT' | '신규';
      event_status_enum: '진행중' | '예정' | '종료';
      help_type_enum:
        | '계정 관련'
        | '결제/환불 관련'
        | '매칭/이용 관련'
        | '리뷰/신고'
        | '서비스 개선 제안'
        | '광고/제휴 문의'
        | '기타';
      menu_category_enum: '메인메뉴' | '사이드' | '음료 및 주류';
      notification_target_enum: 'all' | 'profiles' | 'partner';
      order_status_enum: '조리 중' | '접수 대기중' | '준비중' | '완료';
      participation_method_enum: '참여하기' | '이벤트 시작시간' | '종료된 이벤트';
      partner_status_enum: '대기' | '거절' | '활성' | '정지' | '탈퇴';
      penalty_type_enum: '없음' | '경고' | '7일정지' | '탈퇴';
      point_change_enum:
        | 'daily_login'
        | 'review'
        | 'matching'
        | 'invite_friend'
        | 'favorite_restaurant'
        | 'coupon_redeem';
      post_category_enum: '자유게시판' | '팁과노하우' | '맛집추천요청';
      post_tag_enum: '자유' | '맛집추천요청' | 'Q&A' | '팁&노하우';
      profile_status_enum: '활성' | '정지' | '탈퇴';
      report_status_enum: '대기' | '차단' | '검토완료';
      report_type_enum: '사용자' | '가게' | '댓글' | '리뷰' | '게시글' | '매칭' | '채팅';
      sales_status_enum: '정산 전' | '정산 대기' | '정산 완료';
      user_role: 'member' | 'partner' | 'admin';
    };
 */

// 댓글 좋아요 테이블
export type comment_like = Database['public']['Tables']['comment_likes']['Row'];
export type comment_likeInsert = Database['public']['Tables']['comment_likes']['Insert'];
export type comment_likeUpdate = Database['public']['Tables']['comment_likes']['Update'];

// 댓글 테이블
export type comment = Database['public']['Tables']['comments']['Row'];
export type commentInsert = Database['public']['Tables']['comments']['Insert'];
export type commentUpdate = Database['public']['Tables']['comments']['Update'];

// 사용자 정보 테이블
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// 즐겨찾는 식당 테이블
export type restaurants_favorite = Database['public']['Tables']['restaurants_favorites']['Row'];
export type restaurants_favoriteInsert =
  Database['public']['Tables']['restaurants_favorites']['Insert'];
export type restaurants_favoriteUpdate =
  Database['public']['Tables']['restaurants_favorites']['Update'];

// 1대1문의 테이블
export type help = Database['public']['Tables']['helps']['Row'];
export type helpInsert = Database['public']['Tables']['helps']['Insert'];
export type helpUpdate = Database['public']['Tables']['helps']['Update'];

// 배너 테이블
export type banner = Database['public']['Tables']['banners']['Row'];
export type bannerInsert = Database['public']['Tables']['banners']['Insert'];
export type bannerUpdate = Database['public']['Tables']['banners']['Update'];

// 쿠폰 테이블
export type coupon = Database['public']['Tables']['coupons']['Row'];
export type couponInsert = Database['public']['Tables']['coupons']['Insert'];
export type couponUpdate = Database['public']['Tables']['coupons']['Update'];

// 이벤트 테이블
export type events = Database['public']['Tables']['events']['Row'];
export type eventsInsert = Database['public']['Tables']['events']['Insert'];
export type eventsUpdate = Database['public']['Tables']['events']['Update'];

// 관심사 테이블
export type interests = Database['public']['Tables']['interests']['Row'];
export type interestsInsert = Database['public']['Tables']['interests']['Insert'];
export type interestsUpdate = Database['public']['Tables']['interests']['Update'];

// 매칭 참가자 테이블
export type matching_participants = Database['public']['Tables']['matching_participants']['Row'];
export type matching_participantsInsert =
  Database['public']['Tables']['matching_participants']['Insert'];
export type matching_participantsUpdate =
  Database['public']['Tables']['matching_participants']['Update'];
// 매칭 테이블
export type matchings = Database['public']['Tables']['matchings']['Row'];
export type matchingsInsert = Database['public']['Tables']['matchings']['Insert'];
export type matchingsUpdate = Database['public']['Tables']['matchings']['Update'];

// 메뉴 테이블
export type menus = Database['public']['Tables']['menus']['Row'];
export type menusInsert = Database['public']['Tables']['menus']['Insert'];
export type menusUpdate = Database['public']['Tables']['menus']['Update'];

// 알림 테이블
export type notifications = Database['public']['Tables']['notifications']['Row'];
export type notificationsInsert = Database['public']['Tables']['notifications']['Insert'];
export type notificationsUpdate = Database['public']['Tables']['notifications']['Update'];

// 주문내역 테이블
export type order_items = Database['public']['Tables']['order_items']['Row'];
export type order_itemsInsert = Database['public']['Tables']['order_items']['Insert'];
export type order_itemsUpdate = Database['public']['Tables']['order_items']['Update'];

// 주문상태 테이블
export type orders = Database['public']['Tables']['orders']['Row'];
export type ordersInsert = Database['public']['Tables']['orders']['Insert'];
export type ordersUpdate = Database['public']['Tables']['orders']['Update'];

// 파트너 상태 테이블 (승인대기, 승인거절 등등..)
export type partner_applications = Database['public']['Tables']['partner_applications']['Row'];
export type partner_applicationsInsert =
  Database['public']['Tables']['partner_applications']['Insert'];
export type partner_applicationsUpdate =
  Database['public']['Tables']['partner_applications']['Update'];

// 포인트 테이블
export type point_changes = Database['public']['Tables']['point_changes']['Row'];
export type point_changesInsert = Database['public']['Tables']['point_changes']['Insert'];
export type point_changesUpdate = Database['public']['Tables']['point_changes']['Update'];

// 포인트 적립 타입 테이블
export type point_ruless = Database['public']['Tables']['point_ruless']['Row'];
export type point_rulessInsert = Database['public']['Tables']['point_ruless']['Insert'];
export type point_rulessUpdate = Database['public']['Tables']['point_ruless']['Update'];

// 게시글 테이블
export type posts = Database['public']['Tables']['posts']['Row'];
export type postsInsert = Database['public']['Tables']['posts']['Insert'];
export type postsUpdate = Database['public']['Tables']['posts']['Update'];

// 사용자 차단 테이블
export type profile_blocks = Database['public']['Tables']['profile_blocks']['Row'];
export type profile_blocksInsert = Database['public']['Tables']['profile_blocks']['Insert'];
export type profile_blocksUpdate = Database['public']['Tables']['profile_blocks']['Update'];

// 사용자 쿠폰 테이블
export type profile_coupons = Database['public']['Tables']['profile_coupons']['Row'];
export type profile_couponsInsert = Database['public']['Tables']['profile_coupons']['Insert'];
export type profile_couponsUpdate = Database['public']['Tables']['profile_coupons']['Update'];

// 사용자 관심사 테이블
export type profile_interests = Database['public']['Tables']['profile_interests']['Row'];
export type profile_interestsInsert = Database['public']['Tables']['profile_interests']['Insert'];
export type profile_interestsUpdate = Database['public']['Tables']['profile_interests']['Update'];

// 사용자 포인트 테이블
export type profile_points = Database['public']['Tables']['profile_points']['Row'];
export type profile_pointsInsert = Database['public']['Tables']['profile_points']['Insert'];
export type profile_pointsUpdate = Database['public']['Tables']['profile_points']['Update'];

// 신고 테이블
export type reports = Database['public']['Tables']['reports']['Row'];
export type reportsInsert = Database['public']['Tables']['reports']['Insert'];
export type reportsUpdate = Database['public']['Tables']['reports']['Update'];

// 가게 관심사 테이블
export type restaurant_interests = Database['public']['Tables']['restaurant_interests']['Row'];
export type restaurant_interestsInsert =
  Database['public']['Tables']['restaurant_interests']['Insert'];
export type restaurant_interestsUpdate =
  Database['public']['Tables']['restaurant_interests']['Update'];

// 가게 테이블
export type restaurants = Database['public']['Tables']['restaurants']['Row'];
export type restaurantsInsert = Database['public']['Tables']['restaurants']['Insert'];
export type restaurantsUpdate = Database['public']['Tables']['restaurants']['Update'];

// 리뷰 좋아요 테이블
export type review_likes = Database['public']['Tables']['review_likes']['Row'];
export type review_likesInsert = Database['public']['Tables']['review_likes']['Insert'];
export type review_likesUpdate = Database['public']['Tables']['review_likes']['Update'];

// 리뷰 사진 테이블
export type review_photos = Database['public']['Tables']['review_photos']['Row'];
export type review_photosInsert = Database['public']['Tables']['review_photos']['Insert'];
export type review_photosUpdate = Database['public']['Tables']['review_photos']['Update'];

// 리뷰 테이블
export type reviews = Database['public']['Tables']['reviews']['Row'];
export type reviewsInsert = Database['public']['Tables']['reviews']['Insert'];
export type reviewsUpdate = Database['public']['Tables']['reviews']['Update'];

// 정산 테이블
export type sales = Database['public']['Tables']['sales']['Row'];
export type salesInsert = Database['public']['Tables']['sales']['Insert'];
export type salesUpdate = Database['public']['Tables']['sales']['Update'];

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4';
  };
  public: {
    Tables: {
      banners: {
        Row: {
          alt: string | null;
          id: number;
          thumbnail_url: string;
        };
        Insert: {
          alt?: string | null;
          id?: number;
          thumbnail_url: string;
        };
        Update: {
          alt?: string | null;
          id?: number;
          thumbnail_url?: string;
        };
        Relationships: [];
      };
      comment_likes: {
        Row: {
          comment_id: number;
          created_at: string | null;
          id: number;
          profile_id: string;
        };
        Insert: {
          comment_id: number;
          created_at?: string | null;
          id?: number;
          profile_id: string;
        };
        Update: {
          comment_id?: number;
          created_at?: string | null;
          id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_likes_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_likes_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          parent_id: number | null;
          post_id: number;
          profile_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          parent_id?: number | null;
          post_id: number;
          profile_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          parent_id?: number | null;
          post_id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      coupons: {
        Row: {
          description: string | null;
          discount_amount: number;
          id: number;
          name: string;
          required_points: number;
        };
        Insert: {
          description?: string | null;
          discount_amount: number;
          id?: number;
          name: string;
          required_points: number;
        };
        Update: {
          description?: string | null;
          discount_amount?: number;
          id?: number;
          name?: string;
          required_points?: number;
        };
        Relationships: [];
      };
      events: {
        Row: {
          badge: Database['public']['Enums']['event_badge_enum'] | null;
          benefit: string | null;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: number;
          image_url: string | null;
          participants_count: number | null;
          participation: Database['public']['Enums']['participation_method_enum'] | null;
          start_date: string | null;
          status: Database['public']['Enums']['event_status_enum'];
          title: string;
        };
        Insert: {
          badge?: Database['public']['Enums']['event_badge_enum'] | null;
          benefit?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          participants_count?: number | null;
          participation?: Database['public']['Enums']['participation_method_enum'] | null;
          start_date?: string | null;
          status?: Database['public']['Enums']['event_status_enum'];
          title: string;
        };
        Update: {
          badge?: Database['public']['Enums']['event_badge_enum'] | null;
          benefit?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          participants_count?: number | null;
          participation?: Database['public']['Enums']['participation_method_enum'] | null;
          start_date?: string | null;
          status?: Database['public']['Enums']['event_status_enum'];
          title?: string;
        };
        Relationships: [];
      };
      helps: {
        Row: {
          contents: string;
          created_at: string | null;
          help_id: number;
          help_type: Database['public']['Enums']['help_type_enum'];
          profile_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          contents: string;
          created_at?: string | null;
          help_id?: number;
          help_type: Database['public']['Enums']['help_type_enum'];
          profile_id: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          contents?: string;
          created_at?: string | null;
          help_id?: number;
          help_type?: Database['public']['Enums']['help_type_enum'];
          profile_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'help_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      interests: {
        Row: {
          category: string;
          id: number;
          name: string;
        };
        Insert: {
          category: string;
          id?: number;
          name: string;
        };
        Update: {
          category?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      matching_participants: {
        Row: {
          id: number;
          joined_at: string | null;
          matching_id: number;
          profile_id: string;
        };
        Insert: {
          id?: number;
          joined_at?: string | null;
          matching_id: number;
          profile_id: string;
        };
        Update: {
          id?: number;
          joined_at?: string | null;
          matching_id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'matching_participants_matching_id_fkey';
            columns: ['matching_id'];
            isOneToOne: false;
            referencedRelation: 'matchings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matching_participants_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      matchings: {
        Row: {
          created_at: string | null;
          description: string | null;
          desired_members: number | null;
          host_profile_id: string;
          id: number;
          met_at: string | null;
          restaurant_id: number;
          status: string;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          desired_members?: number | null;
          host_profile_id: string;
          id?: number;
          met_at?: string | null;
          restaurant_id: number;
          status?: string;
          type?: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          desired_members?: number | null;
          host_profile_id?: string;
          id?: number;
          met_at?: string | null;
          restaurant_id?: number;
          status?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'matchings_host_profile_id_fkey';
            columns: ['host_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matchings_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      menus: {
        Row: {
          category: Database['public']['Enums']['menu_category_enum'];
          description: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean | null;
          name: string;
          price: number;
          restaurant_id: number;
        };
        Insert: {
          category: Database['public']['Enums']['menu_category_enum'];
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          name: string;
          price: number;
          restaurant_id: number;
        };
        Update: {
          category?: Database['public']['Enums']['menu_category_enum'];
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_active?: boolean | null;
          name?: string;
          price?: number;
          restaurant_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'menus_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          profile_id: string;
          target: Database['public']['Enums']['notification_target_enum'];
          title: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          profile_id: string;
          target: Database['public']['Enums']['notification_target_enum'];
          title: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          profile_id?: string;
          target?: Database['public']['Enums']['notification_target_enum'];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: number;
          menu_id: number;
          order_id: number;
          quantity: number;
        };
        Insert: {
          id?: number;
          menu_id: number;
          order_id: number;
          quantity?: number;
        };
        Update: {
          id?: number;
          menu_id?: number;
          order_id?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_menu_id_fkey';
            columns: ['menu_id'];
            isOneToOne: false;
            referencedRelation: 'menus';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          id: number;
          profile_id: string;
          status: Database['public']['Enums']['order_status_enum'];
        };
        Insert: {
          created_at?: string;
          id?: number;
          profile_id: string;
          status: Database['public']['Enums']['order_status_enum'];
        };
        Update: {
          created_at?: string;
          id?: number;
          profile_id?: string;
          status?: Database['public']['Enums']['order_status_enum'];
        };
        Relationships: [
          {
            foreignKeyName: 'orders_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      partner_applications: {
        Row: {
          id: number;
          profile_id: string;
          reason: string;
          status: Database['public']['Enums']['partner_status_enum'];
          submitted_at: string;
        };
        Insert: {
          id?: number;
          profile_id: string;
          reason: string;
          status?: Database['public']['Enums']['partner_status_enum'];
          submitted_at?: string;
        };
        Update: {
          id?: number;
          profile_id?: string;
          reason?: string;
          status?: Database['public']['Enums']['partner_status_enum'];
          submitted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'partner_applications_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      point_changes: {
        Row: {
          amount: number;
          change_type: Database['public']['Enums']['point_change_enum'];
          created_at: string | null;
          id: number;
          profile_id: string;
        };
        Insert: {
          amount: number;
          change_type: Database['public']['Enums']['point_change_enum'];
          created_at?: string | null;
          id?: number;
          profile_id: string;
        };
        Update: {
          amount?: number;
          change_type?: Database['public']['Enums']['point_change_enum'];
          created_at?: string | null;
          id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'point_change_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      point_ruless: {
        Row: {
          change_type: Database['public']['Enums']['point_change_enum'];
          default_amount: number;
        };
        Insert: {
          change_type: Database['public']['Enums']['point_change_enum'];
          default_amount: number;
        };
        Update: {
          change_type?: Database['public']['Enums']['point_change_enum'];
          default_amount?: number;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          post_category: Database['public']['Enums']['post_category_enum'];
          profile_id: string;
          tag: Database['public']['Enums']['post_tag_enum'];
          title: string;
          view_count: number | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          post_category: Database['public']['Enums']['post_category_enum'];
          profile_id: string;
          tag: Database['public']['Enums']['post_tag_enum'];
          title: string;
          view_count?: number | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          post_category?: Database['public']['Enums']['post_category_enum'];
          profile_id?: string;
          tag?: Database['public']['Enums']['post_tag_enum'];
          title?: string;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_blocks: {
        Row: {
          block_date: string;
          blocked_profile_id: number;
          id: number;
          is_active: boolean | null;
          nickname: string;
          profile_id: number;
        };
        Insert: {
          block_date: string;
          blocked_profile_id: number;
          id?: number;
          is_active?: boolean | null;
          nickname: string;
          profile_id: number;
        };
        Update: {
          block_date?: string;
          blocked_profile_id?: number;
          id?: number;
          is_active?: boolean | null;
          nickname?: string;
          profile_id?: number;
        };
        Relationships: [];
      };
      profile_coupons: {
        Row: {
          coupon_id: number;
          expires_at: string | null;
          id: number;
          is_used: boolean | null;
          issued_at: string | null;
          profile_id: string;
        };
        Insert: {
          coupon_id: number;
          expires_at?: string | null;
          id?: number;
          is_used?: boolean | null;
          issued_at?: string | null;
          profile_id: string;
        };
        Update: {
          coupon_id?: number;
          expires_at?: string | null;
          id?: number;
          is_used?: boolean | null;
          issued_at?: string | null;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_coupons_coupon_id_fkey';
            columns: ['coupon_id'];
            isOneToOne: false;
            referencedRelation: 'coupons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_coupons_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_interests: {
        Row: {
          id: number;
          interest_id: number;
          profile_id: string;
        };
        Insert: {
          id?: number;
          interest_id: number;
          profile_id: string;
        };
        Update: {
          id?: number;
          interest_id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_interests_interest_id_fkey';
            columns: ['interest_id'];
            isOneToOne: false;
            referencedRelation: 'interests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_interests_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_points: {
        Row: {
          id: number;
          point: number;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          point?: number;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          point?: number;
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_points_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string;
          avg_rating: number;
          birth: string;
          comment: string | null;
          gender: boolean;
          id: string;
          name: string;
          nickname: string;
          phone: string | null;
          role: Database['public']['Enums']['user_role'];
          status: Database['public']['Enums']['profile_status_enum'];
        };
        Insert: {
          avatar_url?: string;
          avg_rating?: number;
          birth: string;
          comment?: string | null;
          gender?: boolean;
          id: string;
          name: string;
          nickname: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
          status?: Database['public']['Enums']['profile_status_enum'];
        };
        Update: {
          avatar_url?: string;
          avg_rating?: number;
          birth?: string;
          comment?: string | null;
          gender?: boolean;
          id?: string;
          name?: string;
          nickname?: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
          status?: Database['public']['Enums']['profile_status_enum'];
        };
        Relationships: [];
      };
      reports: {
        Row: {
          accused_profile_id: string;
          created_at: string | null;
          id: number;
          penalty: Database['public']['Enums']['penalty_type_enum'];
          reason: string;
          report_id: string | null;
          report_int: number | null;
          report_type: Database['public']['Enums']['report_type_enum'];
          reporter_id: string;
          status: Database['public']['Enums']['report_status_enum'];
        };
        Insert: {
          accused_profile_id: string;
          created_at?: string | null;
          id?: number;
          penalty?: Database['public']['Enums']['penalty_type_enum'];
          reason: string;
          report_id?: string | null;
          report_int?: number | null;
          report_type: Database['public']['Enums']['report_type_enum'];
          reporter_id: string;
          status?: Database['public']['Enums']['report_status_enum'];
        };
        Update: {
          accused_profile_id?: string;
          created_at?: string | null;
          id?: number;
          penalty?: Database['public']['Enums']['penalty_type_enum'];
          reason?: string;
          report_id?: string | null;
          report_int?: number | null;
          report_type?: Database['public']['Enums']['report_type_enum'];
          reporter_id?: string;
          status?: Database['public']['Enums']['report_status_enum'];
        };
        Relationships: [
          {
            foreignKeyName: 'reports_accused_profile_id_fkey';
            columns: ['accused_profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      restaurant_interests: {
        Row: {
          id: number;
          interest_id: number;
          restaurant_id: number;
        };
        Insert: {
          id?: number;
          interest_id: number;
          restaurant_id: number;
        };
        Update: {
          id?: number;
          interest_id?: number;
          restaurant_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'restaurant_interests_interest_id_fkey';
            columns: ['interest_id'];
            isOneToOne: false;
            referencedRelation: 'interests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'restaurant_interests_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      restaurants: {
        Row: {
          address: string;
          business_number: string | null;
          category_id: number | null;
          closeday: string[] | null;
          closetime: string | null;
          created_at: string | null;
          favorite: number | null;
          id: number;
          latitude: number | null;
          longitude: number | null;
          name: string;
          opentime: string | null;
          phone: string;
          profile_id: string;
          send_avg_rating: number | null;
          storeintro: string | null;
          thumbnail_url: string | null;
        };
        Insert: {
          address: string;
          business_number?: string | null;
          category_id?: number | null;
          closeday?: string[] | null;
          closetime?: string | null;
          created_at?: string | null;
          favorite?: number | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
          opentime?: string | null;
          phone: string;
          profile_id: string;
          send_avg_rating?: number | null;
          storeintro?: string | null;
          thumbnail_url?: string | null;
        };
        Update: {
          address?: string;
          business_number?: string | null;
          category_id?: number | null;
          closeday?: string[] | null;
          closetime?: string | null;
          created_at?: string | null;
          favorite?: number | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          opentime?: string | null;
          phone?: string;
          profile_id?: string;
          send_avg_rating?: number | null;
          storeintro?: string | null;
          thumbnail_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'restaurants_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'interests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'restaurants_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      restaurants_favorites: {
        Row: {
          id: number;
          profile_id: string;
          restaurant_id: number;
        };
        Insert: {
          id?: number;
          profile_id: string;
          restaurant_id: number;
        };
        Update: {
          id?: number;
          profile_id?: string;
          restaurant_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'favorite_restaurants_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorite_restaurants_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      review_likes: {
        Row: {
          created_at: string | null;
          like_id: number;
          profile_id: string;
          review_id: number;
        };
        Insert: {
          created_at?: string | null;
          like_id?: number;
          profile_id: string;
          review_id: number;
        };
        Update: {
          created_at?: string | null;
          like_id?: number;
          profile_id?: string;
          review_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'review_likes_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_likes_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['review_id'];
          },
        ];
      };
      review_photos: {
        Row: {
          created_at: string | null;
          photo_id: number;
          photo_url: string;
          review_id: number;
        };
        Insert: {
          created_at?: string | null;
          photo_id?: number;
          photo_url: string;
          review_id: number;
        };
        Update: {
          created_at?: string | null;
          photo_id?: number;
          photo_url?: string;
          review_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'review_photos_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['review_id'];
          },
        ];
      };
      reviews: {
        Row: {
          comment: string | null;
          created_at: string | null;
          partner_comment: string | null;
          partner_id: string | null;
          profile_id: string;
          rating_ambience: number | null;
          rating_food: number | null;
          rating_service: number | null;
          restaurant_id: number;
          review_id: number;
          updated_at: string | null;
        };
        Insert: {
          comment?: string | null;
          created_at?: string | null;
          partner_comment?: string | null;
          partner_id?: string | null;
          profile_id: string;
          rating_ambience?: number | null;
          rating_food?: number | null;
          rating_service?: number | null;
          restaurant_id: number;
          review_id?: number;
          updated_at?: string | null;
        };
        Update: {
          comment?: string | null;
          created_at?: string | null;
          partner_comment?: string | null;
          partner_id?: string | null;
          profile_id?: string;
          rating_ambience?: number | null;
          rating_food?: number | null;
          rating_service?: number | null;
          restaurant_id?: number;
          review_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_partner_id_fkey';
            columns: ['partner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      sales: {
        Row: {
          id: number;
          order_id: number;
          restaurant_id: number;
          sales_at: string | null;
          status: Database['public']['Enums']['sales_status_enum'];
          total_amount: number;
        };
        Insert: {
          id?: number;
          order_id: number;
          restaurant_id: number;
          sales_at?: string | null;
          status?: Database['public']['Enums']['sales_status_enum'];
          total_amount: number;
        };
        Update: {
          id?: number;
          order_id?: number;
          restaurant_id?: number;
          sales_at?: string | null;
          status?: Database['public']['Enums']['sales_status_enum'];
          total_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      event_badge_enum: 'HOT' | '신규';
      event_status_enum: '진행중' | '예정' | '종료';
      help_type_enum:
        | '계정 관련'
        | '결제/환불 관련'
        | '매칭/이용 관련'
        | '리뷰/신고'
        | '서비스 개선 제안'
        | '광고/제휴 문의'
        | '기타';
      menu_category_enum: '메인메뉴' | '사이드' | '음료 및 주류';
      notification_target_enum: 'all' | 'profiles' | 'partner';
      order_status_enum: '조리 중' | '접수 대기중' | '준비중' | '완료';
      participation_method_enum: '참여하기' | '이벤트 시작시간' | '종료된 이벤트';
      partner_status_enum: '대기' | '거절' | '활성' | '정지' | '탈퇴';
      penalty_type_enum: '없음' | '경고' | '7일정지' | '탈퇴';
      point_change_enum:
        | 'daily_login'
        | 'review'
        | 'matching'
        | 'invite_friend'
        | 'favorite_restaurant'
        | 'coupon_redeem';
      post_category_enum: '자유게시판' | '팁과노하우' | '맛집추천요청';
      post_tag_enum: '자유' | '맛집추천요청' | 'Q&A' | '팁&노하우';
      profile_status_enum: '활성' | '정지' | '탈퇴';
      report_status_enum: '대기' | '차단' | '검토완료';
      report_type_enum: '사용자' | '가게' | '댓글' | '리뷰' | '게시글' | '매칭' | '채팅';
      sales_status_enum: '정산 전' | '정산 대기' | '정산 완료';
      user_role: 'member' | 'partner' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      event_badge_enum: ['HOT', '신규'],
      event_status_enum: ['진행중', '예정', '종료'],
      help_type_enum: [
        '계정 관련',
        '결제/환불 관련',
        '매칭/이용 관련',
        '리뷰/신고',
        '서비스 개선 제안',
        '광고/제휴 문의',
        '기타',
      ],
      menu_category_enum: ['메인메뉴', '사이드', '음료 및 주류'],
      notification_target_enum: ['all', 'profiles', 'partner'],
      order_status_enum: ['조리 중', '접수 대기중', '준비중', '완료'],
      participation_method_enum: ['참여하기', '이벤트 시작시간', '종료된 이벤트'],
      partner_status_enum: ['대기', '거절', '활성', '정지', '탈퇴'],
      penalty_type_enum: ['없음', '경고', '7일정지', '탈퇴'],
      point_change_enum: [
        'daily_login',
        'review',
        'matching',
        'invite_friend',
        'favorite_restaurant',
        'coupon_redeem',
      ],
      post_category_enum: ['자유게시판', '팁과노하우', '맛집추천요청'],
      post_tag_enum: ['자유', '맛집추천요청', 'Q&A', '팁&노하우'],
      profile_status_enum: ['활성', '정지', '탈퇴'],
      report_status_enum: ['대기', '차단', '검토완료'],
      report_type_enum: ['사용자', '가게', '댓글', '리뷰', '게시글', '매칭', '채팅'],
      sales_status_enum: ['정산 전', '정산 대기', '정산 완료'],
      user_role: ['member', 'partner', 'admin'],
    },
  },
} as const;
