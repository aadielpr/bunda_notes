<template>
  <aside 
    class="w-80 bg-white border-r border-gray-200 flex-shrink-0 shadow-sm overflow-y-auto"
    :class="[
      'lg:relative lg:translate-x-0 lg:h-screen',
      showMobileSidebar 
        ? 'fixed inset-y-0 left-0 z-50 transform translate-x-0 transition-transform duration-300 ease-in-out' 
        : 'lg:block hidden lg:translate-x-0 -translate-x-full'
    ]"
  >
    <div class="p-6">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="/MT AZ-ZAHRA Pekanbaru.png" alt="MT Az-Zahra Pekanbaru Logo" class="h-32 w-auto" />
      </div>
      
      <!-- Mobile Close Button -->
      <div class="flex justify-between items-center mb-6 lg:hidden">
        <h2 class="text-base font-bold text-gray-900">Menu</h2>
        <button 
          @click="closeMobileSidebar"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Search -->
      <div class="mb-8">
        <input 
          :value="searchQuery"
          @input="updateSearchQuery"
          type="text" 
          placeholder="Cari catatan..." 
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-xs bg-white transition-all duration-200"
        >
      </div>
      
      <!-- Notes List -->
      <nav>
        <ul class="space-y-2">
          <li 
            v-for="note in filteredNotes" 
            :key="note.id"
            @click="selectNoteAndCloseSidebar(note.id)"
            class="cursor-pointer transition-all duration-200 group rounded-lg p-3 hover:bg-green-50 border border-transparent hover:border-green-200"
            :class="[
              selectedNoteId === note.id ? 'bg-red-50 border-red-200 shadow-sm' : '',
              isLoadingNote ? 'pointer-events-none opacity-60' : ''
            ]"
          >
            <div class="space-y-1.5">
              <h3 
                class="font-semibold text-xs leading-tight"
                :class="selectedNoteId === note.id 
                  ? 'text-red-900' 
                  : 'text-gray-900 group-hover:text-green-700'"
              >
                {{ note.title }}
                <div v-if="isLoadingNote && selectedNoteId === note.id" 
                     class="ml-2 inline-block animate-spin rounded-full h-3 w-3 border border-red-600 border-t-transparent">
                </div>
              </h3>
              <p class="text-xs text-gray-500">{{ note.category }}</p>
            </div>
          </li>
        </ul>
      </nav>
      
      <div v-if="filteredNotes.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-3">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-xs">Tidak ada catatan yang ditemukan.</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Type definitions
interface Note {
  id: string
  title: string
  category: string
  jsonFile: string
}

// Props
interface Props {
  notes: Note[]
  searchQuery: string
  selectedNoteId: string | null
  showMobileSidebar: boolean
  isLoadingNote: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'select-note': [id: string]
  'select-note-and-close': [id: string]
  'close-mobile-sidebar': []
  'update-search-query': [query: string]
}>()

// Computed
const filteredNotes = computed(() => {
  return props.notes.filter(note => 
    note.title.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(props.searchQuery.toLowerCase())
  )
})

// Methods
function selectNoteAndCloseSidebar(id: string) {
  emit('select-note-and-close', id)
}

function closeMobileSidebar() {
  emit('close-mobile-sidebar')
}

function updateSearchQuery(event: Event) {
  const target = event.target as HTMLInputElement
  if (target) {
    emit('update-search-query', target.value)
  }
}
</script> 