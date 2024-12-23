<template>
    <div>
        <InteractionForm />
        <List />
    </div>
</template>

<script setup>
    import { onMounted } from "vue"
    import List from "./components/List.vue";
    import InteractionForm from "./components/InteractionForm.vue"
    import { useMemoStore} from "./stores/memoStore.js"
    const memoStore = useMemoStore();
    onMounted(() => {
        memoStore.loadMemos()
    })
</script>

<style>
    /* Add your styles here */
</style>
