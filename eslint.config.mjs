import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "out",
    "node_modules",
    ".github/actions/sync/node_modules",
    "**/node_modules",
    "**/out",
    "**/build",
    "**/.next",
]), {
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@next/next/recommended",
        "plugin:react/recommended",
        "plugin:mdx/recommended",
    ),

    plugins: {
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 13,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/jsx-no-target-blank": "off",
    },
}]);