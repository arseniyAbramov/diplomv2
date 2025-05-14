import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.js", "resources/js/index.jsx.jsx"],
            refresh: true,
        }),
        react(),
    ],
});
