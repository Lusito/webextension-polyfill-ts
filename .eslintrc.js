module.exports = {
    extends: ["@lusito/eslint-config"],
    rules: {
        "@typescript-eslint/parameter-properties": ["error", { allow: ["private readonly", "public readonly"] }],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "react/static-property-placement": "off",
    },
    overrides: [
        {
            extends: ["plugin:@definitelytyped/all"],
            files: ["out/**/*.ts"],
            rules: {
                "@typescript-eslint/no-explicit-any": "error",
                "spaced-comment": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@definitelytyped/no-single-element-tuple-type": "off",
            },
            parserOptions: {
                project: "./tsconfig-out.json",
            },
        },
    ],
};
