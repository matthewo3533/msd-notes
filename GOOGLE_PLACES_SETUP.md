# Google Places API Setup for Petrol Calculator

This guide explains how to set up Google Places API for the location-based distance calculation feature in the petrol calculator.

## Features Added

- **Location-based Distance Calculation**: Users can enter "from" and "to" locations instead of manually entering distance
- **Google Places Autocomplete**: Smart location suggestions as users type (New Zealand locations only)
- **Business & Establishment Search**: Search for specific places like McDonald's, restaurants, shops, and other businesses
- **Automatic Distance Calculation**: Calculates actual road distance using Google's Distance Matrix API
- **Request Optimization**: Caches distance calculations to minimize API calls
- **CORS-Free**: Uses Google's official JavaScript library to avoid CORS issues
- **Secure**: API key is stored in environment variables, not exposed in source code
- **Smart Layout**: Form automatically adjusts to make space for location suggestions
- **New Zealand Restriction**: Address suggestions are limited to New Zealand locations only
- **Real Road Distance**: Provides actual driving distance, not straight-line distance

## Setup Instructions

### 1. Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Go to "Credentials" and create an API key
5. Restrict the API key to:
   - Only the APIs you enabled
   - Your website's domain (for security)

### 2. Configure API Key (SECURE METHOD - RECOMMENDED)

**⚠️ IMPORTANT: Never commit your API key to version control!**

1. Create a `.env` file in your project root (this file should already be in .gitignore):
   ```bash
   # .env file
   VITE_GOOGLE_API_KEY=your_actual_api_key_here
   ```

2. Replace `your_actual_api_key_here` with your actual Google Places API key

3. The component will automatically read the API key from the environment variable

### 3. Alternative: Hardcoded Key (NOT RECOMMENDED for production)

If you must hardcode the key (not recommended), you can modify the component:

1. Open `src/components/PetrolCalculator.tsx`
2. Find this line:
   ```typescript
   const GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
   ```
3. Replace it with:
   ```typescript
   const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';
   ```

**⚠️ WARNING: This exposes your API key in the source code and to all users!**

## Security Best Practices

- ✅ **Use environment variables** (.env file)
- ✅ **Add .env to .gitignore** to prevent accidental commits
- ✅ **Restrict API key** to specific domains in Google Cloud Console
- ✅ **Monitor API usage** in Google Cloud Console
- ❌ **Never commit API keys** to version control
- ❌ **Never expose API keys** in client-side code for production

## How It Works

The component automatically loads Google's JavaScript library when it mounts:

1. **Dynamic Script Loading**: Loads Google Maps JavaScript API with Places library
2. **Service Initialization**: Creates AutocompleteService, PlacesService, Geocoder, and DistanceMatrixService instances
3. **User Input**: User types in "from" and "to" locations (can be addresses, business names, or points of interest)
4. **Autocomplete**: Google Places API provides location suggestions including businesses, establishments, geographic locations, and points of interest (debounced for performance, New Zealand only)
5. **Location Selection**: User selects from suggestions
6. **Distance Calculation**: Uses Google's Distance Matrix API to get actual road distance between locations
7. **Caching**: Stores result to avoid future API calls for same route
8. **Smart Layout**: Form automatically adjusts height to accommodate suggestions

## New Zealand Location Restriction

The component is configured to only show locations within New Zealand:

- **Country Code**: Uses `componentRestrictions: { country: 'nz' }` in the Places API
- **Benefits**: 
  - Faster, more relevant suggestions for NZ users
  - Reduced API costs (fewer irrelevant results)
  - Better user experience for local travel planning

## API Usage & Costs

### Free Tier Limits
- **Places API**: 1,000 requests per month
- **Maps JavaScript API**: 28,500 map loads per month

### Request Optimization Features
- **Caching**: Distance calculations are cached to avoid repeated API calls
- **Distance Matrix API**: Uses Google's Distance Matrix API for accurate road distance calculation
- **Debounced Search**: Only searches after user stops typing for 300ms
- **JavaScript Library**: No CORS issues, better performance

### Cost Breakdown
- **Place Autocomplete**: 1 request per search
- **Distance Matrix**: 1 request per route calculation
- **Total per route calculation**: 2 requests (from + to locations) + 1 distance calculation

## Troubleshooting

### Common Issues

1. **"Google Places API key not found"**
   - Create a `.env` file in your project root
   - Add `VITE_GOOGLE_API_KEY=your_key_here` to the file
   - Restart your development server

2. **"Google Places API not loaded yet"**
   - Wait a moment for the script to load
   - Check if your API key is correct
   - Ensure Places API and Maps JavaScript API are enabled

3. **"Request denied"**
   - Verify API key restrictions
   - Check if you've exceeded quota limits
   - Ensure billing is enabled for your Google Cloud project

4. **No suggestions appearing**
   - Ensure API key is correctly set in .env file
   - Check browser console for errors
   - Verify all required APIs are enabled

5. **Location suggestions appear behind other elements**
   - The z-index has been increased to 9999 to fix this issue
   - If problems persist, check for conflicting CSS

6. **Location suggestions overlap with other form fields**
   - The form now automatically adjusts its layout when suggestions appear
   - A dynamic spacer pushes content down to make room for suggestions
   - The active input automatically scrolls into view when suggestions appear

### Testing

1. **Set up your environment variable**:
   ```bash
   # Create .env file in project root
   echo "VITE_GOOGLE_API_KEY=your_actual_key" > .env
   ```

2. **Start your development server**: `npm run dev`

3. **Navigate to the Petrol Calculator**

4. **Check "Calculate distance from locations"**

5. **Type in a location** (e.g., "Auckland")

6. **Wait for suggestions** to appear (should appear above all other elements)

7. **Select from suggestions**

8. **Repeat for destination**

9. **Click "Calculate Distance"**

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key and permissions
3. Check Google Cloud Console for quota usage
4. Ensure all required APIs are enabled
5. Make sure you're using the latest version of the component
6. Verify your `.env` file is in the project root and contains the correct API key

## Migration from Hardcoded API Key

If you were previously using a hardcoded API key, the new implementation:

- ✅ Keeps your API key secure and hidden from users
- ✅ Follows security best practices
- ✅ Makes it easy to use different keys for different environments
- ✅ Prevents accidental exposure in version control
