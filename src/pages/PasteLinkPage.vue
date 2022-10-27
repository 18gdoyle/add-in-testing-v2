<script setup lang="ts">
</script>
<template>
    <div>
        <div v-if="loading">LOADING...</div>
        <input type="text" @paste="linkPasted" v-if="!accessTokenExists && !loading" />
        <div class="errorMessage" v-if="accessTokenError && !loading">
            There was an error getting formstack data. You might need a new auth token. You entered '{{pastedInput}}'
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as xl from '../excel'

export default defineComponent({
    data: function() {
        return {
            accessTokenExists: false,
            accessTokenError: false,
            formsArray: [] as any,
            loading: true,
            pastedInput: ''
        }
    },
    async mounted() {
        this.loading = true;

        let customProperties = await xl.getCustomProperties(['authToken']);
        
        if (customProperties.length === 0) {
            this.accessTokenExists = false;
            this.loading = false;
            return;
        }

        let response = await this.getForms(customProperties[0].value);

        if (response.error) {
            this.accessTokenError = true;
            this.loading = false;
            return;
        }

        this.accessTokenExists = true;
        this.accessTokenError = false;
        this.formsArray = response.forms;
        this.$emit('forms-loaded', this.formsArray);
    },
    methods: {
        async linkPasted(pastedEvent: ClipboardEvent) {
            this.loading = true;
            this.pastedInput = pastedEvent.clipboardData?.getData('text/plain') || '';
            let authToken = this.pastedInput;
            let response = await this.getForms(authToken);
            if (response.error) {
                this.accessTokenError = true;
                this.loading = false;
                return;
            }
            this.accessTokenExists = true;
            this.accessTokenError = false;
            await xl.setCustomProperties([{key: 'authToken', value: authToken}]);
            this.formsArray = response.forms;
            this.$emit('forms-loaded', this.formsArray);
        },
        async getForms(authToken: string) {
            var requestOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: authToken
                }
            };

            let response = await fetch("https://localhost:44355/api/getformstackforms", requestOptions)
            .then(async response => {return response.json()})
            .catch(async err => {return err});

            return response;
        }
    }
})

</script>

<style>

</style>
