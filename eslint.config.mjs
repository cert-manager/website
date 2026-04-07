import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import reactPlugin from "@eslint-react/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";
import * as mdx from "eslint-plugin-mdx";
import globals from "globals";

export default defineConfig([
  // Global ignores (equivalent to an .eslintignore)
  globalIgnores([
    "out",
    "node_modules",
    ".github/actions/sync/node_modules",
    "**/node_modules",
    "**/out",
    "**/build",
    "**/.next",
  ]),

  // Base JS rules (eslint:recommended)
  js.configs.recommended,

  // React (@eslint-react) recommended rules (includes plugin, settings, and rules)
  reactPlugin.configs.recommended,

  // Next.js rules and JSX language options
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 13, // ES2022
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  // MDX support (files + embedded code blocks)
  // See: https://github.com/mdx-js/eslint-mdx#flat-config
  {
    ...mdx.flat,
  },
  {
    ...mdx.flatCodeBlocks,
    // Optionally override code-block rules here:
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // e.g. "no-var": "error", "prefer-const": "error",
    },
  },
]);
