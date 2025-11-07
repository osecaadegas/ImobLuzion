import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}