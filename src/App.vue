<script setup lang="ts">
import PasteLinkPage from './pages/PasteLinkPage.vue'
import FormSelectionPage from './pages/FormSelectionPage.vue';
</script>
<template>
    <div>
        <PasteLinkPage
            v-if="formsArray.length === 0"
            @forms-loaded="formsLoaded"
        ></PasteLinkPage>
        <FormSelectionPage
            v-if="formsArray.length !== 0"
            :formsArray="formsArray"
        ></FormSelectionPage>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data: function() {
        return {
            formsArray: [] as any,
        }
    },
    methods: {
        formsLoaded(formsArray: Array<any>) {
            this.formsArray = formsArray;
        }
    }
})

</script>

<style>

</style>