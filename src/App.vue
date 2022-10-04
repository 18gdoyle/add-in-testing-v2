<script setup lang="ts">
</script>
<template>
    <div>
        <div class="authScreen" v-if="!accessTokenExists">
            <button @click="authorize" type="button">Click to authorize</button>
        </div>
        <div class="formSelection" v-if="accessTokenExists">
            <div>You are signed in</div>
            <div>Here are your forms</div>
            <div v-for="form in formsArray">
                -   {{form.name}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data: function() {
        return {
            accessTokenExists: false,
            formsArray: [] as any
        }
    },
    props: {
    },
    async mounted() {
        var requestOptions = {
            method: 'GET',
        };

        let response = await fetch("https://localhost:44355/api/getformstackforms", requestOptions)
        .then(async response => {return response.json()})
        .catch(async err => {return err});
        
        if (response.error) {
            this.accessTokenExists = false;
            return;
        }

        this.accessTokenExists = true;

        this.formsArray = response.forms;
    },
    methods: {
        authorize() {
            location.href="https://www.formstack.com/api/v2/oauth2/authorize?client_id=31415&redirect_uri=https%3A%2F%2Flocalhost%3A44355%2Fapi%252Fformstackauth&response_type=code"
        },
    }
})

</script>

<style>

</style>