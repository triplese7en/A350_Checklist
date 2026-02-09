# A350 AIDE MEMOIRE - Analytics Guide

## 📊 User Analytics Feature

Your A350 Aide Memoire now includes **privacy-friendly analytics** to track usage without collecting any personal information.

### How It Works

1. **Anonymous Tracking**: Each user gets a random UUID stored in their browser's localStorage
2. **No Personal Data**: No names, emails, IPs, or identifying information is collected
3. **Local Storage**: All data is stored locally in each user's browser
4. **One Count Per User**: Same user returning multiple times counts as 1 unique user

### What Gets Tracked

- **Unique Users**: Total number of different people who've used the app
- **Total Visits**: Total number of times the app has been opened
- **Average Visits/User**: How many times each user visits on average
- **Active Users (30d)**: Users who've visited in the last 30 days
- **First/Last Visit**: When the app was first and last accessed

### Viewing Analytics

#### Method 1: Secret Keyboard Shortcut (Admin Only) 🔐
Press **Ctrl+Shift+A** (Windows/Linux) or **Cmd+Shift+A** (Mac)
- Opens the hidden analytics dashboard
- Not visible to regular users
- Perfect for admin/developer access only

#### Method 2: Browser Console
Open browser console (F12) and type:
```javascript
getAnalyticsStats()
```

This will display:
```
📊 ===== A350 AIDE MEMOIRE ANALYTICS =====
👥 Unique Users: 5
📈 Total Visits: 23
📊 Avg Visits/User: 4.60
✅ Active Users (30d): 5
🕐 First Visit Ever: 2024-02-09T10:30:00.000Z
🕐 Last Visit: 2024-02-09T15:45:00.000Z
=========================================
```

### Important Notes

⚠️ **Limitation**: This analytics only tracks users who use the same browser/device. Since data is stored in localStorage:
- Different browsers = different count
- Private/Incognito mode = separate count
- Clearing browser data = resets the user's ID

💡 **Privacy**: This is completely privacy-friendly. No data leaves the user's device. Perfect for personal/organizational use.

### For Developers

#### Reset Analytics (Testing)
```javascript
resetAnalytics()
```

#### Manual Data Inspection
```javascript
// View raw analytics data
console.log(localStorage.getItem('a350_analytics'))

// View your user ID
console.log(localStorage.getItem('a350_user_id'))
```

### Technical Details

**Storage Keys:**
- `a350_analytics`: Stores all usage data
- `a350_user_id`: Stores the anonymous user identifier

**Data Structure:**
```json
{
  "users": {
    "uuid-1234": {
      "firstVisit": "2024-02-09T10:30:00.000Z",
      "lastVisit": "2024-02-09T15:45:00.000Z",
      "visitCount": 5
    }
  },
  "totalVisits": 23
}
```

## 🚀 Installation

Upload all files to your web server:
- `index.html`
- `app.js`
- `styles.css`
- `service-worker.js`
- `manifest.json`
- `A350XWB-carbon.png`

## 📝 Features

- ✅ Cockpit preparation checklist
- ✅ Cruise procedures
- ✅ Descent checklist
- ✅ Progress tracking
- ✅ Scratchpad with notes & drawing
- ✅ Apple Pencil support
- ✅ Timer/countdown
- ✅ Offline support (PWA)
- ✅ **Privacy-friendly analytics** 📊

## 📱 PWA Installation

The app can be installed as a Progressive Web App on iOS/Android:
1. Open in Safari/Chrome
2. Tap "Share" → "Add to Home Screen"
3. Use like a native app, works offline!

---

**Made for pilots, by pilots.** ✈️
