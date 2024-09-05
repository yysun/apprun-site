import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Disallow `console.log` and `console.error`, but allow other console methods
      'no-console': ['error', { allow: ['warn', 'info', 'debug'] }],
    }
  },
];