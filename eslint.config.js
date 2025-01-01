import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  { languageOptions: { globals: globals.browser } },
  stylistic.configs['recommended-flat'],
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]
