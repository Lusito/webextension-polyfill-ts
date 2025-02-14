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
import { removeUnusedAdditionalProperties } from "./removeUnusedAdditionalProperties";
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
    removeUnusedAdditionalProperties,
    cleanupRefs,
    applyJsonFixes,
    extractInlineContent,
    flattenChoiceEnum,
    removeUnsupported,
    extendEvents,
];

// Fixme: copy permissions from ns to subns
