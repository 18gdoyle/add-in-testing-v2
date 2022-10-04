import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import fs from "fs";
import path from "path";
import os from "os";



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 44355,

    headers: {
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "Expires": "-1",
      "Pragma": "no-cache"
    },
    https: {
      key: fs.readFileSync(
        path.resolve(`${os.homedir}/.office-addin-dev-certs/localhost.key`)
      ),
      cert: fs.readFileSync(
        path.resolve(`${os.homedir}/.office-addin-dev-certs/localhost.crt`)
      ),
      ca: fs.readFileSync(
        path.resolve(`${os.homedir}/.office-addin-dev-certs/ca.crt`)
      ),
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
