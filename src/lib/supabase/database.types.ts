export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          account_id: string
          instrument_type: string
          direction: string
          symbol: string
          entry_date: string
          entry_time: string
          exit_date: string
          exit_time: string
          entry_price: number | null
          exit_price: number | null
          quantity: number | null
          realized_pl: number | null
          commission: number
          timeframe: string
          emotional_state: string
          strategy: string | null
          setup: string | null
          notes: string | null
          entry_screenshot: string | null
          exit_screenshot: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          instrument_type: string
          direction: string
          symbol: string
          entry_date: string
          entry_time: string
          exit_date: string
          exit_time: string
          entry_price?: number | null
          exit_price?: number | null
          quantity?: number | null
          realized_pl?: number | null
          commission: number
          timeframe: string
          emotional_state: string
          strategy?: string | null
          setup?: string | null
          notes?: string | null
          entry_screenshot?: string | null
          exit_screenshot?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          instrument_type?: string
          direction?: string
          symbol?: string
          entry_date?: string
          entry_time?: string
          exit_date?: string
          exit_time?: string
          entry_price?: number | null
          exit_price?: number | null
          quantity?: number | null
          realized_pl?: number | null
          commission?: number
          timeframe?: string
          emotional_state?: string
          strategy?: string | null
          setup?: string | null
          notes?: string | null
          entry_screenshot?: string | null
          exit_screenshot?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          number: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          number: string
          balance: number
          currency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          number?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          type: string
          amount: number
          date: string
          time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          type: string
          amount: number
          date: string
          time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          type?: string
          amount?: number
          date?: string
          time?: string
          created_at?: string
          updated_at?: string
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          rules: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          rules?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          rules?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}