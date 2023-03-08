module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    }
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    quotes: ['error', 'single', { 'allowTemplateLiterals': true }],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd'],
      },
    ],
    'import/extensions': 0,
    'max-len': [
      'warn',
      {
        code: 115,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
