import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      insertTypesEntry: true,
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: [
        resolve(__dirname, "src/index.ts"),
        resolve(__dirname, "src/styles/globals.css"),
      ],
      name: "@MattOfficial/veloce-ui",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (entryName === "styles") {
          return "styles.css";
        }
        if (format === "es") return "index.js";
        if (format === "cjs") return "index.cjs";
        return `index.${format}`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-hook-form"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
