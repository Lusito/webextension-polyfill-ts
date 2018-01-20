/**
 * Namespace: browser.find
 * Generated from Mozilla sources
 *
 * Use the <code>browser.find</code> API to interact with the browser's <code>Find</code> interface.
 * Permissions: "find"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
export namespace Find {

    /**
     * Search parameters.
     */
    export interface FindParamsType {

        /**
         * Tab to query. Defaults to the active tab.
         * Optional.
         */
        tabId?: number;

        /**
         * Find only ranges with case sensitive match.
         * Optional.
         */
        caseSensitive?: boolean;

        /**
         * Find only ranges that match entire word.
         * Optional.
         */
        entireWord?: boolean;

        /**
         * Return rectangle data which describes visual position of search results.
         * Optional.
         */
        includeRectData?: boolean;

        /**
         * Return range data which provides range data in a serializable form.
         * Optional.
         */
        includeRangeData?: boolean;
    }

    /**
     * highlightResults parameters
     */
    export interface HighlightResultsParamsType {

        /**
         * Found range to be highlighted. Default highlights all ranges.
         * Optional.
         */
        rangeIndex?: number;

        /**
         * Tab to highlight. Defaults to the active tab.
         * Optional.
         */
        tabId?: number;

        /**
         * Don't scroll to highlighted item.
         * Optional.
         */
        noScroll?: boolean;
    }

    export interface Static {

        /**
         * Search for text in document and store found ranges in array, in document order.
         *
         * @param queryphrase The string to search for.
         * @param params Optional. Search parameters.
         */
        find(queryphrase: string, params?: FindParamsType): void;

        /**
         * Highlight a range
         *
         * @param params Optional. highlightResults parameters
         */
        highlightResults(params?: HighlightResultsParamsType): void;

        /**
         * Remove all highlighting from previous searches.
         *
         * @param tabId Optional. Tab to highlight. Defaults to the active tab.
         */
        removeHighlighting(tabId?: number): void;
    }
}
