/**
 * Namespace: browser.urlbar
 * Generated from Mozilla sources
 *
 * Use the <code>browser.urlbar</code> API to experiment with new features in the URLBar. Restricted to Mozilla privileged WebExtensions.
 * Permissions: "urlbar"
 *
 * Comments found in source JSON schema files:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Events } from "./events";

export namespace Urlbar {

    /**
     * The source of a result.
     */
    export type SourceType = "bookmarks" | "history" | "search" | "tabs" | "local" | "network";

    /**
     * Context of the current query request.
     */
    export interface QueryContext {

        /**
         * Whether the browser context is private.
         */
        isPrivate: boolean;

        /**
         * The maximum number of results shown to the user.
         */
        maxResults: number;

        /**
         * The current search string.
         */
        searchString: string;

        /**
         * List of acceptable SourceType to return.
         */
        acceptableSources: SourceType[];
    }

    /**
     * Whether this provider should be queried, and if it wants to restrict results
     */
    export type OnQueryReadyReturnEnum = "active" | "inactive" | "restricting";

    /**
     * Fired before starting a search to get the provider's behavior.
     */
    export interface onQueryReadyEvent extends Events.Event<(context: QueryContext) => OnQueryReadyReturnEnum> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param name Name of the provider.
         */
        addListener(callback: (context: QueryContext) => OnQueryReadyReturnEnum, name: string): void;
    }

    export interface Static {

        /**
         * Fired before starting a search to get the provider's behavior.
         */
        onQueryReady: onQueryReadyEvent;
    }
}
