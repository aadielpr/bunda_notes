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
            "arabic": "Uthmani Arabic text"
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
4. `verse` - Single Quranic verse with Arabic text
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
    "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ"
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
            "arabic": "وَسَارِعُوٓا۟ إِلَىٰ مَغْفِرَةٍۢ مِّن رَّبِّكُمْ..."
        },
        {
            "surah": "Ali Imran",
            "chapter": 3,
            "verse": 134,
            "arabic": "ٱلَّذِينَ يُنفِقُونَ فِى ٱلسَّرَّآءِ..."
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
   - Uthmani Arabic text
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

### Testing Checklist
- [ ] JSON file loads without errors
- [ ] All sections display correctly
- [ ] Quran verses show Arabic text
- [ ] Translations load properly
- [ ] Navigation includes the new note
- [ ] No console errors in browser

### Reference Examples
Check these files in `public/json/` for real examples:
1. `5-rukun-islam.json` - Complete structure example
2. `amanah.json` - Complex content with multiple sections
3. `jenis-ibadah.json` - Mixed content types
4. `mukmin-yang-beruntung.json` - Quran verses with translations

### Development Workflow
1. Convert txt to JSON using correct structure
2. Test JSON syntax with online validator
3. Add to navigation in `src/data/notes.ts`
4. Test in development server
5. Check all content types render correctly
6. Verify Quran translations load 