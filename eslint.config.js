// eslint.config.cjs (ou eslint.config.js, se preferir)
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const { configs: prettierConfigs } = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Regras recomendadas do TypeScript
      ...tsPlugin.configs.recommended.rules,
      // Regras recomendadas do Prettier
      ...prettierConfigs.recommended.rules,
      // Se quiser "forçar" o Prettier como erro:
      'prettier/prettier': 'error',
    },
  },
];
