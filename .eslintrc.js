module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // TypeScript
    quotes: ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-tabs': 'off',
    'no-trailing-spaces': 'off',
    'vue/html-indent': 'off',
    semi: 'off',
    indent: 'off',
    quotes: 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-empty-function': 0,
    'object-curly-spacing': 'off',
    curly: 'off',
    'arrow-parens': 'warn',
    'lines-between-class-members': 'warn',
    'padded-blocks': 'warn',
    'import/order': 'off',
    'no-multiple-empty-lines': 'warn',
    'keyword-spacing': 'off',
    'prefer-const': 'warn',
    'eol-last': 'warn',
    'brace-style': 0,
    'no-empty': 0,
    'space-infix-ops': 0,
    'camelcase': 0,
    'space-in-parens': 1,
    'quote-props': 'off',
    'no-useless-catch': 1,
    'arrow-spacing': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-unsafe-member-access': 1,
    '@typescript-eslint/no-extra-semi': 0,
  }
}
