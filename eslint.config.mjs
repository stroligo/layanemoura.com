import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier';

export default withNuxt(
  {
    ignores: ['.nuxt/**', '.output/**', 'build/**', 'dist/**', 'node_modules/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
    },
  },
  prettier,
);
