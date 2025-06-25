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
        id: '6-orang-mukmin-yang-beruntung',
        title: '6 Orang Mukmin yang Beruntung',
        category: 'Akhlak & Ibadah',
        jsonFile: '6-orang-mukmin-yang-beruntung.json'
    },
    {
        id: '5-rukun-islam',
        title: '5 Rukun Islam',
        category: 'Akidah & Ibadah',
        jsonFile: '5-rukun-islam.json'
    },
    {
        id: 'asmaul-husna',
        title: 'Asmaul Husna',
        category: 'Akidah & Tauhid',
        jsonFile: 'asmaul-husna.json'
    },
    {
        id: 'amanah',
        title: 'Amanah',
        category: 'Akidah & Ibadah',
        jsonFile: 'amanah.json'
    },
    {
        id: 'mukmin-yang-beruntung',
        title: 'Orang Mukmin yang Beruntung',
        category: 'Akhlak & Ibadah',
        jsonFile: 'mukmin-yang-beruntung.json'
    },
    {
        id: 'jenis-ibadah',
        title: 'Jenis Ibadah',
        category: 'Akidah & Ibadah',
        jsonFile: 'jenis-ibadah.json'
    },
    {
        id: 'menghilangkan-takabur',
        title: 'Menghilangkan Takabur',
        category: 'Akhlak & Ibadah',
        jsonFile: 'menghilangkan-takabur.json'
    },
    {
        id: 'menjadi-orang-bertakwa',
        title: 'Menjadi Orang Bertakwa',
        category: 'Akhlak & Ibadah',
        jsonFile: 'menjadi-orang-bertakwa.json'
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