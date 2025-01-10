import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { dependencies } from "./package.json";

const errors = new Set([
    "@emotion/react",
    "@emotion/styled",
    "react-dom",
    "react",
]);
const dependenciesList = Object.keys(dependencies).filter(
    (dep) => !errors.has(dep),
);

const manualChunks = (id) => {
    if (id.includes("node_modules")) {
        for (const dep of dependenciesList) {
            if (id.includes(dep)) {
                return `vendor_${dep}`;
            }
        }
        return "vendor";
    }

    if (id.endsWith(".css")) {
        return "styles";
    }
};

// export { manualChunks };

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: manualChunks,
            },
        },
        // minify: "terser",
        chunkSizeWarningLimit: 1024,
    },
});
