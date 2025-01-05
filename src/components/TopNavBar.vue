<template>
    <div class="bg-gray-200 flex items-start gap-2 justify-around py-1 w-full px-2">
    <div class="flex items-start gap-2 justify-start w-full">
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
        <div>
            <a href="https://github.com/MrBhola/Bholenium" target="_blank">
                <svg aria-hidden="true" focusable="false" class="" viewBox="0 0 24 24" width="24" height="24" fill="black" style="display:inline-block;user-select:none;vertical-align:top;overflow:visible"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path></svg>
            </a>
        </div>
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
