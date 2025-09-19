import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// import { dependencies } from "./package.json";

// const errors = new Set([
//     // "@emotion/react",
//     // "@emotion/styled",
//     // "react-dom",
//     // "react",
//     "@emotion",
//     "react",
// ]);
// const dependenciesList = Object.keys(dependencies); //.filter(   (dep) => !errors.has(dep));

// // dependenciesList.push("@mui/utils");
// // dependenciesList.push("@mui/private-theming");
// // dependenciesList.push("@mui/base");
// dependenciesList.push("@mui/system");
// dependenciesList.push("@popperjs");
// // dependenciesList.push("@emotion");

const manualChunks = (id) => {
    if (id.endsWith(".css")) return "styles__css";
    else if (id.includes("node_modules")) {
        const libraryName = id.includes("@mui")
            ? id.match(/node_modules\/(.*?)\/(.*?)\//)[2]
            : id.match(/node_modules\/(.*?)\//)[1];

        if (libraryName.includes("react") || libraryName.includes("emotion"))
            return "vendor_react";

        return `vendor_${libraryName}`;
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
