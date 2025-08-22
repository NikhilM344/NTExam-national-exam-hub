// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const repoName = "NTExam-national-exam-hub"; // ← change if your repo name is different

  return {
    // Needed for GitHub Pages (repo site). For user/org site (username.github.io), set base: "/"
    base: isProd ? `/${repoName}/` : "/",

    server: {
      host: "::", // listen on all addresses; use true if this gives trouble on Windows
      port: 8080,
    },

    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  };
});

