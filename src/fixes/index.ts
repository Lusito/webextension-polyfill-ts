import { SchemaVisitorFactory } from "../helpers/visitor";
import { removeUnsupported } from "./removeUnsupported";
import { cleanupRefs } from "./cleanupRefs";
import { flattenChoiceEnum } from "./flattenChoiceEnum";
import { guessPropertyType } from "./guessPropertyType";
import { applyExtensionNamespace } from "./applyExtensionNamespace";
import { removeUnusedNamespaces } from "./removeUnusedNamespaces";
import { applyEarlyJsonFixes, applyJsonFixes } from "./applyJsonFixes";
import { extractInlineContent } from "./extractInlineContent";
import { extendEvents } from "./extendEvents";
import { convertBinaryToObject } from "./convertBinaryToObject";
import { removeInstanceTypes } from "./removeInstanceTypes";
import { detectSkipableParameters } from "./detectSkipableParameter";

export const fixes: SchemaVisitorFactory[] = [
    removeUnusedNamespaces,
    convertBinaryToObject,
    removeInstanceTypes,
    detectSkipableParameters,
    guessPropertyType(false),
    applyExtensionNamespace,
    applyEarlyJsonFixes,
    guessPropertyType(true),

    // First pass of removeUnsupported is to remove the officially-unsupported
    // types and the ones from early-fixes/*.json.
    removeUnsupported,

    cleanupRefs,
    applyJsonFixes,
    extractInlineContent,
    flattenChoiceEnum,

    // flattenChoiceEnum above inlines certain union types for better
    // readability, and then marks those types as deprecated with the
    // expectation that removeUnsupported will remove them. This second pass of
    // removeUnsupported is to remove those types.
    removeUnsupported,

    extendEvents,
];

// Fixme: copy permissions from ns to subns
