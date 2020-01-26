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
import { Types } from "./types";

export namespace Urlbar {

    /**
     * The state of an engagement made with the urlbar by the user. <code>start</code>: The user has started an engagement. <code>engagement</code>: The user has completed an engagement by picking a result. <code>abandonment</code>: The user has abandoned their engagement, for example by blurring the urlbar. <code>discard</code>: The engagement ended in a way that should be ignored by listeners.
     */
    export type EngagementState = "start" | "engagement" | "abandonment" | "discard";

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
        sources: SourceType[];
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

        /**
         * Suggest a preferred position for this result within the result set.
         * Optional.
         */
        suggestedIndex?: number;
    }

    /**
     * Possible types of results. <code>remote_tab</code>: A synced tab from another device. <code>search</code>: A search suggestion from a search engine. <code>tab</code>: An open tab in the browser. <code>tip</code>: An actionable message to help the user with their query. <code>url</code>: A URL that's not one of the other types.
     */
    export type ResultType = "remote_tab" | "search" | "tab" | "tip" | "url";

    /**
     * Options to the <code>search</code> function.
     */
    export interface SearchOptions {

        /**
         * Whether to focus the input field and select its contents.
         * Optional.
         */
        focus?: boolean;
    }

    /**
     * Possible sources of results. <code>bookmarks</code>: The result comes from the user's bookmarks. <code>history</code>: The result comes from the user's history. <code>local</code>: The result comes from some local source not covered by another source type. <code>network</code>: The result comes from some network source not covered by another source type. <code>search</code>: The result comes from a search engine. <code>tabs</code>: The result is an open tab in the browser or a synced tab from another device.
     */
    export type SourceType = "bookmarks" | "history" | "local" | "network" | "search" | "tabs";

    /**
     * The behavior of the provider for the query.
     */
    export type OnBehaviorRequestedReturnEnum = "active" | "inactive" | "restricting";

    /**
     * The payload of the result that was picked.
     */
    export interface OnResultPickedPayloadType {
    }

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
     * This event is fired when the user starts and ends an engagement with the urlbar.
     */
    export interface onEngagementEvent extends Events.Event<(state: EngagementState) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param providerName The name of the provider that will listen for engagement events.
         */
        addListener(callback: (state: EngagementState) => void, providerName: string): void;
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

    /**
     * Typically, a provider includes a <code>url</code> property in its results' payloads. When the user picks a result with a URL, Firefox automatically loads the URL. URLs don't make sense for every result type, however. When the user picks a result without a URL, this event is fired. The provider should take an appropriate action in response. Currently the only applicable <code>ResultType</code> is <code>tip</code>.
     */
    export interface onResultPickedEvent extends Events.Event<(payload: OnResultPickedPayloadType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param providerName The listener will be called for the results of the provider with this name.
         */
        addListener(callback: (payload: OnResultPickedPayloadType) => void, providerName: string): void;
    }

    export interface Static {

        /**
         * Closes the urlbar view in the current window.
         */
        closeView(): void;

        /**
         * Focuses the urlbar in the current window.
         *
         * @param select Optional. If true, the text in the urlbar will also be selected.
         */
        focus(select?: boolean): void;

        /**
         * Starts a search in the urlbar in the current window.
         *
         * @param searchString The search string.
         * @param options Optional. Options for the search.
         */
        search(searchString: string, options?: SearchOptions): void;

        /**
         * Before a query starts, this event is fired for the given provider. Its purpose is to request the provider's behavior for the query. The listener should return a behavior in response. By default, providers are inactive, so if your provider should always be inactive, you don't need to listen for this event.
         */
        onBehaviorRequested: onBehaviorRequestedEvent;

        /**
         * This event is fired when the user starts and ends an engagement with the urlbar.
         */
        onEngagement: onEngagementEvent;

        /**
         * This event is fired for the given provider when a query is canceled. The listener should stop any ongoing fetch or creation of results and clean up its resources.
         */
        onQueryCanceled: onQueryCanceledEvent;

        /**
         * When a query starts, this event is fired for the given provider if the provider is active for the query and there are no other providers that are restricting. Its purpose is to request the provider's results for the query. The listener should return a list of results in response.
         */
        onResultsRequested: onResultsRequestedEvent;

        /**
         * Typically, a provider includes a <code>url</code> property in its results' payloads. When the user picks a result with a URL, Firefox automatically loads the URL. URLs don't make sense for every result type, however. When the user picks a result without a URL, this event is fired. The provider should take an appropriate action in response. Currently the only applicable <code>ResultType</code> is <code>tip</code>.
         */
        onResultPicked: onResultPickedEvent;

        /**
         * Enables or disables the engagement telemetry.
         */
        engagementTelemetry: Types.Setting;
    }
}
