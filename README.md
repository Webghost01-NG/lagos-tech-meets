# 🇳🇬 Lagos Tech Meets

> The go-to platform for tech meetups, hackathons, and developer events across Nigeria. Create events, RSVP, view venues on a map, and get browser reminders before events start.

![React](https://img.shields.io/badge/React-18-blue) ![Firebase](https://img.shields.io/badge/Firebase-10-orange) ![Redux](https://img.shields.io/badge/Redux_Toolkit-2-purple) ![Leaflet](https://img.shields.io/badge/Leaflet-Map-green) ![Styled Components](https://img.shields.io/badge/Styled_Components-6-pink)

---

## ✨ Features

- 🔐 **Auth** — Register & login with Firebase Authentication
- 📅 **Create Events** — Title, description, date, time, location, category
- ✏️ **Edit & Delete** — Organizers manage their own events
- 🌍 **Public Feed** — Browse all events with search + filter (category, city, upcoming/past)
- 🗺️ **Map View** — Event venue shown on an interactive Leaflet map
- ✅ **RSVP System** — One-click RSVP with real-time attendee count
- 🔔 **Browser Notifications** — Reminder fires 1 hour before your RSVPed event
- 🔗 **Shareable Links** — Share any event via Web Share API or clipboard copy
- 📊 **Dashboard** — View your created events and your RSVPs in one place
- 📱 **Fully Responsive** — Mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| Backend & Auth | Firebase (Firestore + Authentication) |
| Maps | Leaflet + React-Leaflet |
| Styling | Styled Components |
| Icons | React Icons |

---

## 🚀 Getting Started

### 1. Clone & install
```bash
git clone https://github.com/Webghost01-NG/lagos-tech-meets
cd lagos-tech-meets
npm install
```

### 2. Set up Firebase
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database** → Start in test mode → choose region (e.g. `europe-west1`)
5. Go to Project Settings → Your Apps → Add Web App → copy config

### 3. Configure environment variables
```bash
cp .env.example .env
# Fill in your Firebase config values
```

### 4. Add Firestore Composite Indexes
Go to Firebase Console → Firestore → **Indexes** → Add:

| Collection | Field 1 | Field 2 |
|---|---|---|
| `events` | `organizerUid` (ASC) | `date` (ASC) |
| `events` | `date` (ASC) | *(single field index — auto-created)* |

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
src/
├── app/              # Redux store
├── components/       # Navbar, EventCard, MapView, Spinner, ProtectedRoute
├── features/
│   ├── auth/         # authSlice
│   ├── events/       # eventsSlice
│   └── rsvp/         # rsvpSlice
├── firebase/         # Firebase config
├── hooks/            # useAuth, useNotification
├── pages/
│   ├── auth/         # Login, Register
│   ├── events/       # EventsPage, EventDetail, CreateEvent, EditEvent
│   └── dashboard/    # Dashboard
├── styles/           # GlobalStyles + theme
└── utils/            # formatDate helpers
```

---


## 🔥 Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.organizerUid;
    }
    match /rsvps/{rsvpId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## 🗺️ Adding Map Coordinates

When creating an event, you can optionally add latitude and longitude for the map view:
1. Go to [latlong.net](https://www.latlong.net/)
2. Search your venue address
3. Copy the lat/lng values into the form

**Example Lagos coordinates:**
- CcHub Yaba: `6.5040, 3.3792`
- Lekki Phase 1: `6.4418, 3.4785`
- Victoria Island: `6.4281, 3.4219`

---


## 📄 License

MIT
