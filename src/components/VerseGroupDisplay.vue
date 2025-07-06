<template>
    <div class="my-3 lg:my-4 p-3 lg:p-4 bg-red-50/30 rounded-lg border border-red-400">
        <div v-for="(verse, vIndex) in verses" :key="vIndex" class="mb-3 lg:mb-4 last:mb-0">
            <!-- Divider between verses (not for first verse) -->
            <div v-if="vIndex > 0" class="my-3 lg:my-4">
                <hr class="border-red-200">
            </div>

            <!-- Arabic Text -->
            <div class="text-right mb-2">
                <p class="arabic">
                    {{ `${getVerseData(verse.chapter, verse.verse)?.arabic} ${getVerseData(verse.chapter,
                        verse.verse)?.arabicNumber}` }}
                </p>
            </div>

            <!-- Indonesian Translation -->
            <div class="text-left mb-2">
                <p class="text-sm lg:text-base leading-relaxed text-gray-700 italic">
                    "{{ getVerseData(verse.chapter, verse.verse)?.translation }}"
                </p>
            </div>
        </div>

        <!-- Combined reference at the bottom -->
        <div class="text-left mt-2 lg:mt-3 pt-2 border-t border-red-200">
            <p class="text-xs lg:text-sm text-red-600 font-medium">
                QS. {{ getVerseData(verses[0].chapter, verses[0].verse)?.surahName }} {{ verses[0].chapter }}:{{
                getVerseRange(verses) }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Verse {
    chapter: number
    verse: number | string
}

interface Props {
    verses: Verse[]
    getVerseData: (chapter: number, verse: number | string) => any
    getVerseRange: (verses: Verse[]) => string
}

defineProps<Props>()
</script>

<style scoped>
.arabic {
    font-family: 'Amiri', 'Traditional Arabic', serif;
    font-size: 18pt;
    direction: rtl;
    text-align: right;
    color: #1f2937;
    line-height: 1.8;
    margin-bottom: 8px;
}
</style>