# Google Calendar Integration Setup Guide

## Overview

Your Personal Dashboard now includes a comprehensive calendar widget that can integrate with Google Calendar to display your Samsung Calendar events (if synced with Google). Here's how to set it up:

## Prerequisites

1. **Samsung Calendar Sync**: First, ensure your Samsung Calendar is syncing with Google Calendar
   - Open Samsung Calendar app on your phone
   - Go to **Settings** → **Accounts** → **Add Account** or manage existing Google account
   - Enable sync for Calendar
   - Your Samsung events will now appear in Google Calendar

## Google Calendar API Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Give your project a name (e.g., "Personal Dashboard Calendar")
4. Click **"Create"**

### Step 2: Enable the Calendar API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and press **"Enable"**

### Step 3: Create API Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key - you'll need this for your dashboard
4. **Important**: Restrict your API key:
   - Click on the API key you just created
   - Under **"API restrictions"**, select **"Restrict key"**
   - Choose **"Google Calendar API"**
   - Under **"Website restrictions"**, add your domain if hosting online
   - Click **"Save"**

### Step 4: Make Your Calendar Public (Required for API Access)

**Option A: Make Primary Calendar Public**
1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left sidebar, find your calendar and click the three dots (⋮)
3. Select **"Settings and sharing"**
4. Scroll to **"Access permissions"**
5. Check **"Make available to public"**
6. Set visibility to **"See all event details"**

**Option B: Create a Separate Public Calendar (Recommended)**
1. In Google Calendar, click **"+"** next to **"Other calendars"**
2. Select **"Create new calendar"**
3. Name it (e.g., "Dashboard Events")
4. Make it public following Option A steps above
5. Move or copy important events to this calendar

### Step 5: Get Your Calendar ID

1. In Google Calendar settings (from Step 4)
2. Scroll to **"Integrate calendar"**
3. Copy the **"Calendar ID"** - it usually looks like an email address
4. For primary calendar, it's typically your Gmail address

## Dashboard Configuration

### Step 6: Configure Your Dashboard

1. Open your Personal Dashboard
2. Click the **Settings** button (⚙️) in the footer
3. In the settings modal, fill in:
   - **Google Calendar ID**: Paste the Calendar ID from Step 5
   - **Google API Key**: Paste the API key from Step 3
4. Click **"Save Settings"**

### Step 7: Sync Your Calendar

1. In the Calendar widget, click **"Sync with Google Calendar"**
2. Your events should now appear in the dashboard
3. The calendar will show:
   - Your Google Calendar events in the upcoming events list
   - Days with events marked on the monthly calendar
   - Real-time sync when you click the sync button

## Features

### What You Can Do

- **View Events**: See upcoming events from your Google Calendar
- **Add Local Events**: Create events directly in the dashboard
- **Monthly Calendar**: Visual calendar with event indicators
- **Automatic Sync**: Manual sync with Google Calendar
- **Color Coding**: Different colors for different event types
- **Event Details**: View event descriptions and times

### Limitations

- **Read-Only Google Events**: You can view Google Calendar events but not edit them from the dashboard
- **Manual Sync**: Events don't auto-sync; you need to click the sync button
- **Public Calendar Required**: Google Calendar must be public for API access

## Troubleshooting

### Common Issues

**"Failed to sync Google Calendar"**
- Check your API key is correct and properly restricted
- Ensure your calendar is public
- Verify the Calendar ID matches your actual calendar
- Check browser console for detailed error messages

**"No events showing"**
- Make sure your calendar has events in the next 30 days
- Verify Samsung Calendar is syncing with Google Calendar
- Check that the correct calendar ID is being used

**"API quota exceeded"**
- Google Calendar API has daily limits (usually sufficient for personal use)
- If exceeded, wait 24 hours or create a new project

### Security Notes

- **API Key Security**: Never share your API key publicly
- **Calendar Privacy**: Remember that making a calendar public means anyone with the link can view it
- **Consider**: Use a separate calendar for dashboard sync to maintain privacy

## Alternative: Manual Event Management

If you prefer not to use Google Calendar API, you can:
1. Use the **"Add Event"** button to manually create events
2. These will be stored locally in your browser
3. You'll have full control over event management
4. Events will sync across browser sessions on the same device

## Support

For issues with:
- **Google API Setup**: Check [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- **Samsung Calendar Sync**: Check your Samsung account settings
- **Dashboard Issues**: Check browser console for error messages

Enjoy your new integrated calendar dashboard! 📅