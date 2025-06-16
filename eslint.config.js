import { config as baseConfig } from "@workspace/eslint-config/base";
import { config as nextConfig } from "@workspace/eslint-config/next-js";
import { config as reactConfig } from "@workspace/eslint-config/react-internal";

export default [
  {
    ignores: ["apps/**", "packages/**"],
  },
  // Объединяем все конфигурации
  ...baseConfig,
  ...nextConfig,
  ...reactConfig,
  // Добавляем настройки парсера для TypeScript
  {
    languageOptions: {
      parser: await import("@typescript-eslint/parser").then((m) => m.default),
      parserOptions: {
        project: true,
      },
    },
  },
];
