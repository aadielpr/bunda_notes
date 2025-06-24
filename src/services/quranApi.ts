const QURAN_API_BASE = 'https://api.alquran.cloud/v1'

// Edition identifiers
const ARABIC_EDITION = 'quran-uthmani'
const INDONESIAN_EDITION = 'id.indonesian'

// Type definitions
interface SurahInfo {
    number: number
    name: string
    englishName: string
    numberOfAyahs: number
}

interface VerseData {
    arabic: string
    indonesian: string
    surah: SurahInfo
    verse: number
    juz: number
    page: number
}

interface ApiVerseResponse {
    number: number
    text: string
    surah: {
        number: number
        name: string
        englishName: string
        numberOfAyahs: number
    }
    numberInSurah: number
    juz: number
    page: number
}

interface ApiResponse {
    code: number
    status: string
    data: ApiVerseResponse[]
}

/**
 * Fetch verse with Arabic text and Indonesian translation
 */
export async function fetchVerse(chapter: number, verse: number): Promise<VerseData> {
    try {
        const response = await fetch(
            `${QURAN_API_BASE}/ayah/${chapter}:${verse}/editions/${ARABIC_EDITION},${INDONESIAN_EDITION}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json()
        
        if (data.code !== 200 || !data.data || data.data.length < 2) {
            throw new Error('Invalid API response')
        }
        
        const [arabicVerse, indonesianVerse] = data.data
        
        return {
            arabic: arabicVerse.text,
            indonesian: indonesianVerse.text,
            surah: {
                number: arabicVerse.surah.number,
                name: arabicVerse.surah.name,
                englishName: arabicVerse.surah.englishName,
                numberOfAyahs: arabicVerse.surah.numberOfAyahs
            },
            verse: arabicVerse.numberInSurah,
            juz: arabicVerse.juz,
            page: arabicVerse.page
        }
    } catch (error) {
        console.error('Error fetching verse:', error)
        throw error
    }
}



/**
 * Parse verse range (e.g., "8-10" or "9") and return array of verse numbers
 */
export function parseVerseRange(verseRange: string): number[] {
    if (verseRange.includes('-')) {
        const [start, end] = verseRange.split('-').map((num: string) => parseInt(num.trim()))
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    return [parseInt(verseRange)]
}

 