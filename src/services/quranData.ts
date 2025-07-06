interface QuranAyah {
    arabic: string
    ayahNumber: string
    latin: string
    translation: string
}

interface QuranSurah {
    number: number
    name: string
    place: string
    ayat: QuranAyah[]
}

interface VerseData {
    arabic: string
    translation: string
    surahName: string
    surahNumber: number
    ayahNumber: string
    arabicNumber: string
}

class QuranDataService {
    private quranData: QuranSurah[] | null = null

    async loadQuranData(): Promise<void> {
        if (this.quranData) return

        try {
            const response = await fetch('/quran.json')
            this.quranData = await response.json()
        } catch (error) {
            console.error('Failed to load Quran data:', error)
            throw error
        }
    }

    getVerseData(chapter: number, verse: number): VerseData | null {
        if (!this.quranData) return null

        const surah = this.quranData.find(s => s.number === chapter)
        if (!surah) return null
        
        const ayah = surah.ayat[verse - 1]
        return {
            arabic: ayah.arabic,
            translation: ayah.translation,
            surahName: surah.name,
            surahNumber: surah.number,
            ayahNumber: verse.toString(),
            arabicNumber: ayah.ayahNumber,
        }
    }

    isLoaded(): boolean {
        return this.quranData !== null
    }
}

export const quranDataService = new QuranDataService() 