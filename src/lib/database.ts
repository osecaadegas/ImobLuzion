// Temporarily disabled for deployment
// Database integration will be added after successful deployment

export const propertyAPI = {
  async getAll() {
    // Return empty array for now
    return []
  },
  
  async getById(_id: string) {
    return null
  },
  
  async create(property: any) {
    return property
  },
  
  async update(_id: string, updates: any) {
    return updates
  },
  
  async delete(_id: string) {
    return
  }
}

export const authAPI = {
  async signUp(_email: string, _password: string, _name: string) {
    return null
  },
  
  async signIn(_email: string, _password: string) {
    return null
  },
  
  async signOut() {
    return
  },
  
  async getCurrentUser() {
    return null
  }
}