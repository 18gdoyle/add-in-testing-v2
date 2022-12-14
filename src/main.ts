import { createApp } from "vue";
import App from "./App.vue";

Office.onReady(() => {
    const app = createApp(App);
    app.mount("#app");
});
