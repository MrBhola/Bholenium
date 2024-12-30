<template>
    <div class="bg-cyan-200 flex items-end gap-2 justify-end w-full pr-2">
        <button
            @click="store.exportAllData"
            type="button"
            class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <CloudArrowDownIcon class="-mr-0.5 size-5" aria-hidden="true" />
            <span>Export</span>
        </button>

        <button
            @click="triggerFileInput"
            type="button"
            class="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
            <CloudArrowUpIcon class="-mr-0.5 size-5" aria-hidden="true"/>
            <span>Import</span>
        </button>

        <!-- Hidden file input -->
        <input
            type="file"
            class="hidden"
            @change="handleFileChange"
            ref="fileInput"
        />
    </div>
</template>

<script setup>
    import { CloudArrowDownIcon, CloudArrowUpIcon } from "@heroicons/vue/20/solid/index.js";
    import { ref } from "vue";
    import { useInteractionStore } from "../stores/interactionStore.js";

    const store = useInteractionStore();
    const fileInput = ref(null);

    const triggerFileInput = () => {
        fileInput.value.click(); // Trigger the hidden file input
    };

    const handleFileChange = async () => {
        const file = fileInput.value.files[0]; // Access the selected file

        if (file) {
            try {
                const result = await store.importData(file);
                if (result === "success") {
                    alert("Data imported successfully!");

                    // Reset the input value without triggering @change again
                    fileInput.value.value = ""; // Clear the file input
                }
            } catch (error) {
                alert("Failed to import data. Please check the file and try again.");
            }
        } else {
            console.error("No file selected.");
        }
    };
</script>
