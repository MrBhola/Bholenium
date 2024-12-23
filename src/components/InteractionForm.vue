<script setup>
    import { useInteractionStore } from "../stores/interactionStore.js"
    const store = useInteractionStore()
</script>
<template>
    <div>
        <h2>Bholenium test</h2>
        <input v-model="store.url" type="url" placeholder="example.com" />
        <input v-model="store.title" type="text" placeholder="title" />
        <button @click="store.handleOpenAndRecord" >Open and Record</button>
        <button @click="store.handlePlay" >Play</button>
        <button @click="store.addInteraction">save</button>
    </div>
</template>
