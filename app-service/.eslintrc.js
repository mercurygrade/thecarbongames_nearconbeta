module.exports = {
  extends: 'airbnb-base',
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  env: {
    browser: true,
    mocha: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'never',
    ],
    semi: ['error', 'never'],
    'max-len': 'off',
    'import/no-cycle': 'off',
    'arrow-parens': ['error', 'always'],
    'object-curly-newline': ['error', { consistent: true }],
    'space-before-function-paren': ['error', 'always'],
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 10 }],
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-console': process.env.NODE_ENV !== 'development' ? 'error' : 'warn',
  },
  globals: {
    JSX: true,
    NodeJS: true,
  },
}
