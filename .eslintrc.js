module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2020: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 11,
    },
    plugins: ['@typescript-eslint'],
    rules: {},
    overrides: [
        {
            files: ['*.js', '*.ts'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/ban-ts-comment': 'off',
            },
        },
    ],
};
