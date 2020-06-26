const utils = require("@lusito/eslint-config/utils");

module.exports = {
    extends: ["@lusito/eslint-config"],
    rules: {
        "@typescript-eslint/no-parameter-properties": ["error", { allows: ["private readonly", "public readonly"] }],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "react/static-property-placement": "off",
    },
};
