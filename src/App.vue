<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="flex items-center justify-between p-4">
        <h1 class="text-base font-bold text-gray-900">
          MT Az-Zahra Pekanbaru
        </h1>
        <button 
          @click="toggleMobileSidebar"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showMobileSidebar" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row h-screen lg:h-auto">
      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="showMobileSidebar" 
        class="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
        @click="closeMobileSidebar"
      ></div>

      <!-- Sidebar Component -->
      <Sidebar
        :notes="notes"
        :search-query="searchQuery"
        :selected-note-id="selectedNoteId"
        :show-mobile-sidebar="showMobileSidebar"
        :is-loading-note="isLoadingNote"
        @select-note-and-close="selectNoteAndCloseSidebar"
        @close-mobile-sidebar="closeMobileSidebar"
        @update-search-query="updateSearchQuery"
      />

      <!-- Main Content -->
      <main class="flex-1 bg-white overflow-y-auto" :class="showMobileSidebar ? 'lg:h-screen' : 'h-full lg:h-screen'">
        <!-- Loading state -->
        <div v-if="isLoadingNote" class="h-full flex items-center justify-center p-4">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-green-600 mb-3"></div>
            <h2 class="text-base lg:text-lg font-medium text-gray-700 mb-1">Memuat Catatan</h2>
            <p class="text-gray-500 text-xs lg:text-sm">Mohon tunggu sebentar...</p>
          </div>
        </div>
        
        <!-- Content loaded -->
        <div v-else-if="selectedNote && noteContent" class="h-full">
          <JsonNoteViewer 
            :note="selectedNote" 
            :content="noteContent"
            @download-pdf="downloadPDF"
          />
        </div>
        
        <!-- Empty state when no note is selected -->
        <div v-else class="h-full flex items-center justify-center p-4">
          <div class="text-center">
            <div class="text-gray-400 mb-4">
              <svg class="w-10 h-10 lg:w-12 lg:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <p class="text-gray-600 text-sm lg:text-base font-medium">Pilih catatan dari sidebar</p>
            <p class="text-gray-500 text-xs mt-1">untuk mulai membaca</p>
            <button 
              @click="toggleMobileSidebar"
              class="lg:hidden mt-4 px-4 py-2 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
            >
              Buka Menu
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllNotes, getNoteById } from './data/notes'
import { quranDataService } from './services/quranData'
import JsonNoteViewer from './components/JsonNoteViewer.vue'
import Sidebar from './components/Sidebar.vue'

// Type definitions
interface NoteContent {
    sections: Array<{
        type: string
        level?: number
        text?: string
        term?: string
        definition?: string
        chapter?: number
        verse?: string | number
        items?: string[]
        reference?: {
            chapter: number
            verse: string | number
        }
        title?: string
        verses?: Array<{
            chapter: number
            verse: string | number
        }>
    }>
}

// Router setup
const route = useRoute()
const router = useRouter()

// Reactive state
const notes = ref(getAllNotes())
const searchQuery = ref('')
const selectedNoteId = ref<string | null>(null)
const noteContent = ref<NoteContent | null>(null)
const showMobileSidebar = ref(false)
const isLoadingNote = ref(false)

// Computed properties
const selectedNote = computed(() => {
    return selectedNoteId.value ? getNoteById(selectedNoteId.value) : null
})

// Methods
async function selectNote(id: string) {
    selectedNoteId.value = id
    await loadNoteContent(id)
    
    // Navigate to the note route
    if (route.params.id !== id) {
        router.push(`/note/${id}`)
    }
}

async function selectNoteAndCloseSidebar(id: string) {
    await selectNote(id)
    closeMobileSidebar()
}

function toggleMobileSidebar() {
    showMobileSidebar.value = !showMobileSidebar.value
}

function closeMobileSidebar() {
    showMobileSidebar.value = false
}

async function loadNoteContent(id: string) {
    isLoadingNote.value = true
    try {
        const note = getNoteById(id)
        if (note && note.jsonFile) {
            // Fetch JSON file from public folder
            const response = await fetch(`/json/${note.jsonFile}`)
            if (response.ok) {
                noteContent.value = await response.json()
            } else {
                throw new Error('Failed to load JSON file')
            }
        }
    } catch (error) {
        console.error('Error loading note:', error)
        noteContent.value = {
            sections: [
                {
                    type: 'heading',
                    level: 2,
                    text: 'Error'
                },
                {
                    type: 'paragraph',
                    text: 'Tidak dapat memuat catatan.'
                }
            ]
        }
    } finally {
        isLoadingNote.value = false
    }
}

async function downloadPDF() {
    if (!selectedNote.value || !noteContent.value) return
    
    // Load Quran data if not already loaded
    if (!quranDataService.isLoaded()) {
        try {
            await quranDataService.loadQuranData()
        } catch (error) {
            console.error('Failed to load Quran data for PDF:', error)
        }
    }
    
    // Enhanced PDF generation - match website styling
    let htmlContent = `
        <div class="header">
            <h1>${selectedNote.value.title}</h1>
            <p class="category">${selectedNote.value.category}</p>
        </div>
        <div class="content">
    `
    
    // Group sections like in the website
    const groupedSections: any[] = []
    let i = 0
    
    while (i < noteContent.value.sections.length) {
        const section = noteContent.value.sections[i]
        
        if (section.type === 'verse') {
            // Group consecutive verses
            const verseGroup = {
                type: 'verse-group',
                verses: [section]
            }
            
            let j = i + 1
            while (j < noteContent.value.sections.length) {
                const nextSection = noteContent.value.sections[j]
                
                if (nextSection.type === 'verse' && 
                    nextSection.chapter === section.chapter) {
                    verseGroup.verses.push(nextSection)
                    j++
                } else {
                    break
                }
            }
            
            if (verseGroup.verses.length === 1) {
                groupedSections.push(section)
            } else {
                groupedSections.push(verseGroup)
            }
            
            i = j
        } else {
            groupedSections.push(section)
            i++
        }
    }
    
    // Helper function to get verse data
    const getVerseData = (chapter: number, verse: number) => {
        return quranDataService.getVerseData(chapter, verse)
    }
    
    // Generate HTML for each section
    groupedSections.forEach(section => {
        switch (section.type) {
            case 'heading':
                if (section.level === 2) {
                    htmlContent += `<h2 class="section-heading">${section.text}</h2>`
                } else {
                    htmlContent += `<h${section.level}>${section.text}</h${section.level}>`
                }
                break
                
            case 'subheading':
                htmlContent += `<h3 class="subheading">${section.text}</h3>`
                if (section.reference) {
                    const verseData = getVerseData(section.reference.chapter, section.reference.verse as number)
                    htmlContent += `<p class="reference-inline">(QS. ${verseData?.surahName || 'Unknown'} ${section.reference.chapter}:${section.reference.verse})</p>`
                }
                break
                
            case 'paragraph':
                htmlContent += `<p class="paragraph">${section.text}</p>`
                break
                
            case 'definition':
                htmlContent += `
                    <div class="definition">
                        <span class="definition-bullet">•</span>
                        <div class="definition-content">
                            <strong>${section.term}</strong>: ${section.definition}
                            ${section.reference ? `<span class="reference-inline">(QS. ${getVerseData(section.reference.chapter, section.reference.verse as number)?.surahName || 'Unknown'} ${section.reference.chapter}:${section.reference.verse})</span>` : ''}
                        </div>
                    </div>
                `
                break
                
            case 'verse-group':
                htmlContent += `<div class="verse-card">`
                section.verses.forEach((verse: any, vIndex: number) => {
                    const verseData = getVerseData(verse.chapter, verse.verse as number)
                    htmlContent += `
                        <div class="verse-item">
                            ${vIndex > 0 ? '<hr class="verse-divider">' : ''}
                            <div class="arabic">${verseData?.arabic || ''} ${verseData?.arabicNumber || ''}</div>
                            <div class="translation">"${verseData?.translation || ''}"</div>
                        </div>
                    `
                })
                // Get verse range
                const verseRange = section.verses.length === 1 
                    ? section.verses[0].verse 
                    : `${section.verses[0].verse}-${section.verses[section.verses.length - 1].verse}`
                const firstVerseData = getVerseData(section.verses[0].chapter, section.verses[0].verse as number)
                htmlContent += `
                    <div class="verse-reference">
                        QS. ${firstVerseData?.surahName || 'Unknown'} ${section.verses[0].chapter}:${verseRange}
                    </div>
                </div>`
                break
                
            case 'verse':
                const verseData = getVerseData(section.chapter, section.verse as number)
                htmlContent += `
                    <div class="verse-card">
                        <div class="verse-item">
                            <div class="arabic">${verseData?.arabic || ''} ${verseData?.arabicNumber || ''}</div>
                            <div class="translation">"${verseData?.translation || ''}"</div>
                        </div>
                        <div class="verse-reference">
                            QS. ${verseData?.surahName || 'Unknown'} ${section.chapter}:${section.verse}
                        </div>
                    </div>
                `
                break
                
            case 'concept':
                htmlContent += `
                    <div class="concept">
                        ${section.title}
                        ${section.reference ? `<span class="reference-inline">(QS. ${getVerseData(section.reference.chapter, section.reference.verse as number)?.surahName || 'Unknown'} ${section.reference.chapter}:${section.reference.verse})</span>` : ''}
                    </div>
                `
                break
                
            case 'list':
                htmlContent += `<ol class="numbered-list">`
                section.items?.forEach((item: string, idx: number) => {
                    htmlContent += `
                        <li class="list-item">
                            <span class="list-number">${idx + 1}</span>
                            <span class="list-text">${item}</span>
                        </li>
                    `
                })
                htmlContent += `</ol>`
                break
                
            case 'divider':
                htmlContent += `<hr class="divider">`
                break
                
            case 'note':
                htmlContent += `
                    <div class="note-box">
                        <p class="note-text">${section.text}</p>
                    </div>
                `
                break
        }
    })
    
    htmlContent += `</div>` // Close content div
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${selectedNote.value.title}</title>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        font-family: 'Poppins', sans-serif; 
                        line-height: 1.6; 
                        color: #1f2937;
                        background: white;
                        font-size: 12pt;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 30px 40px;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 2px solid #dc2626;
                        padding-bottom: 20px;
                    }
                    
                    .header h1 { 
                        color: #1f2937; 
                        font-weight: 600;
                        font-size: 28pt;
                        margin-bottom: 8px;
                    }
                    
                    .category {
                        color: #dc2626;
                        font-size: 11pt;
                        font-weight: 500;
                    }
                    
                    .content {
                        max-width: 100%;
                    }
                    
                    .section-heading {
                        font-size: 16pt;
                        font-weight: 600;
                        color: #1f2937;
                        border-bottom: 2px solid #16a34a;
                        padding-bottom: 8px;
                        margin: 32px 0 16px 0;
                    }
                    
                    .subheading {
                        font-size: 14pt;
                        font-weight: 500;
                        color: #374151;
                        margin: 24px 0 12px 0;
                    }
                    
                    .paragraph {
                        color: #4b5563;
                        margin: 0 0 16px 0;
                        line-height: 1.7;
                    }
                    
                    .definition {
                        display: flex;
                        align-items: flex-start;
                        margin: 0 0 12px 16px;
                        gap: 8px;
                    }
                    
                    .definition-bullet {
                        color: #16a34a;
                        font-weight: 500;
                        margin-top: 2px;
                    }
                    
                    .definition-content {
                        flex: 1;
                    }
                    
                    .definition strong {
                        color: #1f2937;
                        font-weight: 600;
                    }
                    
                    .verse-card {
                        background: #fef2f2;
                        border: 1px solid #dc2626;
                        border-radius: 8px;
                        padding: 16px;
                        margin: 16px 0;
                        page-break-inside: avoid;
                    }
                    
                    .verse-item {
                        margin-bottom: 12px;
                    }
                    
                    .verse-item:last-of-type {
                        margin-bottom: 0;
                    }
                    
                    .verse-divider {
                        border: none;
                        border-top: 1px solid #fecaca;
                        margin: 12px 0;
                    }
                    
                    .arabic { 
                        font-family: 'Amiri', 'Traditional Arabic', serif;
                        font-size: 18pt; 
                        direction: rtl; 
                        text-align: right; 
                        color: #1f2937;
                        line-height: 1.8;
                        margin-bottom: 8px;
                    }
                    
                    .verse-reference {
                        text-align: left;
                        font-weight: 600;
                        color: #dc2626;
                        font-size: 10pt;
                        border-top: 1px solid #fecaca;
                        padding-top: 8px;
                        margin-top: 12px;
                    }
                    
                    .concept {
                        margin: 0 0 8px 24px;
                        color: #4b5563;
                    }
                    
                    .numbered-list {
                        margin: 16px 0 16px 16px;
                        list-style: none;
                        counter-reset: list-counter;
                    }
                    
                    .list-item {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 8px;
                        gap: 12px;
                        counter-increment: list-counter;
                    }
                    
                    .list-number {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: #dcfce7;
                        color: #16a34a;
                        font-size: 10pt;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                    
                    .list-number::before {
                        content: counter(list-counter);
                    }
                    
                    .list-text {
                        color: #4b5563;
                        margin-top: 2px;
                    }
                    
                    .divider {
                        border: none;
                        border-top: 1px solid #d1d5db;
                        margin: 32px 0;
                    }
                    
                    .note-box {
                        background: #fefce8;
                        border-left: 4px solid #eab308;
                        padding: 16px;
                        margin: 24px 0;
                    }
                    
                    .note-text {
                        color: #a16207;
                        font-style: italic;
                    }
                    
                    .reference-inline {
                        color: #dc2626;
                        font-size: 10pt;
                        font-weight: 400;
                        margin-left: 8px;
                    }
                    
                    /* Print-specific styles */
                    @media print {
                        body {
                            padding: 20px;
                            font-size: 11pt;
                        }
                        
                        .header h1 {
                            font-size: 24pt;
                        }
                        
                        .section-heading {
                            font-size: 14pt;
                        }
                        
                        .subheading {
                            font-size: 12pt;
                        }
                        
                        .arabic {
                            font-size: 16pt;
                        }
                        
                        .verse-card {
                            page-break-inside: avoid;
                        }
                        
                        .definition {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `)
        
        printWindow.document.close()
        printWindow.focus()
        
        setTimeout(() => {
            printWindow.print()
        }, 800)
    }
}

// Watch route changes
watch(() => route.params.id, (newId) => {
    if (newId && typeof newId === 'string') {
        const note = getNoteById(newId)
        if (note) {
            selectedNoteId.value = newId
            loadNoteContent(newId)
        }
    }
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
    // Check if we have a route parameter
    if (route.params.id && typeof route.params.id === 'string') {
        const note = getNoteById(route.params.id)
        if (note) {
            selectedNoteId.value = route.params.id
            loadNoteContent(route.params.id)
        } else {
            // Invalid note ID, redirect to home
            router.push('/')
        }
    } else if (notes.value.length > 0) {
        // Auto-select first note if no route parameter
        selectNote(notes.value[0].id)
    }
})

function updateSearchQuery(query: string) {
    searchQuery.value = query
}
</script>

<style scoped>
/* Clean minimal styling - most styling handled by Tailwind */
</style> 