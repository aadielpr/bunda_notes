<template>
    <div class="my-3 lg:my-4 p-3 lg:p-4 bg-red-50/30 rounded-lg border border-red-400">
        <!-- Arabic Text -->
        <div class="text-right mb-2">
            <p class="arabic">
                {{ `${verseData?.arabic} ${verseData?.arabicNumber}` }}
            </p>
        </div>

        <!-- Indonesian Translation -->
        <div class="text-left mb-3">
            <p class="text-sm lg:text-base leading-relaxed text-gray-700 italic">
                "{{ verseData?.translation }}"
            </p>
        </div>

        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <p class="text-xs lg:text-sm text-red-600 font-medium">
                QS. {{ verseData?.surahName }} {{ chapter }}:{{ verse }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    chapter: number
    verse: number | string
    verseData?: {
        arabic: string
        translation: string
        surahName: string
        surahNumber: number
        ayahNumber: string
        arabicNumber: string
    } | null
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