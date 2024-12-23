import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json", // Source file
          dest: "." // Destination directory within 'dist'
        },
        {
          src: "background.js",
          dest: "."
        },
        {
          src: "content.js",
          dest: "."
        },
        {
          src: "replay.js",
          dest: "."
        }
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
});
