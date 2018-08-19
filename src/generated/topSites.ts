/**
 * Namespace: browser.topSites
 * Generated from Mozilla sources
 *
 * Use the chrome.topSites API to access the top sites that are displayed on the new tab page. 
 * Permissions: "topSites"
 *
 * Comments found in source JSON schema files:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export namespace TopSites {

    /**
     * An object encapsulating a most visited URL, such as the URLs on the new tab page.
     */
    export interface MostVisitedURL {

        /**
         * The most visited URL.
         */
        url: string;

        /**
         * The title of the page.
         * Optional.
         */
        title?: string;

        /**
         * Data URL for the favicon, if available.
         * Optional.
         */
        favicon?: string;
    }

    export interface GetOptionsType {

        /**
         * The number of top sites to return, defaults to the value used by Firefox
         * Optional.
         */
        limit?: number;

        /**
         * Limit the result to a single top site link per domain
         * Optional.
         */
        onePerDomain?: boolean;

        /**
         * Include sites that the user has blocked from appearing on the Firefox new tab.
         * Optional.
         */
        includeBlocked?: boolean;

        /**
         * Include sites favicon if available.
         * Optional.
         */
        includeFavicon?: boolean;
    }

    export interface Static {

        /**
         * Gets a list of top sites.
         *
         * @param options Optional.
         * @returns Promise<MostVisitedURL[]>
         */
        get(options?: GetOptionsType): Promise<MostVisitedURL[]>;
    }
}
