<script setup lang="ts">
</script>
<template>
    <div>
        <input type="text" @paste="linkPasted" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const request = require('request');

export default defineComponent({
    data: function() {
        return {
        }
    },
    props: {
    },
    async mounted() {
    },
    methods: {
        async linkPasted(pastedEvent: ClipboardEvent) {
            let pastedInput = pastedEvent.clipboardData?.getData('text/plain');

            const options = {
                url: 'https://api.github.com/repos/request/request',
                headers: {
                    'User-Agent': 'request'
                }
            };

            request(options, (error: any, response: any, body: any) => {
                if (!error && response.statusCode == 200) {
                    const info = JSON.parse(body);
                    console.log(info.stargazers_count + " Stars");
                    console.log(info.forks_count + " Forks");
                }
            });
            /*
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer 7178eb3eb94663c61d561cf532ddf8b5'
                }
            };

            fetch('https://na-qjcwa.formstack.com/api/v1/forms?api_key=7178eb3eb94663c61d561cf532ddf8b5', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
            */
        },
    }
})

</script>

<style>

</style>