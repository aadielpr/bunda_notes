// Type definitions
interface Note {
    id: string
    title: string
    category: string
    jsonFile: string
}

// Notes registry - maps to JSON files in /public/json/
const notes: Note[] = [
    {
        id: 'amanah',
        title: 'Amanah',
        category: 'Akidah & Ibadah',
        jsonFile: 'amanah.json'
    },
    {
        id: 'jenis-ibadah',
        title: 'Jenis Ibadah',
        category: 'Akidah & Ibadah',
        jsonFile: 'jenis-ibadah.json'
    },
    {
        id: 'aqidah-dan-akhlak',
        title: 'Aqidah & Akhlak',
        category: 'Akidah & Ibadah',
        jsonFile: 'aqidah-dan-akhlak.json'
    },
    {
        id: 'menghilangkan-takabur',
        title: 'Menghilangkan Takabur',
        category: 'Akhlak & Ibadah',
        jsonFile: 'menghilangkan-takabur.json'
    },
    {
        id: 'mukmin-yang-beruntung',
        title: 'Orang Mukmin yang Beruntung',
        category: 'Akhlak & Ibadah',
        jsonFile: 'mukmin-yang-beruntung.json'
    }
]

// Function to get note by ID
export function getNoteById(id: string): Note | undefined {
    return notes.find(note => note.id === id)
}

// Function to get all notes
export function getAllNotes(): Note[] {
    return notes
} 