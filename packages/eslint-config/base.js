import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"
import importPlugin from "eslint-plugin-import"
import prettierPlugin from "eslint-plugin-prettier"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      "unused-imports": unusedImports,
      "import": importPlugin,
      "prettier": prettierPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "unused-imports/no-unused-imports": "warn",
      "no-console": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "prettier/prettier": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "args": "after-used",
          "ignoreRestSiblings": false,
          "argsIgnorePattern": "^_.*?$"
        }
      ],
      "import/order": [
        "warn",
        {
          "groups": [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "pathGroups": [
            {
              "pattern": "~/**",
              "group": "external",
              "position": "after"
            }
          ],
          "newlines-between": "always"
        },
      ],
    },
  },
  { plugins: { onlyWarn }, },
  {
    ignores: ["dist/**"],
  },
]
