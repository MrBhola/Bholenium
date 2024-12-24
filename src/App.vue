<template>
    <div>
        <div>
            <button @click="store.exportAllData">Export Data</button>
            <!-- Bind the file input -->
            <p>Import data</p>
            <input type="file" placeholder="Import Data" @change="handleFileChange" ref="fileInput" />
        </div>
        <InteractionForm />
        <List />
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import List from "./components/List.vue";
    import InteractionForm from "./components/InteractionForm.vue";
    import { useInteractionStore } from "./stores/interactionStore.js";

    const store = useInteractionStore();
    const fileInput = ref(null); // Ref for the input element

    onMounted(() => {
        store.getInteractionList();
    });

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

<style>
    /* Add your styles here */
</style>
