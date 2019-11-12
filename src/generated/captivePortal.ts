/**
 * Namespace: browser.captivePortal
 * Generated from Mozilla sources
 *
 * This API provides the ability detect the captive portal state of the users connection.
 * Permissions: "captivePortal"
 */
import { Events } from "./events";
import { Types } from "./types";

export namespace CaptivePortal {
    export interface OnStateChangedDetailsType {

        /**
         * The current captive portal state.
         */
        state: OnStateChangedDetailsTypeStateEnum;
    }

    export type OnConnectivityAvailableStatusEnum = "captive" | "clear";

    /**
     * The current captive portal state.
     */
    export type OnStateChangedDetailsTypeStateEnum = "unknown" | "not_captive" | "unlocked_portal" | "locked_portal";

    export interface Static {

        /**
         * Returns the current portal state, one of `unknown`, `not_captive`, `unlocked_portal`, `locked_portal`.
         */
        getState(): void;

        /**
         * Returns the time difference between NOW and the last time a request was completed in milliseconds.
         */
        getLastChecked(): void;

        /**
         * Fired when the captive portal state changes.
         *
         * @param details
         */
        onStateChanged: Events.Event<(details: OnStateChangedDetailsType) => void>;

        /**
         * This notification will be emitted when the captive portal service has determined that we can connect to the internet. The service will pass either `captive` if there is an unlocked captive portal present, or `clear` if no captive portal was detected.
         *
         * @param status
         */
        onConnectivityAvailable: Events.Event<(status: OnConnectivityAvailableStatusEnum) => void>;

        /**
         * Return the canonical captive-portal detection URL. Read-only.
         */
        canonicalURL: Types.Setting;
    }
}
