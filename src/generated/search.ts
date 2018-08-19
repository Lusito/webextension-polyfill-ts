/**
 * Namespace: browser.search
 * Generated from Mozilla sources
 *
 * Use browser.search to interact with search engines.
 * Permissions: "search"
 *
 * Comments found in source JSON schema files:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export namespace Search {

    /**
     * An object encapsulating a search engine
     */
    export interface SearchEngine {
        name: string;

        isDefault: boolean;

        /**
         * Optional.
         */
        alias?: string;

        /**
         * Optional.
         */
        favIconUrl?: string;
    }

    export interface Static {

        /**
         * Gets a list of search engines.
         */
        get(): void;

        /**
         * Perform a search.
         *
         * @param engineName
         * @param searchTerms
         * @param tabId Optional.
         */
        search(engineName: string, searchTerms: string, tabId?: number): void;
    }
}
