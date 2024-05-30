module.exports = {
    extends: ["@lusito/eslint-config"],
    rules: {
        "@typescript-eslint/parameter-properties": ["error", { allow: ["private readonly", "public readonly"] }],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "react/static-property-placement": "off",
    },
};
