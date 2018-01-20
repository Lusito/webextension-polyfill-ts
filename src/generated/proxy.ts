/**
 * Namespace: browser.proxy
 * Generated from Mozilla sources
 *
 * Use the browser.proxy API to register proxy scripts in Firefox. Proxy scripts in Firefox are proxy auto-config files with extra contextual information and support for additional return types.
 * Permissions: "proxy"
 */
import { Events } from "./Events";

export namespace Proxy {
    export interface OnProxyErrorErrorType {
    }

    export interface Static {

        /**
         * Registers the proxy script for the extension.
         *
         * @param url
         */
        register(url: string): void;

        /**
         * Unregisters the proxy script for the extension.
         */
        unregister(): void;

        /**
         * Notifies about proxy script errors.
         *
         * @param error
         */
        onProxyError: Events.Event<(error: OnProxyErrorErrorType) => void>;
    }
}
