<script setup lang="ts">
</script>
<template>
    <div>
        <input type="text" @paste="linkPasted" v-if="!accessTokenExists" />
        <div class="formSelection" v-if="accessTokenExists">
            <div>Here are your forms</div>
            <div v-for="form in formsArray">
                <br />
                <button @click="getFormSubmissions(form.id)">{{form.name}}</button>
            </div>
        </div>
        <div class="errorMessage" v-if="accessTokenError">
            There was an error getting formstack data. You might need a new auth token
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as xl from './excel'

export default defineComponent({
    data: function() {
        return {
            accessTokenExists: false,
            accessTokenError: false,
            formsArray: [] as any
        }
    },
    props: {
    },
    async mounted() {
        let customProperties = await xl.getCustomProperties(['authToken']);
        
        if (customProperties.length === 0) {
            this.accessTokenExists = false;
            return;
        }

        let response = await this.getForms(customProperties[0].value);
        if (response.error) {
            this.accessTokenError = true;
            return;
        }
        this.accessTokenExists = true;
        this.accessTokenError = false;
        this.formsArray = response.forms;
        console.dir(this.formsArray);
    },
    methods: {
        async linkPasted(pastedEvent: ClipboardEvent) {
            let authToken = pastedEvent.clipboardData?.getData('text/plain') || '';
            let response = await this.getForms(authToken);
            if (response.error) {
                this.accessTokenError = true;
                return;
            }
            this.accessTokenExists = true;
            this.accessTokenError = false;
            await xl.setCustomProperties([{key: 'authToken', value: authToken}]);
            this.formsArray = response.forms;
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
        },
        async getFormSubmissions(formID: string) {
            let authToken = (await xl.getCustomProperties(['authToken']))[0].value;
            var requestOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: authToken,
                    formid: formID
                }
            };

            let response = await fetch("https://localhost:44355/api/getformstackformsubmissions", requestOptions)
            .then(async response => {return response.json()})
            .catch(async err => {return err});

            if (response.error) {
                console.dir(response);
                return;
            }

            for (let i = 0; i < response.submissions.length; i++) {
                this.getFormSubmissionResponses(response.submissions[i].id);
            }
            //return response;
        },
        async getFormSubmissionResponses(submssionID: string) {
            let authToken = (await xl.getCustomProperties(['authToken']))[0].value;
            var requestOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: authToken,
                    submissionid: submssionID
                }
            };

            let response = await fetch("https://localhost:44355/api/getformstacksubmissionresponse", requestOptions)
            .then(async response => {return response.json()})
            .catch(async err => {return err});

            console.dir(response);
        }
    }
})

</script>

<style>

</style>