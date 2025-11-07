import { createClient } from '@supabase/supabase-js'
import { SafeStorage } from './storage.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase configuration is working properly

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create a bulletproof storage adapter for Supabase that NEVER accesses browser storage
const supabaseStorageAdapter = {
  getItem: () => null,  // Always return null - never attempt storage access
  setItem: () => {},    // Always do nothing - never attempt storage access  
  removeItem: () => {}  // Always do nothing - never attempt storage access
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    storageKey: 'disabled',
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

// Types for our database
export interface DatabaseProperty {
  id: string
  title: string
  description?: string
  price: number
  location: {
    address?: string
    city: string
    state?: string
    zipCode?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  details: {
    bedrooms: number
    bathrooms: number
    sqft: number
    propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'other'
    yearBuilt?: number
  }
  features: string[]
  amenities?: string[]
  type: 'sale' | 'rent'
  status: 'active' | 'pending' | 'sold' | 'rented'
  financials?: {
    purchasePrice?: number
    projectCosts?: number
    totalInvestment?: number
    soldPrice?: number
    profit?: number
    profitMargin?: number
  }
  images: string[]
  sold_date?: string
  listed_date: string
  updated_date: string
  is_archived: boolean
  agent?: {
    name?: string
    email?: string
    phone?: string
  }
  created_at: string
}

export interface UserProfile {
  id: string
  name: string
  role: 'admin' | 'user' | 'agent'
  created_at: string
  updated_at: string
}