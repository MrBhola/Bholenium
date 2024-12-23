<template>
    <div>
        <div>
            <h2>Your Tests</h2>
            <ul>
                <li v-for="item in store.interactions" :key="item.id">
                    <p @click="store.loadInteraction(item.id)" >{{ item.title }}</p>
                    <button @click="store.deleteInteraction(item.id)">Delete</button>
                </li>
            </ul>
        </div>
        <hr>
        <div>
            <p>Current test Commands</p>
            <ul v-if="store.recordedActions.length">
                <li v-for="command in store.recordedActions" :key="command.id">
                    <p >{{`Action: ${command.action}, Target: ${command.selector.target}, Target Type: ${command.selector.type} Value: ${command.value || "N/A"}`}}</p>
                </li>
            </ul>
        </div>

    </div>
</template>

<script setup>
    import { onMounted } from "vue"
    import { useInteractionStore } from "../stores/interactionStore.js"

    const store = useInteractionStore();

    onMounted(() => {
        store.getInteractionList()
    })

</script>
