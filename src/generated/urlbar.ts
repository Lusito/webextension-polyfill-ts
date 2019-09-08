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
import { UrlbarContextualTip } from "./urlbar_contextualTip";
import { Events } from "./events";
import { Types } from "./types";

export namespace Urlbar {

    /**
     * A query performed in the urlbar.
     */
    export interface Query {

        /**
         * Whether the query's browser context is private.
         */
        isPrivate: boolean;

        /**
         * The maximum number of results shown to the user.
         */
        maxResults: number;

        /**
         * The query's search string.
         */
        searchString: string;

        /**
         * List of acceptable source types to return.
         */
        acceptableSources: SourceType[];
    }

    /**
     * A result of a query. Queries can have many results. Each result is created by a provider.
     */
    export interface Result {

        /**
         * An object with arbitrary properties depending on the result's type.
         */
        payload: ResultPayloadType;

        /**
         * The result's source.
         */
        source: SourceType;

        /**
         * The result's type.
         */
        type: ResultType;
    }

    /**
     * Possible types of results. <code>remote_tab</code>: A synced tab from another device. <code>search</code>: A search suggestion from a search engine. <code>tab</code>: An open tab in the browser. <code>url</code>: A URL that's not one of the other types.
     */
    export type ResultType = "remote_tab" | "search" | "tab" | "url";

    /**
     * Possible sources of results. <code>bookmarks</code>: The result comes from the user's bookmarks. <code>history</code>: The result comes from the user's history. <code>search</code>: The result comes from a search engine. <code>tabs</code>: The result is an open tab in the browser or a synced tab from another device. 
     */
    export type SourceType = "bookmarks" | "history" | "search" | "tabs" | "local" | "network";

    /**
     * The behavior of the provider for the query.
     */
    export type OnBehaviorRequestedReturnEnum = "active" | "inactive" | "restricting";

    /**
     * An object with arbitrary properties depending on the result's type.
     */
    export interface ResultPayloadType {
    }

    /**
     * Before a query starts, this event is fired for the given provider. Its purpose is to request the provider's behavior for the query. The listener should return a behavior in response. By default, providers are inactive, so if your provider should always be inactive, you don't need to listen for this event.
     */
    export interface onBehaviorRequestedEvent extends Events.Event<(query: Query) => OnBehaviorRequestedReturnEnum> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param providerName The name of the provider whose behavior the listener returns.
         */
        addListener(callback: (query: Query) => OnBehaviorRequestedReturnEnum, providerName: string): void;
    }

    /**
     * This event is fired for the given provider when a query is canceled. The listener should stop any ongoing fetch or creation of results and clean up its resources.
     */
    export interface onQueryCanceledEvent extends Events.Event<(query: Query) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param providerName The name of the provider that is creating results for the query.
         */
        addListener(callback: (query: Query) => void, providerName: string): void;
    }

    /**
     * When a query starts, this event is fired for the given provider if the provider is active for the query and there are no other providers that are restricting. Its purpose is to request the provider's results for the query. The listener should return a list of results in response.
     */
    export interface onResultsRequestedEvent extends Events.Event<(query: Query) => Result[]> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param providerName The name of the provider whose results the listener returns.
         */
        addListener(callback: (query: Query) => Result[], providerName: string): void;
    }

    export interface Static {

        /**
         * Before a query starts, this event is fired for the given provider. Its purpose is to request the provider's behavior for the query. The listener should return a behavior in response. By default, providers are inactive, so if your provider should always be inactive, you don't need to listen for this event.
         */
        onBehaviorRequested: onBehaviorRequestedEvent;

        /**
         * This event is fired for the given provider when a query is canceled. The listener should stop any ongoing fetch or creation of results and clean up its resources.
         */
        onQueryCanceled: onQueryCanceledEvent;

        /**
         * When a query starts, this event is fired for the given provider if the provider is active for the query and there are no other providers that are restricting. Its purpose is to request the provider's results for the query. The listener should return a list of results in response.
         */
        onResultsRequested: onResultsRequestedEvent;

        /**
         * Enables or disables the open-view-on-focus mode.
         */
        openViewOnFocus: Types.Setting;

        /**
         * Enables or disables the engagement telemetry.
         */
        engagementTelemetry: Types.Setting;

        contextualTip: UrlbarContextualTip.Static;
    }
}
