<template>
    <div>
        <TopNavBar/>
        <InteractionForm />
        <List />
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import TopNavBar from "./components/TopNavBar.vue"
    import List from "./components/List.vue";
    import InteractionForm from "./components/InteractionForm.vue";
    import { useInteractionStore } from "./stores/interactionStore.js";

    const store = useInteractionStore();

    onMounted(() => {
        store.getInteractionList();
    });

</script>
