# Personal Dashboard

A beautiful, responsive personal dashboard built with HTML, CSS, and JavaScript. Features weather updates, daily quotes, to-do list management, quick links, news updates, and system information.

![Dashboard Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Personal+Dashboard)

## 🌟 Features

### 📅 **Time & Date**
- Live clock with customizable seconds display
- Current date with day of the week
- Personalized greeting based on time of day

### 🌤️ **Weather Widget**
- **Live weather data** from multiple APIs (wttr.in, Open-Meteo)
- Current weather conditions for any city
- Temperature, humidity, and wind speed
- Accurate weather icons based on real conditions
- Automatic fallback between APIs for reliability
- Error handling with user-friendly messages

### 💭 **Quote of the Day**
- Inspirational daily quotes
- Refresh button for new quotes
- Uses quotable.io API with fallback quotes

### ✅ **To-Do List**
- Add, complete, and delete tasks
- Local storage persistence
- Task counter
- Clear completed tasks
- Keyboard shortcuts (Enter to add)

### 🔗 **Quick Links**
- **GitHub, Messenger, Discord, Steam**
- **WhatsApp, Google Docs** - all your favorites
- Modern icons with hover effects
- Easy customization and quick access

### 📰 **News Widget**
- **Customizable news updates**
- Local and international news
- Article titles, descriptions, and sources
- Regularly updated content

### 💻 **System Information**
- Browser detection
- Session time tracking
- Online/offline status
- Real-time updates

### 🎨 **Customization**
- Light/Dark theme toggle
- Personalized user name
- Customizable refresh intervals
- Settings modal with preferences
- Responsive design for all devices

## 🚀 Quick Start

1. **Download/Clone** this repository
2. **Open** `index.html` in any modern web browser
3. **Customize** your settings by clicking the Settings button
4. **Enjoy** your personalized dashboard!

## 📁 File Structure

```
Personal Dashboard/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and themes
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## 🔧 Setup & Configuration

### **Weather API (Built-in)**
The dashboard uses **real weather data** with automatic fallback:

1. **Primary**: wttr.in API (no key required)
2. **Fallback**: Open-Meteo API (free, no registration)
3. **Reliability**: Automatic switching between APIs if one fails
4. **No setup required**: Works out of the box with live data

### **News Content (Customizable)**
The dashboard includes curated news content:

1. **Customizable**: Set your location and interests
2. **No API required**: Content is pre-configured
3. **Easily customizable**: Update news items in `script.js`
4. **Future enhancement**: Can be extended with live news feeds

### **Customization**
- **Colors**: Edit CSS variables in `styles.css` (lines 2-15)
- **Quick Links**: Currently set to GitHub, Messenger, Discord, Steam, WhatsApp, Google Docs
- **Default City**: Set to "Your City" in `script.js` with real weather data
- **Quote Categories**: Modify the quotes array for different inspiration
- **News Content**: Update news items in the script

## 🎯 Usage

### **First Time Setup**
1. Click the **Settings** button (⚙️)
2. Enter your name
3. Set your preferred refresh interval
4. Choose your preferences
5. Click **Save Settings**

### **Daily Use**
- **Weather**: Enter a city name and click refresh
- **Quotes**: Click "New Quote" for inspiration
- **Tasks**: Type in the input field and press Enter
- **Theme**: Toggle between light and dark modes
- **Links**: Click any quick link to open in a new tab

### **Keyboard Shortcuts**
- `Enter` in todo input: Add new task
- `Enter` in city input: Update weather
- `Esc`: Close settings modal

## 📱 Responsive Design

The dashboard adapts to different screen sizes:

- **Desktop**: Full grid layout with all widgets
- **Tablet**: Responsive grid with optimized spacing
- **Mobile**: Single column layout with touch-friendly controls

## 🔄 Auto-Refresh

- **Clock**: Updates every second
- **Weather & News**: Updates based on refresh interval (default: 10 minutes)
- **Session Time**: Updates every second
- **Configurable**: Change interval in settings

## 💾 Data Storage

All data is stored locally in your browser:

- **Settings**: `localStorage.dashboardSettings`
- **Tasks**: `localStorage.dashboardTodos`
- **No server required**: Everything runs locally

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🛠️ Advanced Customization

### **Adding New Widgets**
1. Add HTML structure in `index.html`
2. Add styles in `styles.css`
3. Add functionality in `script.js`

### **Custom Themes**
Edit CSS variables in `:root` and `[data-theme="dark"]`:
```css
:root {
  --primary-color: #your-color;
  --background-color: #your-bg;
  /* ... more variables */
}
```

### **API Integration**
Current API usage and expansion options:
- **Weather**: ✅ **Already integrated** - wttr.in + Open-Meteo (live data)
- **News**: Can be extended with NewsAPI, Guardian API, or region-specific feeds
- **Quotes**: Uses Quotable API with local fallbacks

## 🔒 Privacy & Security

- **No data collection**: Everything stays on your device
- **No tracking**: No analytics or external scripts
- **Offline capable**: Works without internet (with cached data)
- **Local storage only**: No server communication required

## 🐛 Troubleshooting

### **Weather not loading:**
- **No API key needed**: Uses free APIs (wttr.in and Open-Meteo)
- Verify internet connection
- Try a different city name or check spelling
- Dashboard automatically tries backup API if primary fails

### **Quotes not updating:**
- Check internet connection for API calls
- Mock quotes will show as fallback

### **Settings not saving:**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again

### **Theme not changing:**
- Hard refresh the page (Ctrl+F5)
- Check browser compatibility

## 🎨 Customization Ideas

- **Personal Photos**: Add background images
- **Custom Links**: Replace quick links with your favorites
- **More Widgets**: Calendar, calculator, notes
- **Different APIs**: Cryptocurrency, stocks, sports scores
- **Animations**: Add CSS animations for interactions

## 📈 Future Enhancements

Potential features to add:
- Calendar integration
- Habit tracker
- Pomodoro timer
- Music player controls
- Cryptocurrency prices
- Social media feeds
- Email integration

## 🤝 Contributing

Want to improve the dashboard?
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- Personal Dashboard
- Created: 2025
- Version: 1.0

---

## 🎉 Enjoy Your Personal Dashboard!

Start your day right with weather updates, stay motivated with daily quotes, keep track of your tasks, and access your favorite sites quickly. Your personal command center awaits!

**Pro Tip**: Set this as your browser's homepage for the best experience!

---

## 🆕 Recent Updates (September 2025)

### **✅ Live Weather Integration**
- **Replaced mock weather data** with real-time weather from wttr.in and Open-Meteo APIs
- **No API keys required** - works immediately out of the box
- **Intelligent fallback system** - automatically switches between APIs for reliability
- **Accurate weather icons** mapped to actual weather conditions
- **Live data indicator** shows green checkmark when displaying real weather

### **🔗 Updated Quick Links**
- **Modernized link collection**: GitHub, Messenger, Discord, Steam, WhatsApp, Google Docs
- **Tailored for productivity and communication** - your daily essentials
- **Easy to customize** - simply update the HTML to add your favorite sites

### **� Localized Content**
- **Weather defaults to your city** - customize in settings
- **Localized experience** while maintaining global functionality

### **🛠️ Technical Improvements**
- **Enhanced error handling** for weather API failures
- **Better weather code mapping** with comprehensive icon sets
- **Improved user feedback** with loading states and error messages
- **Optimized API calls** with proper fallback mechanisms
