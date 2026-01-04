# 🌀 Storm Tracker for Kids

An interactive web application that helps kids learn about hurricanes, typhoons, and cyclones through visual maps and educational information.

## Features

- **Interactive Map**: View storm paths on an interactive map
- **Storm Tracking**: Track multiple storms with detailed information
- **Educational Content**: Kid-friendly descriptions and fun facts about each storm
- **Search Functionality**: Search through a database of famous storms
- **AI-Powered Search**: 🔮 Search for ANY storm on the internet using AI!

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StormTracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (for AI search):
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your free API key at:** https://makersuite.google.com/app/apikey

5. Run the development server:
```bash
npm run dev
```

## Using AI Search 🪄

The app includes an AI-powered search feature that lets you find information about ANY storm from the internet!

### How to Use AI Search:

1. Type the name of a storm in the search box (e.g., "Hurricane Milton", "Typhoon Haiyan", "Cyclone Yasi")
2. Click the purple ✨ button to search with AI
3. The AI will:
   - Search for comprehensive storm data
   - Extract tracking information including coordinates
   - Generate kid-friendly descriptions
   - Find interesting facts about the storm
   - Display it on the map with all tracking points

### What the AI Searches For:

- Formation date and location
- Key milestones (landfalls, peak intensity)
- Wind speeds and pressure readings
- Geographic coordinates
- Category/classification
- Educational facts suitable for kids

### Limitations:

- Requires a Gemini API key (free tier available)
- Works best with well-known storms
- Response time may vary based on AI processing
- Data accuracy depends on available online sources

## Built-in Storms

The app comes pre-loaded with these famous storms:
- Hurricane Katrina (2005)
- Hurricane Irma (2017)
- Hurricane Maria (2017)
- Hurricane Ian (2022)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Leaflet** - Interactive maps
- **Lucide React** - Icons
- **Perplexity API** - AI-powered search

## License

MIT

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
