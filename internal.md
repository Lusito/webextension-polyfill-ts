## Goals

The goal of webextension-polyfill-ts is to have TypeScript types and JS-Doc documentation, so that writing webextensions gets easier and safer for TypeScript developers. These types and comments should be automatically generated from existing schema files in order to keep this library maintainable.

## Schema Files

Mozilla provides schema (json) files, which describe the webextension API. We parse these schemas in order to gain information to generate the types.

We are currently using these files:
* [toolkit](https://hg.mozilla.org/integration/autoland/raw-file/tip/toolkit/components/extensions/schemas/)
* [browser](https://hg.mozilla.org/integration/autoland/raw-file/tip/browser/components/extensions/schemas/)

**Warning:** I don't know any official documentation for these files. I gathered all of the information by looking at the schema files, so this might not be a complete or correct documentation.

### Schema File

A schema file is an array of json objects with some attributes, which define part of the webextension API. 

### Namespaces

Each of these objects declare a namespace. In most cases, namespace is esssentially what comes after `browser.`. For example a namespace `devtools.network` defines what's behind the `browser.devtools.network` api.

Exception: The `manifest` namespace is used for the definition of the [manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)

Namespaces can be scattered accross multiple files. This is the case for the `manifest` namespace. Other namespaces are usually only in one file though.

### Types

Take a look at `src/helpers/types.ts` to check out the various types (which I've gathered by looking at existing schema files). This file also contains some static functions in order to validate a schema file against my assumptions.

For example, `SchemaEntry.validate(json)` verifies, that json is of type `object`, has a `namespace` property of type `string`, etc..

You might have noticed, that the data is partially being manipulated in these validation functions. Do not worry about this. Since the validation functions are called in a separate NPM script, they do not affect the build script at all.

## Current solution

The current solution is to parse these mozilla schema files and generate `.d.ts` files with the information gathered.

In order to create types, these steps are followed:
* `npm run fetch`:
  * Fetch the schema files from the mozilla sources and store them in `/schemas`.
* `npm run validate:schemas`:
  * Perform a couple of verification steps about the json contained in these schema files, since I am not certain I get the data format 100% correctly.
* `npm run build`:
  * import namespaces from schema files
    * Also reads all comments from the json file, so we can later re-insert them in the `d.ts` file (they contain license information).
  * remove old `d.ts` files
  * Apply a couple of fixes, so it's easier to work with the data (see `src/helpers/fixes.ts`). For example:
    * remove content that has been marked `deprecated` or `unsupported`
    * Some of the json objects are missing a `type` property and we need to guess based on the existence of other properties.
    * Merging namespaces, which have been declared accross multiple files
    * Some properties have their types defined inline, rather than naming a type. Replacing them with references to extracted types helps to keep the generated code tidy and well-documented. This requires some auto-generated type names.
  * Apply a couple of fixes from `fixes/<namespace>.json` to the gathered information, since the schema files are partially incorrect or incomplete.
  * Generate a `d.ts` file for each namespace in the `/lib` folder
  * Generate an `index.d.ts` file to combine all other `.d.ts` files in the `/lib` folder
* `npm run validate:lib`:
  * Test if the generated files are valid TypeScript

### Visitor pattern for src/fixes/*.ts

To be able to easily apply fixes on the various data types, a visitor pattern similar to what can be seen in babel has been introduced:

```typescript
export const fix: SchemaVisitorFactory = (namespace, namespaces) => {
    return {
        name: "some description of what the fix does in order to print a good error message",
        visitors: {
            Namespace(original) {
                return shouldRemove(original) ? VisitorAction.REMOVE : original;
            },
        },
    };
};
```` 

The factory method will be called freshly before processing a new namespace.

The visitor methods will be called for each instance of the specified type (`Namespace`, `Type`, `Event`, `Function`, `Parameter`, `Returns` or `Property`).
Either return a replacement, the original or VisitorAction.REMOVE if you want it to be removed.

## Improved Solution

The build process described above is a very ugly one, which is not easy to follow. Coming back after months of not using it, I too forgot some of the quirks. This is due to the fact, that I hacked this together in a short timeframe without creating a proper cleanup. Since the produced code was good, it never mattered to the user.

Some of the bad things I've noticed while revisiting the code:

* Some of the steps in `fixes.ts` apply multiple different fixes rather than just one.
* Some fixes are applied outside of the `fixes.ts` or `fixes/<namespace>.json`
* The format of the `fixes/<namespace>.json` is not very intuitive. I keep mixing up the operator types.
* The validation logic should be moved outside of the `src/helpers/types.ts` file.
* Each fix needs to handle walking the children manually by itself.
* If an assertion fails, the error message doesn't give you information about what element is currently being looked at.

This can obviously be done better. Some ideas:
* Using a pipeline approach, where each fix creates a new file-dump, so that it's possible to inspect the changes that each fix does.
* Extracting the logic that handles the `fixes/<namespace>.json` into a separate, well documented library, refactoring it in the process to make it more flexible and intuitive to use.
* Actually get these patches applied in the mozilla schema files, i.e. submit patches to mozilla.
  * This will not make the `fixes/<namespace>.json` obsolete, since wrong schema definitions pop up regularly.

That way, it would be easier to see, what happened in between steps and where something wrong was done. However, this is not an easy task due to references between namespaces.
