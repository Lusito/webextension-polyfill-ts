# TypeScript Types for the Web-Extension Polyfill

## News: This Has Changed to Be a Pure Generator Project

This project supplies the TypeScript types for the [WebExtension browser API Polyfill](https://github.com/mozilla/webextension-polyfill) by Mozilla.
[@types/webextension-polyfill](https://www.npmjs.com/package/@types/webextension-polyfill) is not manually written, it is generated from these mozilla schema (.json) files:
  * toolkit: [GitHub mirror](https://github.com/mozilla/gecko-dev/tree/master/browser/components/extensions/schemas) / [Mozilla source](https://hg.mozilla.org/integration/autoland/raw-file/tip/toolkit/components/extensions/schemas/)
  * browser: [Github mirror](https://github.com/mozilla/gecko-dev/tree/master/browser/components/extensions/schemas) / [Mozilla source](https://hg.mozilla.org/integration/autoland/raw-file/tip/browser/components/extensions/schemas/)


## Migration Guide From webextension-polyfill-ts

This used to be a wrapper library, which included webextension-polyfill. If you have been using `webextension-polyfill-ts` before, then you can easily move to `@types/webextension-polyfill` with these steps:

- Replace all imports of "webextension-polyfill-ts" with "webextension-polyfill".
- In all places, where you would import `{ browser }`, you'll now need to import `browser`.

Examples:

```TypeScript
// Before:
import { browser } from "webextension-polyfill-ts";
// After
import browser from "webextension-polyfill";

// Before:
import { browser, Cookies } from "webextension-polyfill-ts";
// After
import browser, { Cookies } from "webextension-polyfill";
```

## How to Use:
This guide assumes you are already using [webextension-polyfill](https://github.com/mozilla/webextension-polyfill).
If you are looking for an example use-case, check out the development branch of my web-extension [Forget Me Not](https://github.com/lusito/forget-me-not/tree/develop).

* `npm install webextension-polyfill` (if you haven't done this already)
* `npm install --save-dev @types/webextension-polyfill`
* `import browser from "webextension-polyfill";`

If you want to use the generated types in your code, simply import them like this:
```typescript
import { Cookies } from "webextension-polyfill";

function inspectCookie(cookie: Cookies.Cookie) {
    //...
}
```

All types are inside their respective namespace:
* Namespaces are named like their API, but with the first character as upper-case.
  * For example `browser.cookies` types are in the `Cookies` namespace
* Nested namespaces will remove the dot and have the first character after the dot as upper-case.
  * For example `browser.devtools.inspectedWindow` types are in the `DevtoolsInspectedWindow` namespace.

### ES6 Module Loader

If you are loading the polyfill using native ES6 module loader, it will export a global object.
I don't recommend that use-case, but if you are looking for types in this scenario, you can make the types work by creating a file `global.d.ts` with this content:

```typescript
import type Browser from "webextension-polyfill";

declare global {
    const browser: Browser.Browser;
}
```

**Note:** I haven't tried the ES6 module loader approach, and the above will only get you the types. Check out [Basic Setup with module bundlers](https://github.com/mozilla/webextension-polyfill#basic-setup-with-module-bundlers) for more information and don't ask me about it, as I have no clue whatsoever (aside from the types).

## Unit Testing
Consider [mockzilla-webextension](https://lusito.github.io/mockzilla-webextension/) for unit-testing. It combines all the types this package provides with some nifty mocking functionality.

## Issues
There are still some issues left:
* Since the schema .json files have a lot of anonymous nested types, some of the types will have generated names.
  * These might change in the future, since the generated names are far from perfect.
* Some of the schema files are incomplete.. for example in some places, a null value is allowed, yet the schema file doesn't say anything about it. I have fixed some of these, but there are probably more.
* Not every API has been tested.

## Contributing Guidelines:

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Help
All runtime issues you have should be reported at the [webextension-polyfill](https://github.com/mozilla/webextension-polyfill).
If you have problems, questions or other feedback about the generated types, please [create an issue](https://github.com/Lusito/webextension-polyfill-ts/issues) here on Github.

## License
My generator code of this project has been released under the [zlib/libpng License](https://github.com/Lusito/webextension-polyfill-ts/blob/master/LICENSE)

The schema files from mozilla however have defined their own licences, which will be exported to the generated `@types` project as well.
For example, there are files under the Mozilla Public License and some under a BSD style license.
