<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white p-4 lg:p-6">
      <div class="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl lg:text-2xl font-semibold text-gray-900 truncate">
            {{ note.title }}
          </h1>
        </div>
        <span 
          @click="emit('download-pdf')" 
          class="text-red-600 hover:text-red-700 underline cursor-pointer text-sm font-medium"
        >
          Download PDF
        </span>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 overflow-auto bg-gray-50/30">
      <div class="max-w-4xl mx-auto p-4 lg:p-8">
        <div v-if="content" class="space-y-4 lg:space-y-6">
          <template v-for="(section, index) in groupedSections" :key="index">
            
            <!-- Heading -->
            <div v-if="section.type === 'heading'" 
                 class="mt-6 lg:mt-8 first:mt-0">
              <h2 v-if="section.level === 2" 
                  class="text-lg lg:text-xl font-semibold text-gray-900 border-b-2 border-green-200 pb-2 mb-3 lg:mb-4">
                {{ section.text }}
              </h2>
            </div>

            <!-- Subheading -->
            <div v-else-if="section.type === 'subheading'" 
                 class="mt-4 lg:mt-6">
              <h3 class="text-base lg:text-lg font-medium text-gray-800 mb-2 lg:mb-3">
                {{ section.text }}
                <span v-if="section.reference" class="block sm:inline text-sm text-red-600 font-normal sm:ml-2 mt-1 sm:mt-0">
                  ({{ section.reference.surah }} {{ section.reference.chapter }}:{{ section.reference.verse }})
                </span>
              </h3>
            </div>

            <!-- Paragraph -->
            <div v-else-if="section.type === 'paragraph'" 
                 class="text-gray-700 leading-relaxed text-sm lg:text-base">
              {{ section.text }}
            </div>

            <!-- Definition -->
            <div v-else-if="section.type === 'definition'" 
                 class="ml-2 lg:ml-4 mb-2 lg:mb-3">
              <div class="flex items-start space-x-2">
                <span class="text-green-600 font-medium text-sm lg:text-base">•</span>
                <div class="text-sm lg:text-base">
                  <span class="font-semibold text-gray-900">{{ section.term }}</span>: 
                  <span class="text-gray-700">{{ section.definition }}</span>
                  <span v-if="section.reference" class="block sm:inline text-xs lg:text-sm text-red-600 sm:ml-2 mt-1 sm:mt-0">
                    ({{ section.reference.surah }} {{ section.reference.chapter }}:{{ section.reference.verse }})
                  </span>
                </div>
              </div>
            </div>

            <!-- Verse Group -->
            <div v-else-if="section.type === 'verse-group'" 
                 class="my-3 lg:my-4 p-3 lg:p-4 bg-red-50/30 rounded-lg border border-red-400">
              <div v-for="(verse, vIndex) in section.verses" :key="vIndex" 
                   class="mb-3 lg:mb-4 last:mb-0">
                <!-- Divider between verses (not for first verse) -->
                <div v-if="vIndex > 0" class="my-3 lg:my-4">
                  <hr class="border-red-200">
                </div>
                <!-- Arabic Text -->
                <div class="text-right mb-2">
                  <p class="text-2xl lg:text-4xl xl:text-5xl leading-relaxed text-gray-900 font-arabic" 
                     style="font-family: 'Omar', serif; direction: rtl; line-height: 2.2; font-weight: 500;">
                    {{ verse.arabic }}
                  </p>
                </div>
                
                <!-- Indonesian Translation -->
                <div v-if="verse.indonesian" class="text-left mb-2">
                  <p class="text-sm lg:text-base leading-relaxed text-gray-700 italic">
                    "{{ verse.indonesian }}"
                  </p>
                </div>
              </div>
              
              <!-- Combined reference at the bottom -->
              <div class="text-left mt-2 lg:mt-3 pt-2 border-t border-red-200">
                <p class="text-xs lg:text-sm text-red-600 font-medium">
                  QS. {{ section.verses[0].surah }} {{ section.verses[0].chapter }}:{{ getVerseRange(section.verses) }}
                </p>
              </div>
            </div>

            <!-- Single Verse -->
            <div v-else-if="section.type === 'verse'" 
                 class="my-3 lg:my-4 p-3 lg:p-4 bg-red-50/30 rounded-lg border border-red-400">
              <!-- Arabic Text -->
              <div class="text-right mb-2">
                <p class="text-2xl lg:text-4xl xl:text-5xl leading-relaxed text-gray-900 font-arabic" 
                   style="font-family: 'Omar', serif; direction: rtl; line-height: 2.2; font-weight: 500;">
                  {{ section.arabic }}
                </p>
              </div>
              
              <!-- Indonesian Translation -->
              <div v-if="section.indonesian" class="text-left mb-3">
                <p class="text-sm lg:text-base leading-relaxed text-gray-700 italic">
                  "{{ section.indonesian }}"
                </p>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <p class="text-xs lg:text-sm text-red-600 font-medium">
                  QS. {{ section.surah }} {{ section.chapter }}:{{ section.verse }}
                </p>
              </div>
            </div>

            <!-- Concept -->
            <div v-else-if="section.type === 'concept'" 
                 class="ml-3 lg:ml-6 mb-2">
              <span class="text-gray-700 text-sm lg:text-base">{{ section.title }}</span>
              <span v-if="section.reference" class="block sm:inline text-xs lg:text-sm text-red-600 sm:ml-2 mt-1 sm:mt-0">
                ({{ section.reference.surah }} {{ section.reference.chapter }}:{{ section.reference.verse }})
              </span>
            </div>

            <!-- List -->
            <div v-else-if="section.type === 'list'" 
                 class="ml-2 lg:ml-4">
              <ol class="space-y-2">
                <li v-for="(item, idx) in section.items" :key="idx" 
                    class="flex items-start space-x-2 lg:space-x-3">
                  <span class="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-green-100 text-green-700 text-xs lg:text-sm font-medium flex items-center justify-center mt-0.5">
                    {{ idx + 1 }}
                  </span>
                  <span class="text-gray-700 text-sm lg:text-base">{{ item }}</span>
                </li>
              </ol>
            </div>

            <!-- Divider -->
            <div v-else-if="section.type === 'divider'" 
                 class="my-6 lg:my-8">
              <hr class="border-gray-300">
            </div>

            <!-- Note -->
            <div v-else-if="section.type === 'note'" 
                 class="bg-yellow-50 border-l-4 border-yellow-400 p-3 lg:p-4 my-4 lg:my-6">
              <p class="text-yellow-800 italic text-sm lg:text-base">{{ section.text }}</p>
            </div>

          </template>
        </div>
        
        <div v-else class="text-center py-8 lg:py-12">
          <p class="text-gray-600 text-sm lg:text-base">Memuat konten...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
    note: {
        id: string
        title: string
        category: string
        jsonFile: string
    }
    content: {
        sections: Array<{
            type: string
            level?: number
            text?: string
            term?: string
            definition?: string
            arabic?: string
            indonesian?: string
            surah?: string
            chapter?: number
            verse?: string | number
            items?: string[]
            verses?: Array<{
                arabic: string
                indonesian?: string
                surah: string
                chapter: number
                verse: string | number
            }>
        }>
    } | null
}

// Emits
const emit = defineEmits<{
    'download-pdf': []
}>()

const props = defineProps<Props>()

// Computed properties
const groupedSections = computed(() => {
    if (!props.content || !props.content.sections) return []
    
    const grouped: any[] = []
    let i = 0
    
    while (i < props.content.sections.length) {
        const section = props.content.sections[i]
        
        if (section.type === 'verse') {
            // Start a verse group
            const verseGroup = {
                type: 'verse-group',
                verses: [section]
            }
            
            // Look ahead for consecutive verses from the same surah
            let j = i + 1
            while (j < props.content.sections.length) {
                const nextSection = props.content.sections[j]
                
                if (nextSection.type === 'verse' && 
                    nextSection.surah === section.surah &&
                    nextSection.chapter === section.chapter) {
                    verseGroup.verses.push(nextSection)
                    j++
                } else {
                    break
                }
            }
            
            // If only one verse, keep it as single verse, otherwise group them
            if (verseGroup.verses.length === 1) {
                grouped.push(section)
            } else {
                grouped.push(verseGroup)
            }
            
            i = j
        } else {
            grouped.push(section)
            i++
        }
    }
    
    return grouped
})

// Methods
function getVerseRange(verses: any[]) {
    if (verses.length === 1) {
        return verses[0].verse
    }
    
    // Extract verse numbers and sort them
    const verseNumbers = verses.map(v => {
        const verseStr = String(v.verse)
        // Handle ranges like "8-9" or single numbers
        if (verseStr.includes('-')) {
            const [start, end] = verseStr.split('-').map((n: string) => parseInt(n))
            return { start, end, original: v.verse }
        } else {
            const num = parseInt(verseStr)
            return { start: num, end: num, original: v.verse }
        }
    }).sort((a, b) => a.start - b.start)
    
    // If verses are consecutive, create a range
    const firstVerse = verseNumbers[0].start
    const lastVerse = verseNumbers[verseNumbers.length - 1].end
    
    if (lastVerse - firstVerse === verses.length - 1) {
        return `${firstVerse}-${lastVerse}`
    } else {
        // If not consecutive, join them with commas
        return verseNumbers.map(v => v.original).join(', ')
    }
}
</script>

<style scoped>
.font-arabic {
  font-family: 'Omar', serif;
  direction: rtl;
  line-height: 2.2;
  font-weight: 500;
}
</style> 