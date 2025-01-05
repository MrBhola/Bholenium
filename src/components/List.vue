<template>
    <div class="p-4 bg-gray-50 mt-2 rounded-lg shadow-md space-y-4">
        <!-- Your Tests Section -->
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-800">Your Tests</h2>
            <ul class="space-y-2">
                <li
                    v-for="item in store.interactions"
                    :key="item.id"
                    class="p-2 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center"
                >
                    <p
                        @click="store.loadInteraction(item.id)"
                        class="cursor-pointer hover:underline font-medium"
                    >
                        <span v-if="item.id === store.selectedInteractionId" class="text-indigo-600">
                        {{ item.title }}
                        </span>
                        <span v-else class="text-gray-600">
                        {{ item.title }}
                        </span>
                    </p>
                    <div class="flex space-x-2">
                        <button
                            @click="store.deleteInteraction(item.id)"
                            class="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            Delete
                        </button>
                        <button
                            @click="store.exportSelectedInteractions([item.id], item.title)"
                            class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Export
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <hr class="border-gray-300">

        <!-- Current Test Commands Section -->
        <div class="space-y-4">
            <p class="text-lg font-semibold text-gray-700">Current Test Commands</p>
            <ul v-if="store.recordedActions.length" class="space-y-3">
                <li
                    v-for="command in store.recordedActions"
                    :key="command.id"
                    class="p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                >
                    <p class="text-sm text-gray-700">
                        {{ `Action: ${command.action}, Target: ${command.selector.target}, Target Type: ${command.selector.type}, Value: ${command.value || "N/A"}` }}
                    </p>
                </li>
            </ul>
            <p v-else class="text-sm text-gray-500">No recorded commands available.</p>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, computed } from "vue"
    import { useInteractionStore } from "../stores/interactionStore.js"

    const store = useInteractionStore();

    onMounted(() => {
        store.getInteractionList()
    })
</script>
