import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // Boilerplate slices are examples until an application adopts them.
      "fsd/insignificant-slice": "off",
    },
  },
  {
    files: ["./src/app/**"],
    rules: {
      // Kavano app segments intentionally group layouts and providers.
      "fsd/no-reserved-folder-names": "off",
      "fsd/segments-by-purpose": "off",
    },
  },
]);
