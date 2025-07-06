# Islamic Notes Website - Development Guide

## Current Architecture

### Component Structure
- **`JsonNoteViewer.vue`** - Main content viewer with caching
- **`VerseDisplay.vue`** - Single verse component
- **`VerseGroupDisplay.vue`** - Multiple verses component  
- **`Sidebar.vue`** - Navigation sidebar
- **`App.vue`** - Main app with PDF downloader

### Data Flow
1. **Quran Data**: Loaded from `/json/quran.json` via `quranDataService`
2. **Note Content**: JSON files in `/public/json/` with minimal verse references
3. **Caching**: Verse data cached to avoid repeated API calls
4. **PDF Generation**: Uses Quran data service for consistent formatting

## JSON Note Structure (Updated)

### Current JSON Structure
```json
{
    "title": "Title of the Note",
    "category": "Akidah & Ibadah",
    "sections": [
        {
            "type": "heading",
            "level": 2,
            "text": "Main Heading"
        },
        {
            "type": "paragraph",
            "text": "Regular text content"
        },
        {
            "type": "subheading",
            "text": "Sub Heading"
        },
        {
            "type": "verse",
            "chapter": 2,
            "verse": 43
        },
        {
            "type": "definition",
            "term": "Term",
            "definition": "Definition of the term",
            "reference": {
                "chapter": 2,
                "verse": 43
            }
        },
        {
            "type": "list",
            "items": ["Item 1", "Item 2", "Item 3"]
        },
        {
            "type": "concept",
            "title": "Important concept or note",
            "reference": {
                "chapter": 2,
                "verse": 43
            }
        },
        {
            "type": "note",
            "text": "Final note or summary"
        }
    ]
}
```

### Key Changes from Previous Version
- ❌ **Removed**: `surah`, `arabic`, `indonesian` properties from verses
- ✅ **Added**: `reference` object for definitions and concepts
- ✅ **Simplified**: Verses only need `chapter` and `verse` numbers
- ✅ **Centralized**: All Arabic text and translations from `quran.json`

### Content Types
1. `heading` - Main section headings (level: 2)
2. `subheading` - Subsection headings
3. `paragraph` - Regular text paragraphs
4. `verse` - Single Quranic verse (chapter + verse only)
5. `verse-group` - Multiple consecutive verses (auto-grouped)
6. `definition` - Key terms with optional verse references
7. `list` - Numbered lists
8. `concept` - Important concepts with optional references
9. `note` - Final notes or summaries

## Quran Data Service

### File Location
- **Source**: `/json/quran.json` (in public directory)
- **Service**: `src/services/quranData.ts`
- **Usage**: Automatically loaded by components

### Data Structure
```typescript
interface VerseData {
    arabic: string           // Arabic text
    translation: string      // Indonesian translation
    surahName: string        // Surah name
    surahNumber: number      // Chapter number
    ayahNumber: string       // Verse number
    arabicNumber: string     // Arabic verse number (۝١, ۝٢, etc.)
}
```

### Usage in Components
```typescript
// Get verse data (cached)
const verseData = quranDataService.getVerseData(chapter, verse)

// Access properties
verseData.arabic        // Arabic text
verseData.translation   // Indonesian translation
verseData.surahName     // Surah name
verseData.arabicNumber  // Arabic verse number
```

## Component Architecture

### VerseDisplay.vue
**Purpose**: Renders single verses
```vue
<VerseDisplay 
  :chapter="2"
  :verse="43"
  :verse-data="getCachedVerseData(2, 43)"
/>
```

### VerseGroupDisplay.vue
**Purpose**: Renders multiple verses
```vue
<VerseGroupDisplay 
  :verses="section.verses"
  :get-verse-data="getCachedVerseData"
  :get-verse-range="getVerseRange"
/>
```

### Performance Optimizations
- **Caching**: `verseDataCache` Map prevents repeated service calls
- **Lazy Loading**: Quran data loaded only when needed
- **Component Separation**: Reusable verse components

## PDF Downloader

### Features
- **Quran Integration**: Uses `quranDataService` for consistent data
- **Arabic Numbers**: Displays verse numbers (۝١, ۝٢, etc.)
- **Translations**: Includes Indonesian translations
- **Surah Names**: Fetched from Quran data
- **Error Handling**: Graceful fallbacks if data unavailable

### Usage
```typescript
// Triggered from JsonNoteViewer
@download-pdf="downloadPDF"

// Automatically loads Quran data if needed
await quranDataService.loadQuranData()
```

## Development Workflow

### 1. Creating New Notes
```bash
# 1. Create JSON file in public/json/
# 2. Add to navigation in src/data/notes.ts
# 3. Test in development server
```

### 2. JSON Structure Rules
- ✅ Use only `chapter` and `verse` for Quran references
- ✅ Add `reference` objects for definitions/concepts
- ✅ Remove embedded Arabic text and translations
- ✅ Keep content types consistent

### 3. Testing Checklist
- [ ] JSON file loads without errors
- [ ] Quran verses display Arabic text and translations
- [ ] Surah names appear correctly
- [ ] PDF download includes all content
- [ ] No console errors
- [ ] Performance is good (check caching)

## File Locations

### Core Files
- **Quran Data**: `/json/quran.json`
- **Note JSONs**: `/public/json/*.json`
- **Components**: `src/components/`
- **Services**: `src/services/quranData.ts`
- **Navigation**: `src/data/notes.ts`

### Example Files
- `amanah.json` - Basic structure
- `aqidah.json` - Simple content
- `mukmin-yang-beruntung.json` - Complex content

## Migration Guide

### From Old Structure to New
1. **Remove Properties**: Delete `surah`, `arabic`, `indonesian` from verses
2. **Add References**: Add `reference` objects where needed
3. **Update Navigation**: Ensure `src/data/notes.ts` is current
4. **Test Components**: Verify all content types render correctly

### Example Migration
```json
// OLD (Don't use)
{
    "type": "verse",
    "surah": "Al-Baqarah",
    "chapter": 2,
    "verse": 43,
    "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ...",
    "indonesian": "Dan laksanakanlah salat..."
}

// NEW (Use this)
{
    "type": "verse",
    "chapter": 2,
    "verse": 43
}
```

## Technical Notes

### Performance
- **Caching**: Verse data cached in memory
- **Lazy Loading**: Quran data loaded on demand
- **Component Optimization**: Separate components for reusability

### Data Sources
- **Quran Text**: `/json/quran.json` (local file)
- **Translations**: Embedded in Quran data
- **Surah Names**: Fetched from Quran data service

### Browser Support
- **Modern Browsers**: Full support
- **Offline Capable**: Works without internet
- **Print Friendly**: PDF generation optimized

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Common Issues
1. **Verse not displaying**: Check `chapter` and `verse` numbers
2. **PDF missing content**: Ensure Quran data is loaded
3. **Performance issues**: Check caching implementation
4. **Component errors**: Verify prop types and interfaces

### Debug Steps
1. Check browser console for errors
2. Verify JSON structure is correct
3. Ensure Quran data file exists
4. Test individual components
5. Check network requests

## Future Enhancements
- **Search Functionality**: Full-text search across notes
- **Bookmarking**: Save favorite verses/sections
- **Sharing**: Share specific sections
- **Audio Integration**: Quran recitation
- **Mobile App**: Native mobile application 