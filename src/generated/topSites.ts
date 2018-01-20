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
    }

    export interface GetOptionsType {

        /**
         * Which providers to get top sites from. Possible values are "places" and "activityStream".
         * Optional.
         */
        providers?: string[];
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
