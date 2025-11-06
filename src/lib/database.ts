import { supabase, type DatabaseProperty, type UserProfile } from './supabase'
import type { Property } from '../types/Property'

// Helper function to convert database property to app property format
function transformDatabaseProperty(dbProp: DatabaseProperty): Property {
  return {
    id: dbProp.id,
    title: dbProp.title,
    description: dbProp.description || '',
    price: dbProp.price,
    location: {
      address: dbProp.location.address,
      city: dbProp.location.city,
      state: dbProp.location.state,
      zipCode: dbProp.location.zipCode,
      coordinates: dbProp.location.coordinates
    },
    details: {
      bedrooms: dbProp.details.bedrooms,
      bathrooms: dbProp.details.bathrooms,
      sqft: dbProp.details.sqft,
      propertyType: dbProp.details.propertyType,
      yearBuilt: dbProp.details.yearBuilt
    },
    features: dbProp.features,
    type: dbProp.type,
    status: dbProp.status,
    financials: dbProp.financials,
    images: dbProp.images,
    soldDate: dbProp.sold_date,
    listedDate: dbProp.listed_date,
    updatedDate: dbProp.updated_date,
    isArchived: dbProp.is_archived,
    agent: dbProp.agent
  }
}

// Helper function to convert app property to database format
function transformPropertyToDatabase(property: Omit<Property, 'id'>): Omit<DatabaseProperty, 'id' | 'created_at' | 'listed_date' | 'updated_date'> {
  return {
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    details: property.details,
    features: property.features,
    amenities: [],
    type: property.type,
    status: property.status,
    financials: property.financials || {},
    images: property.images,
    sold_date: property.soldDate,
    is_archived: property.isArchived || false,
    agent: property.agent || {}
  }
}

export const propertyAPI = {
  async getAll(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      return data ? data.map(transformDatabaseProperty) : []
    } catch (error) {
      console.error('Error fetching properties:', error)
      return []
    }
  },

  async getById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      return data ? transformDatabaseProperty(data) : null
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    }
  },

  async create(property: Omit<Property, 'id'>): Promise<Property | null> {
    try {
      const dbProperty = transformPropertyToDatabase(property)
      
      const { data, error } = await supabase
        .from('properties')
        .insert([dbProperty])
        .select()
        .single()

      if (error) throw error
      
      return data ? transformDatabaseProperty(data) : null
    } catch (error) {
      console.error('Error creating property:', error)
      return null
    }
  },

  async update(id: string, updates: Partial<Property>): Promise<Property | null> {
    try {
      const dbUpdates = {
        ...updates,
        updated_date: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      return data ? transformDatabaseProperty(data) : null
    } catch (error) {
      console.error('Error updating property:', error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      return true
    } catch (error) {
      console.error('Error deleting property:', error)
      return false
    }
  },

  async getSoldProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('status', ['sold', 'rented'])
        .order('sold_date', { ascending: false })

      if (error) throw error
      
      return data ? data.map(transformDatabaseProperty) : []
    } catch (error) {
      console.error('Error fetching sold properties:', error)
      return []
    }
  },

  async markAsSold(id: string, soldPrice: number): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          status: 'sold',
          sold_date: new Date().toISOString(),
          financials: {
            soldPrice: soldPrice
          }
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      return data ? transformDatabaseProperty(data) : null
    } catch (error) {
      console.error('Error marking property as sold:', error)
      return null
    }
  }
}

export const authAPI = {
  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) throw error
      
      return data.user
    } catch (error) {
      console.error('Error signing up:', error)
      return null
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      return data.user
    } catch (error) {
      console.error('Error signing in:', error)
      return null
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error signing out:', error)
      return false
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }
}