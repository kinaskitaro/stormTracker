# 🌀 Storm Tracker for Kids

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)](https://vitejs.dev/)

An interactive educational web application that helps kids learn about hurricanes, typhoons, and cyclones through visual maps, real-time tracking data, and AI-powered search capabilities.

![App Screenshot](https://via.placeholder.com/800x400?text=Storm+Tracker+Demo)

## ✨ Features

### 🗺️ Interactive Storm Tracking
- **Live Map Visualization**: View storm paths on an interactive Leaflet map
- **Real-time Data**: Access up-to-date storm tracking information
- **Multiple Storms**: Track and compare multiple storms simultaneously
- **Detailed Information**: View wind speeds, pressure readings, and storm categories

### 🔍 AI-Powered Search
- **Universal Storm Search**: Search for ANY storm using advanced AI
- **Natural Language Processing**: Just type a storm name and year
- **Comprehensive Data Sources**: Searches through IBTrACS and BST databases
- **Rich Descriptions**: AI-generated educational content for each storm

### 🌍 Multilingual Support
- **English**: Full support for English-speaking users
- **Vietnamese**: Complete Vietnamese translation with AI-powered translation
- **Easy Switching**: One-click language toggle

### 📊 Educational Content
- **Kid-Friendly Descriptions**: Simple explanations of complex weather phenomena
- **Fun Facts**: Interesting educational facts about each storm
- **Category Classifications**: Easy-to-understand hurricane categories
- **Historical Context**: Learn about significant storms throughout history

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/StormTracker.git
cd StormTracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Add your API keys to `.env`**
```env
# Groq API (Required for AI search and translation)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Gemini API (Optional - for enhanced AI search)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting Your API Keys

#### Groq API (Required - FREE)
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate a new API key
4. Add it to your `.env` file

#### Gemini API (Optional - FREE)
1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env` file

### Running the Application

**Development mode:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Production build:**
```bash
npm run build
npm run preview
```

## 📖 User Guide

### Searching for Storms

1. **Built-in Storms**: Type a storm name (e.g., "Katrina", "Ian", "Irma") to see pre-loaded famous storms
2. **AI-Powered Search**: Click the purple ✨ button to search the complete storm database
3. **Year Filtering**: Add a year to distinguish storms with the same name (e.g., "Katrina 2005")

### Using the Map

- **Click Points**: Click on any point in the storm track to see detailed information
- **Multiple Storms**: Track multiple storms simultaneously by searching for each one
- **Zoom & Pan**: Use mouse or touch gestures to navigate the map

### Changing Language

- Click the language dropdown in the top-right corner
- Select your preferred language (English/Vietnamese)
- All content will be automatically translated

## 🎓 Educational Resources

### Understanding Storm Categories

| Category | Wind Speed | Description |
|----------|------------|-------------|
| 1 | 74-95 mph | Very dangerous winds will produce some damage |
| 2 | 96-110 mph | Extremely dangerous winds will cause extensive damage |
| 3 | 111-129 mph | Devastating damage will occur |
| 4 | 130-156 mph | Catastrophic damage will occur |
| 5 | 157+ mph | Catastrophic damage will be widespread |

### Fun Facts for Kids

🌀 Hurricanes rotate counter-clockwise in the Northern Hemisphere and clockwise in the Southern Hemisphere

⛈️ The word "hurricane" comes from the Taino Native American word "huracan," meaning evil spirit of the wind

🌊 Hurricanes can produce storm surges up to 20 feet high!

💨 The strongest winds in a hurricane are typically found in the eyewall, the ring surrounding the eye

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Leaflet** - Interactive map library
- **Lucide React** - Beautiful icons

### Backend & APIs
- **Groq API** - Free AI service (Llama 3.1 model)
- **Gemini API** - Google's AI platform
- **IBTrACS** - International Best Track Archive
- **BST Database** - Historical storm tracking data

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing framework
- **PostCSS** - CSS processing

## 📁 Project Structure

```
StormTracker/
├── public/                 # Static assets
│   ├── IBTrACS_*.csv       # Recent storm data
│   └── bst_all.txt         # Historical storms
├── src/
│   ├── components/         # React components
│   │   ├── StormMap.tsx    # Map visualization
│   │   ├── StormSearch.tsx # Search interface
│   │   └── InfoPanel.tsx   # Storm details panel
│   ├── contexts/           # React contexts
│   │   └── LanguageContext.tsx  # i18n context
│   ├── services/           # API services
│   │   ├── groqStormService.ts  # AI search service
│   │   └── translationService.ts # Translation service
│   ├── App.tsx            # Main app component
│   └── types.ts           # TypeScript types
├── proxy-server.mjs       # Development proxy
└── vite.config.ts         # Vite configuration
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GROQ_API_KEY` | Yes | API key for Groq AI (search & translation) |
| `VITE_GEMINI_API_KEY` | No | API key for Google Gemini (enhanced search) |

### Customization

**Change Map Center:**
Edit `src/components/StormMap.tsx` to modify the default map view

**Add Built-in Storms:**
Edit `src/stormData.ts` to add pre-loaded storms

**Modify Translations:**
Edit `src/translations.ts` to add new languages or modify existing ones

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: Create an issue with detailed description
2. **Suggest Features**: Share your ideas in the issues section
3. **Submit Pull Requests**: Follow our contribution guidelines

### Development Guidelines

- Follow existing code style and patterns
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IBTrACS**: International Best Track Archive for Climate Stewardship
- **Groq**: Free AI API service
- **Leaflet**: Open-source mapping library
- **Vite**: Next-generation build tool

## 🔗 Resources

- [Project Documentation](https://github.com/yourusername/StormTracker/wiki)
- [Issue Tracker](https://github.com/yourusername/StormTracker/issues)
- [National Hurricane Center](https://www.nhc.noaa.gov/)
- [NOAA Education](https://www.weather.gov/jetstream/tropical)

## 💬 Support

- **Email**: support@stormtracker.dev
- **Discord**: Join our community server
- **Twitter**: [@StormTrackerApp](https://twitter.com/StormTrackerApp)

---

Made with ❤️ for curious minds everywhere

**Version:** 1.0.0
**Last Updated:** January 2026
