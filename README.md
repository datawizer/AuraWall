# AuraWall - AI Phone Wallpaper Studio (React Native Expo)

Mobile-first AI wallpaper generator with 4 variations, remixing, 1K/2K/4K resolution, aspect ratio control, and live lock screen preview, built with **React Native** and **Expo**.

## Features

- **4-Variation Perspective Generation**: Generates 4 diverse stylistic variations in batch (Atmospheric Wide, Detail & Contrast, Dreamy & Stylized, Dramatic Noir & Shadow).
- **Reference Image Remixing**: Pick any wallpaper variation to use as an aesthetic reference to evolve new creations.
- **Aspect Ratio Control**: Mobile 9:16 portrait default, plus 1:1, 2:3, 3:2, 3:4, 4:3, 16:9, and 21:9 support.
- **Resolution Control (1K, 2K, 4K)**: Standard 1K, crisp 2K HD, and maximum 4K studio retina fidelity.
- **Live Lock Screen Simulation**: Fullscreen preview with dynamic island / notch, live clock & date, status bar, Aura widget, flashlight & camera buttons, and home indicator.
- **Inspirational Vibe Presets & Mood Tags**: Quick-load curated aesthetics (Cyberpunk Lo-Fi, Ghibli Meadow, OLED Noir, Pastel Dream, Cosmic Drift, Tokyo Midnight) and mood tags.
- **Surprise Me Randomizer**: Instant creative vibe generation.
- **Gallery & Favorites**: Persistent storage for wallpaper creations and favorite tracking using AsyncStorage.
- **Device Photo Library & Sharing**: Save high-resolution wallpapers directly to your Photos album or share via system share sheet.
- **Google Gemini AI & Offline Fallback**: Direct integration with Gemini 3 Pro Image and Gemini Nano 2.1, with procedural SVG generation for offline demo mode.

## Project Structure

```
AuraWall/
├── App.tsx                     # Main application component & state management
├── index.ts                    # Expo entry point (registerRootComponent)
├── app.json                    # Expo configuration & app permissions
├── package.json                # React Native Expo dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel preset for Expo
└── src/
    ├── components/
    │   ├── Header.tsx              # Safe-area app header with brand & action buttons
    │   ├── ControlsBar.tsx         # Aspect ratio, quality, & model selectors with bottom sheets
    │   ├── VibeInput.tsx           # Prompt input, remix banner, surprise me, & vibe chips
    │   ├── WallpaperGrid.tsx       # 2x2 responsive variation grid with loading states
    │   ├── WallpaperRenderer.tsx   # Native SVG and image renderer
    │   ├── LightboxModal.tsx       # Fullscreen preview, lock screen mockup, & actions
    │   ├── HistoryDrawer.tsx       # Saved gallery and favorites modal
    │   └── SettingsModal.tsx       # Studio specs & Gemini API key configuration
    ├── services/
    │   ├── geminiService.ts        # Client-side Google Gemini image generation & SVG fallback
    │   ├── storageService.ts       # AsyncStorage persistence for history, favorites, & settings
    │   └── mediaService.ts         # MediaLibrary saving, FileSystem handling, & Sharing
    └── utils/
        ├── wallpaper-engine.ts     # Core types, prompt diversifier, SVG engine, & helpers
        └── wallpaper-engine.test.ts # Unit tests for wallpaper engine logic
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device, or a mobile emulator.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Configure your Gemini API Key in `.env`:
   ```bash
   EXPO_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
   ```
   *You can also set your API key directly inside the app under Settings.*

### Running the App

Start the Expo development server:
```bash
npm start
```

- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
- Press `a` in the terminal to run on Android Emulator.
- Press `i` to run on iOS Simulator.
- Press `w` to run on Web.

### Running Tests

Run unit tests for wallpaper engine logic:
```bash
npm test
```
