/**
 * Namespace: browser.experiments
 * Generated from Mozilla sources
 */
export namespace Experiments {
    export interface ExperimentAPI {
        schema: ExperimentURL;

        /**
         * Optional.
         */
        parent?: ExperimentAPIParentType;

        /**
         * Optional.
         */
        child?: ExperimentAPIChildType;
    }

    export type ExperimentURL = string;

    export type APIPaths = APIPath[];

    export type APIPath = string[];

    export type APIEvents = APIEvent[];

    export type APIEvent = "startup";

    export type APIParentScope = "addon_parent" | "content_parent" | "devtools_parent";

    export type APIChildScope = "addon_child" | "content_child" | "devtools_child";

    export interface ExperimentAPIParentType {

        /**
         * Optional.
         */
        events?: APIEvents;

        /**
         * Optional.
         */
        paths?: APIPaths;

        script: ExperimentURL;

        /**
         * Optional.
         */
        scopes?: APIParentScope[];
    }

    export interface ExperimentAPIChildType {
        paths: APIPaths;

        script: ExperimentURL;

        scopes: APIChildScope[];
    }

    export interface Static {
    }
}
