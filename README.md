# JSON Formatter & Explorer

A powerful, client-side JSON Formatter & Explorer built with Next.js, Tailwind CSS, and shadcn/ui. This application provides comprehensive tools for JSON manipulation, validation, comparison, and exploration.

🔗 **Live Demo**: [https://json.deepakjangra.com](https://json.deepakjangra.com)

## ✨ Features

### 🎯 Core Functionality

1. **Paste & Format**
   - Paste raw JSON into an intuitive editor
   - Pretty-print with selectable indent levels (2 or 4 spaces)
   - Minify JSON for compact output
   - Real-time syntax highlighting

2. **JSON Validation**
   - Real-time syntax validation as you type
   - Clear error messages with line/column details
   - Visual indicators for valid/invalid JSON

3. **🆕 JSON Comparison**
   - Side-by-side JSON comparison tool
   - Intelligent diff detection (added, removed, changed)
   - Color-coded difference visualization
   - Path-based change tracking
   - Support for complex nested structures

4. **Tree Explorer**
   - Interactive expandable/collapsible tree view
   - Visual icons for different data types (objects, arrays, strings, numbers, booleans, null)
   - Type badges for quick identification
   - Expand/collapse all functionality

5. **Search & Highlight**
   - Live search across JSON keys and values
   - Highlighted matches in both editor and tree view
   - Search result counter and navigation
   - Case-sensitive search option

6. **Transform Utilities**
   - Sort object keys alphabetically (recursive)
   - Convert arrays of objects to CSV format
   - JSONPath-style queries with dot/bracket notation
   - Extract specific data paths

7. **Import & Export**
   - Import local `.json` files via file picker
   - Copy formatted or minified JSON to clipboard
   - Download current data as `.json` file
   - Export arrays to `.csv` format

8. **Settings & Themes**
   - Toggle between light and dark themes
   - Persistent theme preference in localStorage
   - Configurable indentation (2 or 4 spaces)
   - Settings persistence across sessions

### 🎨 User Interface

- **Modern Design**: Clean, professional interface using shadcn/ui components
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Toast notifications for user actions
- **Statistics Panel**: JSON size, line count, and structure information
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, and structured data

### 🚀 New Features

- **JSON Compare Tool**: Compare two JSON documents with detailed diff visualization
- **PWA Support**: Install as a web app with offline capabilities
- **SEO Friendly**: Optimized for search engines with comprehensive meta tags
- **Social Sharing**: Rich previews for Twitter, Facebook, and other platforms

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/heydeepakjangra/json.git
cd json
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 🔄 Usage Examples

### Basic JSON Formatting

1. Paste your JSON into the editor
2. Click "Format" to pretty-print with proper indentation
3. Use "Minify" to compress the JSON
4. "Sort Keys" to alphabetically organize object properties

### JSON Comparison

1. Switch to the "Compare" tab
2. Paste your first JSON in "JSON A (Original)"
3. Paste your second JSON in "JSON B (Compare)"
4. View detailed differences with color-coded highlights:
   - 🟢 **Green**: Added properties
   - 🔴 **Red**: Removed properties  
   - 🟡 **Yellow**: Changed values

### Tree Navigation

1. Switch to "Tree View" tab
2. Click arrows to expand/collapse nodes
3. Use "Expand All" or "Collapse All" for bulk operations
4. View data types with color-coded icons and badges

### Search Functionality

1. Enter search terms in the search box
2. View highlighted matches in both editor and tree
3. Browse search results in the sidebar
4. Results update live as you type

### JSONPath Queries

Use dot notation or bracket notation to extract specific data:

- `users.0.name` - Get the name of the first user
- `settings.theme` - Get the theme setting
- `data.items[*]` - Get all items in an array
- `products.electronics.phones[0].price` - Navigate deep structures

### File Operations

- **Import**: Click "Upload" and select a `.json` file
- **Export JSON**: Click "JSON" to download the current data
- **Export CSV**: Click "CSV" to download arrays as spreadsheet data
- **Copy**: Click "Copy" to copy JSON to clipboard

## 🛠 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Type Safety**: TypeScript
- **State Management**: React Hooks
- **Storage**: localStorage for settings persistence
- **SEO**: Next.js Metadata API with comprehensive optimization

## 📁 Architecture

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── json-formatter.tsx # Main application component
│   └── tree-explorer.tsx # Tree view component
├── hooks/
│   └── use-settings.ts   # Settings management hook
├── lib/
│   ├── utils.ts          # General utilities
│   └── json-utils.ts     # JSON-specific utilities
└── public/
    ├── manifest.json     # PWA manifest
    └── favicon.ico       # Favicon and app icons
```

## 🎯 Key Features Implementation

### Real-time Validation
- Uses `JSON.parse()` with comprehensive error handling
- Extracts line/column information from syntax errors
- Provides immediate visual feedback

### JSON Comparison Engine
- Deep object traversal and comparison
- Intelligent diff algorithm for nested structures
- Path-based change tracking
- Support for arrays, objects, and primitive types

### Tree Visualization
- Recursive tree generation from JSON data
- Virtual scrolling for large datasets
- Intelligent expansion state management

### Search Engine
- Recursive traversal of JSON structures
- Pattern matching for keys and values
- Highlighted result display

### File Handling
- HTML5 File API for uploads
- Blob API for downloads
- Clipboard API with fallbacks

### Theme System
- CSS custom properties for theming
- localStorage persistence
- System preference detection

## ⚡ Performance Optimizations

- **Memoization**: Uses React.useMemo for expensive operations
- **Debouncing**: Search operations are optimized
- **Virtual Scrolling**: Tree view handles large datasets efficiently
- **Code Splitting**: Components are loaded on demand
- **Efficient Diffing**: Optimized comparison algorithm

## 🌐 SEO Features

- **Meta Tags**: Comprehensive title, description, and keywords
- **Open Graph**: Rich social media previews
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: JSON-LD for search engines
- **Canonical URLs**: Proper URL canonicalization
- **PWA Manifest**: Progressive web app support

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Creator

**Deepak Jangra**
- Twitter: [@heydeepakjangra](https://x.com/heydeepakjangra)
- GitHub: [@heydeepakjangra](https://github.com/heydeepakjangra)

---

⭐ If you find this project helpful, please consider giving it a star on GitHub!
