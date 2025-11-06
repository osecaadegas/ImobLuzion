# Google Maps Setup Guide

This guide will help you set up Google Maps integration for your real estate application.

## Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps Embed API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps Embed API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## Step 2: Secure Your API Key (Recommended)

1. Click on your API key in the credentials page
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your website domains:
     - `localhost:*` (for development)
     - `yourdomain.com/*` (for production)
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Maps Embed API"
4. Save your changes

## Step 3: Configure Your Application

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Important:** Add `.env` to your `.gitignore` file to keep your API key private:
   ```
   .env
   ```

## Step 4: Restart Your Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## What You Get

✅ **Embedded Google Maps** on property detail pages
✅ **Interactive map** showing exact property location
✅ **Direct link** to open in Google Maps app
✅ **Fallback display** if API key is not configured

## Pricing Note

- Google Maps Embed API is **free** up to certain usage limits
- Check [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/) for details
- Most small to medium real estate sites stay within free tier limits

## Troubleshooting

### Map not showing?

1. Check that your `.env` file exists and has the correct key
2. Verify the API key has Maps Embed API enabled
3. Check browser console for any error messages
4. Ensure you restarted the dev server after adding the key

### "For development purposes only" watermark?

This appears when using an unrestricted API key. Follow Step 2 to add restrictions.

### Need help?

Check the [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/embed/get-started)
