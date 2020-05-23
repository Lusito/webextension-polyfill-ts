# Web-Extension Polyfill for TypeScript

This is a TypeScript ready "wrapper" for the [WebExtension browser API Polyfill](https://github.com/mozilla/webextension-polyfill) by Mozilla.
* It does include webextension-polyfill, so no need to manually add it.
* It is generated from these mozilla schema (.json) files:
  * [toolkit](https://hg.mozilla.org/integration/autoland/raw-file/tip/toolkit/components/extensions/schemas/)
  * [browser](https://hg.mozilla.org/integration/autoland/raw-file/tip/browser/components/extensions/schemas/)

## How to use:
This guide assumes you are building a web-extension using npm and webpack, parcel or similar.
If you are looking for an example use-case, check out the development branch of my web-extension [Forget Me Not](https://github.com/lusito/forget-me-not/tree/develop).

* `npm install --save-dev webextension-polyfill-ts`
* `import { browser } from "webextension-polyfill-ts";`
  * Use this to access the browser API.
  * If the current environment does not supply a global window object, the exported browser object will be a dummy object, which you can use for unit tests.

If you want to use the exported types in your code, simply import them like this:
```typescript
import { Cookies } from "webextension-polyfill-ts";

function inspectCookie(cookie: Cookies.Cookie) {
    //...
}
```

All types are inside their respective namespace:
* Namespaces are named like their API, but with the first character as upper-case.
  * For example `browser.cookies` types are in the `Cookies` namespace
* Nested namespaces will remove the dot and have the first character after the dot as upper-case.
  * For example `browser.devtools.inspectedWindow` types are in the `DevtoolsInspectedWindow` namespace.

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
If you have problems, questions or other feedback, please [create an issue](https://github.com/Lusito/webextension-polyfill-ts/issues) here on Github.

## License
My generator code of this project has been released under the [zlib/libpng License](https://github.com/Lusito/webextension-polyfill-ts/blob/master/LICENSE)

The schema files from mozilla however have defined their own licences, which will be exported to the generated .ts files as well.
For example, there are files under the Mozilla Public License and some under a BSD style license.
