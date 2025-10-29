import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: [
                '../../features/*',
                '../features/*',
                'features/*'
              ],
              message: 'Use o alias @features para importar módulos de features.'
            },
            {
              group: [
                '../../shared/*',
                '../shared/*',
                'shared/*'
              ],
              message: 'Use o alias @shared para importar módulos compartilhados.'
            },
            {
              group: [
                '@/features/*'
              ],
              message: 'Use @features em vez de @/features.'
            },
            {
              group: [
                '@/shared/*'
              ],
              message: 'Use @shared em vez de @/shared.'
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
