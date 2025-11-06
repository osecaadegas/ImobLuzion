# Real Estate Management System

A comprehensive React TypeScript application for real estate property management with role-based access control.

## 🏗️ System Overview

### **Admin Features (Full Control)**
- **Property Management**: Create, edit, delete property listings
- **Rich Property Forms**: Add photos, detailed descriptions, pricing, and specifications
- **Image Management**: Multiple photos per property with URL-based uploads
- **Property Details**: Complete property information including:
  - Basic info (title, description, price)
  - Location (address, city, state, ZIP)
  - Property specs (bedrooms, bathrooms, sqft, year built, property type)
  - Features and amenities
  - Agent contact information
  - Status management (active, pending, sold, rented)

### **User Features (Read-Only Access)**
- **Property Browsing**: View all active property listings
- **Search & Filter**: Find properties by location, type (sale/rent)
- **Favorites System**: Like/unlike properties (saved locally)
- **Property Details**: View comprehensive property information
- **Agent Contact**: Contact property agents directly
- **Mobile Responsive**: Optimized for all device sizes

## 🔐 Authentication & Access Control

**Demo Accounts:**
- **Admin Access**: `admin@realestate.com` / `admin123`
- **User Access**: `user@example.com` / `user123`

**Role-Based Features:**
- **Admins**: Full CRUD operations on properties
- **Users**: Read-only access to property listings
- **Automatic Routing**: Users/admins redirected to appropriate dashboards

## 🌟 Key Features

### **Property Management (Admin Only)**
- Comprehensive property creation forms
- Multiple image uploads per property
- Rich text descriptions and detailed specifications
- Property status tracking (active, pending, sold, rented)
- Real-time property statistics and analytics
- Property editing and deletion capabilities

### **Property Display (All Users)**
- Beautiful property cards with image galleries
- Detailed property information display
- Location-based search and filtering
- Favorite properties system
- Agent contact integration
- Responsive design for mobile/desktop

### **Technical Features**
- **React 18** with TypeScript for type safety
- **React Router** for navigation and route protection
- **Context API** for authentication and state management
- **Tailwind CSS** for modern, responsive styling
- **Local Storage** for data persistence
- **Role-based access control** throughout the application

## 🚀 Getting Started

**Prerequisites:**
- Node.js (version 18 or higher)
- npm (comes with Node.js)

**Installation:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Access the application:**
- Open `http://localhost:3002/` (or the port shown in terminal)
- Use demo accounts or create new user accounts

## 📁 Project Structure

```
src/
├── components/
│   ├── PropertyCard.tsx      # Enhanced property display component
│   ├── PropertyForm.tsx      # Comprehensive admin property form
│   ├── LoginForm.tsx         # Authentication forms
│   └── Layout.tsx           # Common layout wrapper
├── pages/
│   ├── UserDashboard.tsx    # User property browsing interface
│   └── AdminPanel.tsx       # Admin property management dashboard
├── contexts/
│   └── AuthContext.tsx      # Authentication & user management
├── types/
│   └── Property.ts          # Enhanced property data models
└── App.tsx                  # Main application with routing
```

## 💾 Data Management

- **Properties**: Comprehensive data model with images, descriptions, and specifications
- **Users**: Role-based authentication with admin/user permissions
- **Persistence**: Local storage for user sessions and property data
- **Mock Data**: Pre-populated with sample properties for demonstration

## 🔧 Admin Property Management

**Adding Properties:**
1. Login as admin (`admin@realestate.com` / `admin123`)
2. Navigate to Properties tab
3. Click "Add Property" button
4. Fill comprehensive form with:
   - Property details (title, description, price)
   - Multiple images (via URL)
   - Location information
   - Property specifications
   - Features and amenities
   - Agent contact information

**Managing Properties:**
- Edit existing properties with full form access
- Delete properties with confirmation
- Track property status and statistics
- View comprehensive property table with all details

## 👥 User Experience

**For Regular Users:**
- Browse properties in beautiful card layout
- Search by location or property name
- Filter by sale/rent type
- View detailed property information
- Save favorite properties
- Contact agents directly
- **No editing capabilities** - read-only access

## 🎯 Current Implementation

✅ **Complete Admin Property Management**  
✅ **User-Only Property Viewing**  
✅ **Role-Based Access Control**  
✅ **Comprehensive Property Forms**  
✅ **Image Management System**  
✅ **Search & Filter Functionality**  
✅ **Mobile-Responsive Design**  
✅ **Authentication System**  

## 🔜 Future Enhancements

- Real backend API integration
- Advanced image upload with file handling
- Property analytics and reporting
- Email notifications for agent contacts
- Advanced search with map integration
- Property comparison features

---

**Ready to manage your real estate properties!** 🏠✨