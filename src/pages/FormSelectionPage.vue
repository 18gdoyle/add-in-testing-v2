<script setup lang="ts">
</script>
<template>
    <div>
        <div>Here are your forms</div>
        <label v-for="form in formsArray"><input type="checkbox" @click="formSelected(form.id, form.name)">{{form.name}}</label>
        <button type="button" @click="submitSelectedForms">Submit</button>
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
            selectedForms: [] as any,
        }
    },
    props: {
        formsArray: Array<any>
    },
    methods: {
        formSelected(formID: string, formName: string) {
            var index = this.selectedForms.indexOf(formID);
            if (index === -1) {
                this.selectedForms.push({id: formID, name: formName, submissions: null});
            } else {
                this.selectedForms.splice(index, 1);
            }
        },
        async submitSelectedForms() {
            for (const form of this.selectedForms) {
                form.submissions = await this.getFormSubmissions(form.id);
                console.dir(this.selectedForms);
            }
            xl.writeToSpreadSheet();
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

            let formSubmissionResponses = [];

            for (let i = 0; i < response.submissions.length; i++) {
                let result = await this.getFormSubmissionResponses(response.submissions[i].id);
                formSubmissionResponses.push(result);
            }

            return formSubmissionResponses;
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

            return response;
        }
    }
})

</script>

<style>

</style>
