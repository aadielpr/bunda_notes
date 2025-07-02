# Islamic Notes Website - Development Guide

## JSON Note Conversion Guide

### Correct JSON Structure
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
            "surah": "Al-Baqarah",
            "chapter": 2,
            "verse": 43,
            "arabic": "Uthmani Arabic text",
            "indonesian": "Indonesian translation"
        },
        {
            "type": "definition",
            "term": "Term",
            "definition": "Definition of the term"
        },
        {
            "type": "list",
            "items": ["Item 1", "Item 2", "Item 3"]
        },
        {
            "type": "concept",
            "title": "Important concept or note"
        },
        {
            "type": "note",
            "text": "Final note or summary"
        }
    ]
}
```

### Content Types
1. `heading` - Main section headings (level: 2)
2. `subheading` - Subsection headings
3. `paragraph` - Regular text paragraphs
4. `verse` - Single Quranic verse with Arabic text and Indonesian translation
5. `verse-group` - Multiple consecutive verses
6. `definition` - Key terms and their meanings
7. `list` - Numbered or bulleted lists
8. `concept` - Important concepts or notes
9. `note` - Final notes or summaries

### Common Issues & Solutions

#### ❌ Wrong Structure (Don't Use)
```json
{
    "sections": [
        {
            "title": "Section Title",
            "content": [
                {
                    "type": "text",
                    "value": "Content"
                }
            ]
        }
    ]
}
```

#### ✅ Correct Structure (Use This)
```json
{
    "sections": [
        {
            "type": "subheading",
            "text": "Section Title"
        },
        {
            "type": "paragraph",
            "text": "Content"
        }
    ]
}
```

### Quran Verse Format
```json
{
    "type": "verse",
    "surah": "Al-Baqarah",
    "chapter": 2,
    "verse": 43,
    "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    "indonesian": "Dan laksanakanlah salat, tunaikanlah zakat, dan rukuklah bersama orang yang rukuk."
}
```

### Verse Groups (Multiple Consecutive Verses)
```json
{
    "type": "verse-group",
    "verses": [
        {
            "surah": "Ali Imran",
            "chapter": 3,
            "verse": 133,
            "arabic": "وَسَارِعُوٓا۟ إِلَىٰ مَغْفِرَةٍۢ مِّن رَّبِّكُمْ...",
            "indonesian": "Dan bersegeralah kamu mencari ampunan dari Tuhanmu..."
        },
        {
            "surah": "Ali Imran",
            "chapter": 3,
            "verse": 134,
            "arabic": "ٱلَّذِينَ يُنفِقُونَ فِى ٱلسَّرَّآءِ...",
            "indonesian": "Yaitu orang-orang yang menafkahkan hartanya..."
        }
    ]
}
```

### Categories
Use these standard categories:
- `Akidah & Ibadah` - Faith and worship
- `Akhlak & Ibadah` - Ethics and worship
- `Akidah & Tauhid` - Faith and monotheism

### Conversion Rules
1. Each txt file becomes one JSON file
2. Main title becomes the JSON title
3. Major sections marked with `~` or numbered headings become subheadings
4. Quran references must include:
   - Surah name (e.g., "Al-Baqarah")
   - Chapter number
   - Verse number
   - Uthmani Arabic text (from EQuran.id API)
   - Indonesian translation (from EQuran.id API)
5. Lists marked with `•` or numbers become list type content
6. Keep original text formatting and meaning
7. Use proper content types for different elements

### File Locations
- Source txt files: `notes/`
- Generated JSON: `public/json/`
- Navigation updates: `src/data/notes.ts`

### Navigation Update
Add new notes to `src/data/notes.ts` following format:
```typescript
{
    id: 'filename-without-extension',
    title: 'Note Title',
    category: 'Akidah & Ibadah',
    jsonFile: 'filename.json'
}
```

### Arabic & Indonesian Text Fetching

#### Using the Script
The project includes a script to fetch both Arabic text and Indonesian translations from EQuran.id API:

```bash
# Fetch for a specific file
node scripts/fetch-equran-arabic.js <filename>.json

# Example
node scripts/fetch-equran-arabic.js amanah.json
```

#### Manual Process
1. Convert txt to JSON with correct structure
2. Add verse references (surah, chapter, verse)
3. Run the script to fetch Arabic and Indonesian text
4. Test the JSON file loads correctly

### Testing Checklist
- [ ] JSON file loads without errors
- [ ] All sections display correctly
- [ ] Quran verses show Arabic text
- [ ] Indonesian translations display properly
- [ ] Navigation includes the new note
- [ ] No console errors in browser

### Reference Examples
Check these files in `public/json/` for real examples:
1. `amanah.json` - Complete structure with embedded translations
2. `aqidah.json` - Simple content with verses
3. `aqidah-dan-akhlak.json` - Complex content with multiple sections
4. `jenis-ibadah.json` - Mixed content types
5. `menghilangkan-takabur.json` - Quran verses with translations
6. `mukmin-yang-beruntung.json` - Large content with many verses

### Development Workflow
1. Convert txt to JSON using correct structure
2. Add verse references for all Quran citations
3. Run `node scripts/fetch-equran-arabic.js <filename>.json` to fetch Arabic and Indonesian text
4. Test JSON syntax with online validator
5. Add to navigation in `src/data/notes.ts`
6. Test in development server
7. Check all content types render correctly
8. Verify Arabic text and Indonesian translations display properly

### Technical Notes
- **API Source**: EQuran.id API v2.0 (`https://equran.id/api/v2`)
- **Arabic Text**: Uses `teksArab` field from API response
- **Indonesian Translation**: Uses `teksIndonesia` field from API response
- **Embedded Translations**: All translations are stored in JSON, no runtime API calls
- **Performance**: Faster loading, works offline, no API dependencies
- **Consistency**: All translations from same source for uniformity 