# Contributors Guide

This is the contributing documentation. It is only for those who want to help work on the project by improving the generator or by updating the project with the latest schema files.

You might have noticed that some generated code is wrong.. Since I don't use the whole API, I sometimes don't notice these issues. You can either open an issue on github or better yet, fix it yourself and open a pull request.

This file should give you a quick introduction. It won't cover everything.

Sadly, there is no official documentation for the schema .json files that I know of. I suggest having a look at `src/helpers/types.ts`, which documents structure of the schema.json files as I deducted them from reading them.

## Build commands:

You will need npm installed.

Run these commands:
* `npm install` -> only needs to happen once to get all dependencies and whenever you merge back changes from this repository.
* `npm run fetch` -> grabs the latest schema files from mozilla
* `npm run validate:schemas` -> validates that all the assumptions I made about the .json files are still true
* `npm run build` -> generates one .d.ts per namespace and one index.d.ts file in the out folder.
* `npm run validate:out` -> to test if the generated files are valid TypeScript.
* `npm run all` -> execute all of the above (except npm install) in order.
* `npm run copy` -> copies out files into ../DefinitelyTyped/types/webextension-polyfill in order to prepare a PR.

## Linting commands:

When you changed code, ensure you uphold linting and formatting rules.
Use `npm run lint` to check them or `npm run lint:fix` to try to autofix them.

## Overview

As you might have read, this project grabs schema files from mozilla, parses them and then spits out typescript files.
Here is a list of all folders and files in this project:
- schemas: schema .json files downloaded from various sources.
- out: generated typescript definition files.
- src: source for commandline commands to fetch and validate schemas, and to generate typescript files.
- `fixes/<namespace>.json`: fixes for schema files.. see below.

## fixes/\<namespace\>.json

Since the schema .json files are flawed, some fixes have to be applied to generate good typescript files. Sometimes types are wrong or missing in the schema files.

The fixes json files are a map key => replacement, where key expresses what part of the compiled schema structure you want to modify.

To illustrate how this works, let's examine this line:  
```"manifest.types.$ImageData.unsupported": true,```

This key will be split by the dots to find the correct place to insert the replacement:
- manifest
- types
- $ImageData
- unsupported

The tree might look something like this:
```json
{
    "manifest": {
        "types": [
            { "id": "IconPath", ... },
            { "id": "IconImageData", ... },
            { "id": "ImageData", ... }
        ]
    }
}
```

Each of these parts are instructions to navigate the schema tree:
- manifest => `node = schemaTree.manifest`
- types => `node = node.types` (types is an array, as seen above)
- $ImageData => `node = <the item in node[] where id = "ImageData">`
- unsupported is the last part, so `node.unsupported = true`

So in the end, we're doing:  
`schemaTree.manifest.types[2].unsupported = true;`  
But since the array of types might change, we need to access the item by id rather than by index.

This is where special instructions come in. These instructions can be used to navigate arrays:
- `$<id>` => look for an item, where item.id = `<id>`
- `%<name>` => look for an item, where item.name `<name>`
- `#<index>` => use the item at the specified index. This should be used with care.. for example to change a parameter list, where you know the item at position `<index>` is always the one you want to modify.

If you use any of the above, it is assumed that the current node is an array.

Usually the last part of a key is not a special instruction, but a normal key. These are exceptions:
- If the last part is exactly `+[]`, values are appended to an array.
- If the last part is exactly `-[]`, the values are selectors to remove elements from an array. See the instructions to navigate an array above.
- If the last part is exactly `!fixAsync`, async functions can be easily fixed.

### Appending to an array instead of setting an attribute.
if you want to add items to an array rather than setting an attribute of an object, you can use the `+[]` instruction:  
`"manifest.types.+[]": [{...}, {...}]`  
Which is like saying:  
`schemaTree.manifest.types.push({...}, {...});`

### Fixing async functions
A lot of times, an async function is defined insufficiently in the schema files, so I've created the `!fixAsync` instruction, which helps solve this.

Take this ill-formed async schema definition:
```json
{
    "name": "reset",
    "type": "function",
    "async": true,
    "description": "...",
    "parameters": [
        {
        "type": "string",
        "name": "name",
        "description": "The name of the command."
        }
    ]
}
```

The async attribute needs to be either "callback" or "responseCallback" and the last parameter must be of type function and the name should be "callback" or "responseCallback" (the one which async is set to).

So to fix this, you'd normally have to set both async to true as well as add another parameter. Since this is a common use-case, this can be simplified:  
```"commands.functions.%reset.!fixAsync": null,```  

This will automagically do all the work for you. Possible "replacement" values for this can be:
- `null`: creates a void callback, i.e. `(void) => void`.
- `"<name>:<type>"` creates a callback with one named parameter, i.e.: `(<name>: <type>) => void`


## The commands code

### src/fetch.ts
This is a simple node command to remove the schemas directory, and then redownload them from the mozilla sources.
Everything should be self explanatory.

### src/validate.ts
This is a simple node command to read each schema/*.json file and validate it against my assumptions. So if -at some point- the schema files change beyond what I expect, this should hopefully spit out a warning. It uses helper functions in `src/helpers/types.ts`

### src/build.ts
This file is a lot more complex and at this time I don't have the time to go into every detail of it. It sure could use some refactoring, as it has grown quite a bit.

What it essentially does is:
- Import all .json files into one big schema tree
- Apply a lot of fixes on the schema tree, for example:
  - removing unused and deprecated object to lighten the tree
  - applying some autocorrection
  - applying manual json fixes (see `fixes/<namespace>.json`)
  - flatten the schema tree and create names/ids where none where given.
  - see `src/fixes/*.ts` for more details
- Write each namespace to its corresponding .d.ts file
- Write an index.d.ts file that imports everything.

That's it for now. You'll need to figure the rest out on your own or open an issue with questions you have.
