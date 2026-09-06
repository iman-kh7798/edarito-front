import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      "jsx-a11y": jsxA11y,
    },

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },

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
        { type: "pages", pattern: "src/pages/*" },
        { type: "widgets", pattern: "src/widgets/*" },
        { type: "features", pattern: "src/features/*" },
        { type: "entities", pattern: "src/entities/*" },
        { type: "shared", pattern: "src/shared/*" },
      ],
    },

    rules: {
      "prettier/prettier": "error",

      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: { type: "app" },
              allow: {
                to: {
                  type: [
                    "app",
                    "pages",
                    "widgets",
                    "features",
                    "entities",
                    "shared",
                  ],
                },
              },
            },
            {
              from: { type: "pages" },
              allow: {
                to: { type: ["widgets", "features", "entities", "shared"] },
              },
            },
            {
              from: { type: "widgets" },
              allow: { to: { type: ["features", "entities", "shared"] } },
            },
            {
              from: { type: "features" },
              allow: { to: { type: ["entities", "shared"] } },
            },
            {
              from: { type: "entities" },
              allow: { to: { type: ["shared"] } },
            },
            {
              from: { type: "shared" },
              allow: { to: { type: ["shared"] } },
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
            "vitest/config",
            "@testing-library/jest-dom/vitest",
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
    files: ["src/**/*.test.{ts,tsx}"],
    plugins: {
      ...vitest.configs.recommended.plugins,
      ...testingLibrary.configs["flat/react"].plugins,
    },
    languageOptions: {
      globals: globals.vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs["flat/react"].rules,
    },
  },

  {
    files: ["e2e/**/*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "import/no-internal-modules": "off",
    },
  },

  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "playwright-report",
      "test-results",
    ],
  },
];
