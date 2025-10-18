# COW Voice Synthesis - Advanced Text to Speech

A professional text-to-speech application using the same voice configuration from the MyCow app onboarding flow, fully branded with COW Group's design system.

## Features

### Core Features ✅
- **Unlimited Text Input**: No character or word limits
- **Two Professional Voices**:
  - **Moo**: Male voice (same as MyCow onboarding)
  - **Moolah**: Female voice (same as MyCow onboarding)
- **PWA Support**: Install as app, works offline
- **COW Brand Integration**: Full implementation of Horizon Principle (cerulean sky meeting earth)

### Advanced Features 🚀

#### Speech Controls
- **Speed Control**: Adjust speech rate (0.5x - 2.0x)
- **Pitch Control**: Modify voice pitch (0.5 - 2.0)
- **Volume Control**: Adjust audio volume (0% - 100%)
- **Pause/Resume**: Pause mid-speech and resume from same position

#### Text Management
- **Real-time Statistics**:
  - Character count
  - Word count
  - Estimated reading time (adjusts with speech rate)
- **Clear Function**: Quick text clearing

#### Productivity
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause (when not in textarea)
  - `Ctrl+Enter` (or `Cmd+Enter`): Speak
  - `Esc`: Stop
  - `Ctrl+K` (or `Cmd+K`): Clear text
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG AAA color contrast, ARIA labels

## Getting Started

### Installation

```bash
cd apps/tts-app
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

The app will be available at [http://localhost:3002](http://localhost:3002)

### Build for Production

```bash
npm run build
npm start
```

### Install as PWA

1. Open the app in a browser
2. Look for the "Install" button in the address bar
3. Click to install as a standalone app
4. Access from your app menu/home screen

## Usage

### Basic Usage
1. Enter or paste text in the textarea (unlimited length)
2. Select a voice (Moo or Moolah)
3. Click "Speak" to hear the text
4. Click "Stop" to interrupt the speech

### Advanced Usage

#### Speech Controls
1. Expand the "Speech Controls" section
2. Adjust speed slider (0.5x = slower, 2.0x = faster)
3. Adjust pitch slider (lower = deeper voice, higher = higher voice)
4. Adjust volume slider (0% = muted, 100% = full volume)
5. Settings apply immediately to next speech

#### Keyboard Shortcuts
- View shortcuts by clicking the "Shortcuts" button in the header
- Use `Space` to quickly play/pause
- Use `Ctrl+Enter` to speak from anywhere in the app
- Use `Esc` to stop speech instantly
- Use `Ctrl+K` to clear and start over

#### Pause/Resume
- While speaking, click "Pause" to temporarily stop
- Click "Resume" to continue from where you paused
- Useful for long texts when you need to take breaks

## COW Brand Integration

### Visual Design
This app implements COW Group's "Horizon Principle" - cerulean (sky/water) always meets earth (stone/clay):

- **Background**: Gradient from cerulean ice → rice paper → clay soft
- **Card Header**: Cerulean ice to rice paper gradient
- **Footer**: Warm stone to clay gradient (grounding)
- **Primary Actions**: Deep cerulean (#007BA7)
- **Text**: Ink black on rice paper backgrounds

### Color Palette
- **Cerulean** (#007BA7): Primary brand color, buttons, headers
- **Earth Tones**: Warm stone (#9B8B7E), soft clay (#C9B8A8), terra cotta (#C77A58)
- **Neutrals**: Rice paper (#F5F3F0), ink black (#2C3E50)
- **Accents**: Bamboo green (#6B8E6F), gold (#B8860B)

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear distinction between headers, body, and labels
- **Accessibility**: WCAG AAA compliant contrast ratios

## Voice Selection

The app uses the same voice selection logic as MyCow app:

- **Moo (Male)**: Automatically selects from available male English voices:
  - Looks for: "male", "david", "daniel", "alex", "fred", "tom", "james", "john", "mark"
  - Falls back to first non-female English voice

- **Moolah (Female)**: Automatically selects from available female English voices:
  - Looks for: "female", "zira", "susan", "samantha", "serena", "victoria", "karen", "hazel"
  - Falls back to first female English voice

Voice selection is browser and OS dependent. Most modern browsers support multiple high-quality voices.

## Technologies

- **Framework**: Next.js 15
- **React**: 19
- **TypeScript**: 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Speech**: Web Speech API (SpeechSynthesis)

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Android)
- ⚠️ Internet Explorer not supported

## Future Features

See [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) for the complete roadmap, including:

### Phase 2 (Next Sprint)
- Word highlighting during speech
- Text history (localStorage)
- File import (.txt, .md)
- Extended voice options

### Phase 3 (Future)
- Audio export to MP3
- Saved snippets with labels
- SSML support
- Multi-language detection
- Cloud sync with COW accounts

## Development

### Project Structure
```
tts-app/
├── app/
│   ├── layout.tsx       # Root layout with PWA setup
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # Reusable UI components
│   └── tts-interface-advanced.tsx  # Main TTS interface
├── lib/
│   ├── speech-synthesis.ts  # Voice logic & speech controls
│   └── utils.ts             # Utility functions
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icon.svg        # App icon
└── styles/
    └── globals.css     # Global styles with COW colors
```

### Key Files
- `lib/speech-synthesis.ts`: Core speech synthesis logic with MyCow voice selection
- `components/tts-interface-advanced.tsx`: Main UI with all advanced features
- `styles/globals.css`: COW brand colors and design system variables

## Contributing

This app is part of the COW Group monorepo. Follow COW's contribution guidelines and ensure all changes maintain:

1. **Brand Consistency**: Use COW colors and Horizon Principle
2. **Accessibility**: Maintain WCAG AAA standards
3. **Performance**: Keep bundle size small, optimize for mobile
4. **Code Quality**: TypeScript strict mode, ESLint rules

## License

Copyright © 2025 COW Group. All rights reserved.

---

**Built with COW's Horizon Principle**: Aspiration (cerulean sky) grounded in reality (earth tones).

*Part of the COW Group ecosystem* • v1.1.0 Advanced Edition
