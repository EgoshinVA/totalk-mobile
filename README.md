# ToTalk — Mobile

> Voice-first task manager. Hold to record, release — task created.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | Expo Router (file-based) |
| State | Redux Toolkit + redux-persist |
| API | RTK Query |
| Audio | react-native-live-audio-stream |
| Notifications | expo-notifications |
| Storage | AsyncStorage (settings), SecureStore (tokens) |
| UI | Custom design system, lucide-react-native |
| Graphics | @shopify/react-native-skia |

## How it works

### Voice recording flow
1. User holds the record button
2. App requests microphone permission (Android: `RECORD_AUDIO`)
3. `LiveAudioStream` streams PCM chunks via **WebSocket** to backend
4. On release — sends `END_OF_STREAM` signal
5. Server responds with `{ type: "task_created", payload: Task }`
6. Task list auto-refreshes via RTK Query cache invalidation
7. Push notification scheduled via `expo-notifications`

### Auth flow
1. 3-step registration (email → profile → avatar)
2. JWT access token stored in Redux
3. Refresh token stored in `expo-secure-store`
4. Auto-refresh on 401 via RTK Query `baseQueryWithReauth`
5. Session restored on app launch via `useSession` hook

### Offline persistence
- User settings persisted via `redux-persist` + AsyncStorage
- Notification IDs stored in AsyncStorage for rescheduling

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli eas-cli`
- Android device or emulator

### 1. Clone and install

```bash
git clone https://github.com/yourname/totalk-mobile
cd totalk-mobile
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

```env
BASE_API=http://YOUR_LOCAL_IP:8080/api/v1
EXPO_PUBLIC_WS_URL=ws://YOUR_LOCAL_IP:8080/api/v1
```

Replace `YOUR_LOCAL_IP` with your machine's local IP (e.g. `192.168.1.100`).

### 3. Start development server

```bash
npx expo start
```

> **Note:** Native modules (`react-native-live-audio-stream`, `expo-notifications`) require a development build — they won't work in Expo Go.

### 4. Build development APK

```bash
eas build --profile development --platform android
```

Install the APK on your device, then use `npx expo start` for hot reload.

## Building for production

```bash
eas build --profile production --platform android
```

## Project structure decisions

### Why FSD (Feature-Sliced Design)?
Clear separation of concerns — entities don't depend on features, features don't depend on pages. Easy to scale and onboard new developers.

### Why RTK Query over plain axios?
Built-in caching, automatic re-fetching, optimistic updates, and seamless integration with Redux for token management.

### Why PagerView over React Navigation tabs?
Smooth native swipe animation between tabs while keeping full control over the tab bar design. `scrollEnabled={false}` prevents conflicts with card swipe gestures.

### Why WebSocket over HTTP for audio?
Real-time streaming — audio chunks are sent as they're recorded, not after. Reduces latency and enables progress feedback.

## Key features

- 🎙️ **Voice-to-task** — speak naturally, AI extracts title, time, recurrence
- 🔔 **Smart notifications** — remind N minutes before task time (configurable)
- ✅ **Task management** — complete, edit, delete with swipe gestures
- 🌙 **Dark theme** — purple accent, designed for night use
- 🌍 **Multi-language** — English, Russian, and 6 more languages
- 📱 **Haptic feedback** — vibration on record start and task creation

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BASE_API` | Backend REST API base URL |
| `EXPO_PUBLIC_WS_URL` | WebSocket base URL |