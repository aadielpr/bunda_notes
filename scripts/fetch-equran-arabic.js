import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EQURAN_API_BASE = 'https://equran.id/api/v2';

async function fetchVerse(suratId, ayatNumber) {
    try {
        const response = await fetch(`${EQURAN_API_BASE}/surat/${suratId}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.code !== 200 || !data.data || !data.data.ayat) {
            throw new Error('Invalid API response');
        }
        
        const ayat = data.data.ayat.find(a => a.nomorAyat === ayatNumber);
        if (!ayat) {
            throw new Error(`Ayat ${ayatNumber} not found in surat ${suratId}`);
        }
        
        return {
            arabic: ayat.teksArab,
            indonesian: ayat.teksIndonesia
        };
    } catch (error) {
        console.error(`Error fetching surat ${suratId} ayat ${ayatNumber}:`, error.message);
        return { arabic: '', indonesian: '' };
    }
}

async function updateFile(jsonPath) {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let updated = false;
    
    // Update single verses
    for (const section of jsonData.sections) {
        if (section.type === 'verse') {
            console.log(`[${path.basename(jsonPath)}] Replacing ${section.surah} ${section.chapter}:${section.verse}`);
            const verseData = await fetchVerse(section.chapter, section.verse);
            section.arabic = verseData.arabic;
            section.indonesian = verseData.indonesian;
            updated = true;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Update verse groups
        if (section.type === 'verse-group') {
            for (const verse of section.verses) {
                console.log(`[${path.basename(jsonPath)}] Replacing ${verse.surah} ${verse.chapter}:${verse.verse}`);
                const verseData = await fetchVerse(verse.chapter, verse.verse);
                verse.arabic = verseData.arabic;
                verse.indonesian = verseData.indonesian;
                updated = true;
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }
    
    if (updated) {
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 4));
        console.log(`[${path.basename(jsonPath)}] Arabic and Indonesian text replaced!`);
    } else {
        console.log(`[${path.basename(jsonPath)}] No updates needed.`);
    }
}

// Entry point
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.log('Usage: node fetch-equran-arabic.js <json-filename>');
    process.exit(1);
}

const jsonFile = args[0];
const jsonPath = path.join(__dirname, '../public/json', jsonFile);
if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
}

updateFile(jsonPath).catch(console.error); 