<script setup>
    import { useInteractionStore } from "../stores/interactionStore.js"
    const store = useInteractionStore()
</script>
<template>
    <div>
        <div class="flex flex-col items-start gap-4 p-4 mt-2 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
            <input
                v-model="store.url"
                type="url"
                placeholder="example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
            <input
                v-model="store.title"
                type="text"
                placeholder="title"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
            <div class="flex justify-between w-full gap-4">
                <button
                    @click="store.handleOpenAndRecord"
                    class="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                    Record
                </button>
                <button
                    @click="store.handlePlay"
                    class="flex-1 px-4 py-2 text-white bg-green-600 rounded-md shadow hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                    Play
                </button>
                <button
                    @click="store.addInteraction"
                    class="flex-1 px-4 py-2 text-white bg-gray-800 rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
