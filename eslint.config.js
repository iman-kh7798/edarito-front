import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      boundaries,
      prettier,
    },

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },

      "boundaries/elements": [
        { type: "app", pattern: "src/app/*" },
        { type: "processes", pattern: "src/processes/*" },
        { type: "pages", pattern: "src/pages/*" },
        { type: "widgets", pattern: "src/widgets/*" },
        { type: "features", pattern: "src/features/*" },
        { type: "entities", pattern: "src/entities/*" },
        { type: "shared", pattern: "src/shared/*" },
      ],
    },

    rules: {
      "prettier/prettier": "error",

      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: [
                "app",
                "processes",
                "pages",
                "widgets",
                "features",
                "entities",
                "shared",
              ],
            },
            {
              from: "pages",
              allow: ["pages", "widgets", "features", "entities", "shared"],
            },
            {
              from: "widgets",
              allow: ["widgets", "features", "entities", "shared"],
            },
            { from: "entities", allow: ["entities", "shared"] },
            { from: "shared", allow: ["features", "shared"] },
            { from: "features", allow: ["features", "entities", "shared"] },
            {
              from: "processes",
              allow: [
                "processes",
                "pages",
                "widgets",
                "features",
                "entities",
                "shared",
              ],
            },
          ],
        },
      ],

      "import/no-internal-modules": [
        "error",
        {
          allow: [
            "**/index.ts",
            "**/index.tsx",
            "**/ui/**",
            "**/api/**",
            "**/model/**",
            "**/lib/**",
            "**/configs/**",
            "**/styles/**",
            "**/router/**",
            "**/app/**",
            "react-dom/client",
            "react-date-object/**",
          ],
        },
      ],

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },

  {
    ignores: ["node_modules", "dist", "build"],
  },
];
