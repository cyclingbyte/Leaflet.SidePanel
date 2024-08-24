export default {
  files: ['**/*.js'],
  ignores: ['dist/*'],
  rules: {
    // ignore unused variables starting with _
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
