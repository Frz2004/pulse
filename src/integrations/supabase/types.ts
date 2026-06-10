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
      appeals: {
        Row: {
          created_at: string
          id: string
          kind: string
          reason: string
          related_report_id: string | null
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          target_id: string | null
          target_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          reason: string
          related_report_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string | null
          target_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          reason?: string
          related_report_id?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string | null
          target_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appeals_related_report_id_fkey"
            columns: ["related_report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: []
      }
      call_sessions: {
        Row: {
          callee_id: string
          caller_id: string
          duration_sec: number | null
          ended_at: string | null
          id: string
          props: Json
          rating_callee: number | null
          rating_caller: number | null
          started_at: string
          status: string
          type: string
        }
        Insert: {
          callee_id: string
          caller_id: string
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          props?: Json
          rating_callee?: number | null
          rating_caller?: number | null
          started_at?: string
          status?: string
          type: string
        }
        Update: {
          callee_id?: string
          caller_id?: string
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          props?: Json
          rating_callee?: number | null
          rating_caller?: number | null
          started_at?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      campus_invites: {
        Row: {
          campus_id: string
          code: string
          created_at: string
          expires_at: string | null
          id: string
          inviter_id: string
          max_uses: number
          status: string
          uses: number
        }
        Insert: {
          campus_id: string
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          inviter_id: string
          max_uses?: number
          status?: string
          uses?: number
        }
        Update: {
          campus_id?: string
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          inviter_id?: string
          max_uses?: number
          status?: string
          uses?: number
        }
        Relationships: [
          {
            foreignKeyName: "campus_invites_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      campus_memberships: {
        Row: {
          campus_id: string
          invited_by: string | null
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          campus_id: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          campus_id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campus_memberships_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      campuses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          auto_flag_reason: string | null
          campus_id: string
          category: string
          comments_count: number
          content: string
          cover: string
          created_at: string
          hot: number
          id: string
          likes_count: number
          location: string
          media: Json
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          auto_flag_reason?: string | null
          campus_id: string
          category: string
          comments_count?: number
          content: string
          cover?: string
          created_at?: string
          hot?: number
          id?: string
          likes_count?: number
          location?: string
          media?: Json
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          auto_flag_reason?: string | null
          campus_id?: string
          category?: string
          comments_count?: number
          content?: string
          cover?: string
          created_at?: string
          hot?: number
          id?: string
          likes_count?: number
          location?: string
          media?: Json
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_flags: {
        Row: {
          created_at: string
          detail: Json
          id: string
          reason: string
          severity: string
          source: string
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          detail?: Json
          id?: string
          reason: string
          severity?: string
          source?: string
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          detail?: Json
          id?: string
          reason?: string
          severity?: string
          source?: string
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      contests: {
        Row: {
          author_id: string
          category: string
          contact: string | null
          cover: string | null
          created_at: string
          deadline: string | null
          description: string | null
          ends_at: string | null
          hot: number
          id: string
          location: string | null
          organizer: string | null
          prize: string | null
          register_url: string | null
          starts_at: string | null
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string
          contact?: string | null
          cover?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          ends_at?: string | null
          hot?: number
          id?: string
          location?: string | null
          organizer?: string | null
          prize?: string | null
          register_url?: string | null
          starts_at?: string | null
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          contact?: string | null
          cover?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          ends_at?: string | null
          hot?: number
          id?: string
          location?: string | null
          organizer?: string | null
          prize?: string | null
          register_url?: string | null
          starts_at?: string | null
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string
          source: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          source?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          source?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          followee_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string
          followee_id: string
          follower_id: string
        }
        Update: {
          created_at?: string
          followee_id?: string
          follower_id?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          created_at: string
          game: string
          id: string
          meta: Json
          score: number
          user_id: string
          win: boolean
        }
        Insert: {
          created_at?: string
          game: string
          id?: string
          meta?: Json
          score: number
          user_id: string
          win?: boolean
        }
        Update: {
          created_at?: string
          game?: string
          id?: string
          meta?: Json
          score?: number
          user_id?: string
          win?: boolean
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          coins: number
          conversation_id: string | null
          created_at: string
          gift_code: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          coins: number
          conversation_id?: string | null
          created_at?: string
          gift_code: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          coins?: number
          conversation_id?: string | null
          created_at?: string
          gift_code?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          author_id: string
          category: string
          contact: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          location: string | null
          salary: string | null
          status: string
          summary: string
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string
          contact: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          salary?: string | null
          status?: string
          summary: string
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          contact?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          salary?: string | null
          status?: string
          summary?: string
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string
          duration_sec: number | null
          height: number | null
          id: string
          kind: string
          message_id: string
          size_bytes: number | null
          thumb_url: string | null
          url: string
          width: number | null
        }
        Insert: {
          created_at?: string
          duration_sec?: number | null
          height?: number | null
          id?: string
          kind: string
          message_id: string
          size_bytes?: number | null
          thumb_url?: string | null
          url: string
          width?: number | null
        }
        Update: {
          created_at?: string
          duration_sec?: number | null
          height?: number | null
          id?: string
          kind?: string
          message_id?: string
          size_bytes?: number | null
          thumb_url?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
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
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
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
      moderation_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          note: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          note?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          note?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          payload: Json
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      palm_readings: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          result: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          result: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          result?: Json
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: Json | null
          birthday: string | null
          city: string | null
          created_at: string
          diet: string | null
          distance: string | null
          drink: string | null
          education: string | null
          gender: string | null
          height: string | null
          hometown: string | null
          icebreaker: string | null
          id: string
          ideal_type: string | null
          intent: Json
          interests: Json
          intro: string | null
          job: string | null
          main_idx: number
          mbti: string | null
          nickname: string | null
          onboarded: boolean
          personality: Json
          pet: string | null
          photos: Json
          relationship: string | null
          school: string | null
          signature: string | null
          sleep: string | null
          smoke: string | null
          status: string | null
          updated_at: string
          verify_real: boolean
          verify_student: boolean
          video_intro: string | null
          voice_card_duration: number | null
          voice_card_url: string | null
          zodiac: string | null
        }
        Insert: {
          age_range?: Json | null
          birthday?: string | null
          city?: string | null
          created_at?: string
          diet?: string | null
          distance?: string | null
          drink?: string | null
          education?: string | null
          gender?: string | null
          height?: string | null
          hometown?: string | null
          icebreaker?: string | null
          id: string
          ideal_type?: string | null
          intent?: Json
          interests?: Json
          intro?: string | null
          job?: string | null
          main_idx?: number
          mbti?: string | null
          nickname?: string | null
          onboarded?: boolean
          personality?: Json
          pet?: string | null
          photos?: Json
          relationship?: string | null
          school?: string | null
          signature?: string | null
          sleep?: string | null
          smoke?: string | null
          status?: string | null
          updated_at?: string
          verify_real?: boolean
          verify_student?: boolean
          video_intro?: string | null
          voice_card_duration?: number | null
          voice_card_url?: string | null
          zodiac?: string | null
        }
        Update: {
          age_range?: Json | null
          birthday?: string | null
          city?: string | null
          created_at?: string
          diet?: string | null
          distance?: string | null
          drink?: string | null
          education?: string | null
          gender?: string | null
          height?: string | null
          hometown?: string | null
          icebreaker?: string | null
          id?: string
          ideal_type?: string | null
          intent?: Json
          interests?: Json
          intro?: string | null
          job?: string | null
          main_idx?: number
          mbti?: string | null
          nickname?: string | null
          onboarded?: boolean
          personality?: Json
          pet?: string | null
          photos?: Json
          relationship?: string | null
          school?: string | null
          signature?: string | null
          sleep?: string | null
          smoke?: string | null
          status?: string | null
          updated_at?: string
          verify_real?: boolean
          verify_student?: boolean
          video_intro?: string | null
          voice_card_duration?: number | null
          voice_card_url?: string | null
          zodiac?: string | null
        }
        Relationships: []
      }
      profiles_privacy: {
        Row: {
          allow_messages: string
          hide_city: boolean
          hide_distance: boolean
          id: string
          searchable: boolean
          updated_at: string
        }
        Insert: {
          allow_messages?: string
          hide_city?: boolean
          hide_distance?: boolean
          id: string
          searchable?: boolean
          updated_at?: string
        }
        Update: {
          allow_messages?: string
          hide_city?: boolean
          hide_distance?: boolean
          id?: string
          searchable?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles_private: {
        Row: {
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          reason: string
          reporter_id: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          reason: string
          reporter_id: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      short_video_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          video_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          video_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          video_id?: string
        }
        Relationships: []
      }
      short_video_likes: {
        Row: {
          created_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "short_video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "short_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      short_videos: {
        Row: {
          author_id: string
          caption: string
          comments_count: number
          cover_url: string | null
          created_at: string
          duration_sec: number | null
          height: number | null
          id: string
          likes_count: number
          status: string
          updated_at: string
          video_url: string
          views_count: number
          width: number | null
        }
        Insert: {
          author_id: string
          caption?: string
          comments_count?: number
          cover_url?: string | null
          created_at?: string
          duration_sec?: number | null
          height?: number | null
          id?: string
          likes_count?: number
          status?: string
          updated_at?: string
          video_url: string
          views_count?: number
          width?: number | null
        }
        Update: {
          author_id?: string
          caption?: string
          comments_count?: number
          cover_url?: string | null
          created_at?: string
          duration_sec?: number | null
          height?: number | null
          id?: string
          likes_count?: number
          status?: string
          updated_at?: string
          video_url?: string
          views_count?: number
          width?: number | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          swiper_id: string
          target_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          swiper_id: string
          target_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          swiper_id?: string
          target_id?: string
        }
        Relationships: []
      }
      treehole_posts: {
        Row: {
          anon_name: string
          author_id: string
          content: string
          created_at: string
          hug_count: number
          id: string
          media_url: string | null
          mood: string | null
          resonance_count: number
        }
        Insert: {
          anon_name: string
          author_id: string
          content: string
          created_at?: string
          hug_count?: number
          id?: string
          media_url?: string | null
          mood?: string | null
          resonance_count?: number
        }
        Update: {
          anon_name?: string
          author_id?: string
          content?: string
          created_at?: string
          hug_count?: number
          id?: string
          media_url?: string | null
          mood?: string | null
          resonance_count?: number
        }
        Relationships: []
      }
      treehole_reactions: {
        Row: {
          created_at: string
          kind: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          kind: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          kind?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treehole_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "treehole_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treehole_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "treehole_posts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      treehole_reveals: {
        Row: {
          conversation_id: string
          revealed_at: string | null
          user_a_consent: boolean
          user_b_consent: boolean
        }
        Insert: {
          conversation_id: string
          revealed_at?: string | null
          user_a_consent?: boolean
          user_b_consent?: boolean
        }
        Update: {
          conversation_id?: string
          revealed_at?: string | null
          user_a_consent?: boolean
          user_b_consent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "treehole_reveals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          city: string | null
          lat: number | null
          lng: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          lat?: number | null
          lng?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          lat?: number | null
          lng?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
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
      venue_bookings: {
        Row: {
          attendees: number
          contact: string | null
          created_at: string
          ends_at: string
          id: string
          purpose: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          starts_at: string
          status: string
          user_id: string
          venue_id: string
        }
        Insert: {
          attendees?: number
          contact?: string | null
          created_at?: string
          ends_at: string
          id?: string
          purpose: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          starts_at: string
          status?: string
          user_id: string
          venue_id: string
        }
        Update: {
          attendees?: number
          contact?: string | null
          created_at?: string
          ends_at?: string
          id?: string
          purpose?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          starts_at?: string
          status?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          active: boolean
          capacity: number | null
          category: string
          cover: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          open_hours: string | null
          rules: string | null
        }
        Insert: {
          active?: boolean
          capacity?: number | null
          category?: string
          cover?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          open_hours?: string | null
          rules?: string | null
        }
        Update: {
          active?: boolean
          capacity?: number | null
          category?: string
          cover?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          open_hours?: string | null
          rules?: string | null
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          evidence_extra: string | null
          evidence_url: string
          id: string
          kind: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evidence_extra?: string | null
          evidence_url: string
          id?: string
          kind: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          evidence_extra?: string | null
          evidence_url?: string
          id?: string
          kind?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_ledger: {
        Row: {
          balance_after: number
          created_at: string
          delta: number
          id: string
          kind: string
          ref: Json
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          delta: number
          id?: string
          kind: string
          ref?: Json
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          delta?: number
          id?: string
          kind?: string
          ref?: Json
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          coins: number
          id: string
          pro_until: string | null
          updated_at: string
        }
        Insert: {
          coins?: number
          id: string
          pro_until?: string | null
          updated_at?: string
        }
        Update: {
          coins?: number
          id?: string
          pro_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      treehole_posts_public: {
        Row: {
          anon_name: string | null
          content: string | null
          created_at: string | null
          hug_count: number | null
          id: string | null
          media_url: string | null
          mood: string | null
          resonance_count: number | null
        }
        Insert: {
          anon_name?: string | null
          content?: string | null
          created_at?: string | null
          hug_count?: number | null
          id?: string | null
          media_url?: string | null
          mood?: string | null
          resonance_count?: number | null
        }
        Update: {
          anon_name?: string | null
          content?: string | null
          created_at?: string | null
          hug_count?: number | null
          id?: string | null
          media_url?: string | null
          mood?: string | null
          resonance_count?: number | null
        }
        Relationships: []
      }
      user_locations_public: {
        Row: {
          city: string | null
          lat_bucket: number | null
          lng_bucket: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          lat_bucket?: never
          lng_bucket?: never
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          lat_bucket?: never
          lng_bucket?: never
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_campus_invite: {
        Args: {
          p_campus_id: string
          p_expires_in_hours?: number
          p_max_uses?: number
          p_revoke_existing?: boolean
        }
        Returns: {
          campus_id: string
          code: string
          created_at: string
          expires_at: string | null
          id: string
          inviter_id: string
          max_uses: number
          status: string
          uses: number
        }
        SetofOptions: {
          from: "*"
          to: "campus_invites"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_notification: {
        Args: { _payload: Json; _type: string; _user_id: string }
        Returns: undefined
      }
      ensure_wallet: { Args: { _uid: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_campus_member: {
        Args: { _campus_id: string; _user_id: string }
        Returns: boolean
      }
      redeem_campus_invite: { Args: { p_code: string }; Returns: string }
      start_conversation: {
        Args: { partner_id: string; source?: string }
        Returns: string
      }
      wallet_buy_pro: { Args: { _plan: string }; Returns: string }
      wallet_send_gift: {
        Args: {
          _coins: number
          _conv_id: string
          _gift_code: string
          _message: string
          _receiver_id: string
        }
        Returns: string
      }
      wallet_topup: { Args: { _amount: number; _ref?: Json }; Returns: number }
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
