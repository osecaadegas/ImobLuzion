# 🚀 Real Estate App Deployment Guide

## Option 1: Vercel + PlanetScale (Recommended for Production)

### Step 1: Prepare Your App for Production

1. **Build optimization**:
```bash
npm run build
```

2. **Add environment variables** (create `.env.local`):
```env
VITE_DATABASE_URL=your_planetscale_connection_string
VITE_API_URL=your_api_endpoint
```

### Step 2: Database Setup with PlanetScale

1. **Sign up**: Go to [planetscale.com](https://planetscale.com)
2. **Create database**: Click "Create database" → Name it "real-estate-app"
3. **Get connection string**: Copy the connection URL
4. **Create tables**:
```sql
CREATE TABLE properties (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  location_address VARCHAR(500),
  location_city VARCHAR(100),
  location_state VARCHAR(100),
  bedrooms INT,
  bathrooms INT,
  sqft INT,
  property_type ENUM('apartment', 'house', 'condo', 'townhouse', 'villa'),
  type ENUM('sale', 'rent'),
  status ENUM('active', 'pending', 'sold', 'rented'),
  purchase_price DECIMAL(12,2),
  project_costs DECIMAL(12,2),
  sold_price DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Add environment variables** in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add your database URL and other secrets

---

## Option 2: Netlify + Supabase (Best for Full-Stack)

### Step 1: Setup Supabase Database

1. **Sign up**: Go to [supabase.com](https://supabase.com)
2. **Create project**: New project → "real-estate-app"
3. **Get credentials**: Settings → API → Copy URL and anon key
4. **Create tables** in SQL Editor:
```sql
-- Properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  location JSONB,
  details JSONB,
  features TEXT[],
  type TEXT CHECK (type IN ('sale', 'rent')),
  status TEXT CHECK (status IN ('active', 'pending', 'sold', 'rented')),
  financials JSONB,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (Supabase Auth handles this automatically)
```

### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Deploy to Netlify

1. **Build the app**:
```bash
npm run build
```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop your `dist` folder
   - Or connect your GitHub repo for auto-deploy

---

## Option 3: Railway (Simplest All-in-One)

### Step 1: Deploy Everything to Railway

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **Deploy from GitHub**:
   - Connect your GitHub account
   - Select your repository
   - Railway auto-detects it's a Vite app

3. **Add PostgreSQL**:
   - In your project → Add service → PostgreSQL
   - Railway provides connection details automatically

### Step 2: Configure Environment Variables

Railway automatically sets:
- `DATABASE_URL` for PostgreSQL
- `PORT` for your app

---

## 🔧 Code Changes Needed for Database Integration

### 1. Create API Layer

Create `src/lib/database.ts`:
```typescript
// For Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Property operations
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
  
  if (error) throw error
  return data
}

export const createProperty = async (property: any) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()
  
  if (error) throw error
  return data[0]
}
```

### 2. Update PropertyContext

Replace mock data with real API calls:
```typescript
// In PropertyContext.tsx
import { getProperties, createProperty } from '../lib/database'

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await getProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // ... rest of the context
}
```

---

## 📱 **My Recommendation for You**

**Start with Vercel + Supabase** because:
- ✅ **Free forever** for small apps
- ✅ **Real-time database** with Supabase
- ✅ **Built-in authentication** system
- ✅ **Easy file storage** for property images
- ✅ **Automatic backups** and scaling
- ✅ **Great developer experience**

### Quick Start Steps:
1. Push your code to GitHub
2. Sign up for Supabase → Create database
3. Sign up for Vercel → Connect GitHub repo
4. Add Supabase credentials to Vercel environment variables
5. Deploy! 🎉

### Monthly Costs:
- **Development**: $0
- **Small production app**: $0
- **Growing app**: $25-50/month when you need more resources

Would you like me to help you set up any of these options? I can create the database schema and API integration code for your specific choice!