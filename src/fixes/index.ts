import { SchemaVisitorFactory } from "../helpers/visitor";
import { removeUnsupported } from "./removeUnsupported";
import { cleanupRefs } from "./cleanupRefs";
import { flattenChoiceEnum } from "./flattenChoiceEnum";
import { guessPropertyType } from "./guessPropertyType";
import { applyExtensionNamespace } from "./applyExtensionNamespace";
import { removeUnusedNamespaces } from "./removeUnusedNamespaces";
import { applyJsonFixes } from "./applyJsonFixes";
import { extractInlineContent } from "./extractInlineContent";
import { extendEvents } from "./extendEvents";
import { removeUnusedAdditionalProperties } from "./removeUnusedAdditionalProperties";

export const fixes: SchemaVisitorFactory[] = [
    removeUnusedNamespaces,
    guessPropertyType,
    removeUnusedAdditionalProperties,
    removeUnsupported,
    cleanupRefs,
    applyExtensionNamespace,
    applyJsonFixes,
    extractInlineContent,
    flattenChoiceEnum,
    removeUnsupported,
    extendEvents,
];

//Fixme: copy permissions from ns to subns
