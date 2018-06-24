/**
 * Namespace: browser.proxy
 * Generated from Mozilla sources
 *
 * Use the browser.proxy API to register proxy scripts in Firefox. Proxy scripts in Firefox are proxy auto-config files with extra contextual information and support for additional return types.
 * Permissions: "proxy"
 */
import { WebRequest } from "./webRequest";
import { Events } from "./events";
import { Types } from "./types";

export namespace Proxy {

    /**
     * An object which describes proxy settings.
     */
    export interface ProxyConfig {

        /**
         * The type of proxy to use.
         * Optional.
         */
        proxyType?: ProxyConfigProxyTypeEnum;

        /**
         * The address of the http proxy, can include a port.
         * Optional.
         */
        http?: string;

        /**
         * Use the http proxy server for all protocols.
         * Optional.
         */
        httpProxyAll?: boolean;

        /**
         * The address of the ftp proxy, can include a port.
         * Optional.
         */
        ftp?: string;

        /**
         * The address of the ssl proxy, can include a port.
         * Optional.
         */
        ssl?: string;

        /**
         * The address of the socks proxy, can include a port.
         * Optional.
         */
        socks?: string;

        /**
         * The version of the socks proxy.
         * Optional.
         */
        socksVersion?: number;

        /**
         * A list of hosts which should not be proxied.
         * Optional.
         */
        passthrough?: string;

        /**
         * A URL to use to configure the proxy.
         * Optional.
         */
        autoConfigUrl?: string;

        /**
         * Do not prompt for authentication if password is saved.
         * Optional.
         */
        autoLogin?: boolean;

        /**
         * Proxy DNS when using SOCKS v5.
         * Optional.
         */
        proxyDNS?: boolean;
    }

    export interface OnRequestDetailsType {

        /**
         * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
         */
        requestId: string;

        url: string;

        /**
         * Standard HTTP method.
         */
        method: string;

        /**
         * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (<code>type</code> is <code>main_frame</code> or <code>sub_frame</code>), <code>frameId</code> indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
         */
        frameId: number;

        /**
         * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
         */
        parentFrameId: number;

        /**
         * URL of the resource that triggered this request.
         * Optional.
         */
        originUrl?: string;

        /**
         * URL of the page into which the requested resource will be loaded.
         * Optional.
         */
        documentUrl?: string;

        /**
         * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
         */
        tabId: number;

        /**
         * How the requested resource will be used.
         */
        type: WebRequest.ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;

        /**
         * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
         * Optional.
         */
        ip?: string;

        /**
         * Indicates if this response was fetched from disk cache.
         */
        fromCache: boolean;

        /**
         * The HTTP request headers that are going to be sent out with this request.
         * Optional.
         */
        requestHeaders?: WebRequest.HttpHeaders;
    }

    export interface OnErrorErrorType {
    }

    export interface OnProxyErrorErrorType {
    }

    /**
     * The type of proxy to use.
     */
    export type ProxyConfigProxyTypeEnum = "none" | "autoDetect" | "system" | "manual" | "autoConfig";

    /**
     * Fired when proxy data is needed for a request.
     */
    export interface onRequestEvent extends Events.Event<(details: OnRequestDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnRequestDetailsType) => void, filter: WebRequest.RequestFilter, extraInfoSpec?: string[]): void;
    }

    export interface Static {

        /**
         * Registers the proxy script for the extension.
         *
         * @param url
         * @returns Promise<void>
         */
        register(url: string): Promise<void>;

        /**
         * Unregisters the proxy script for the extension.
         *
         * @returns Promise<void>
         */
        unregister(): Promise<void>;

        /**
         * Fired when proxy data is needed for a request.
         */
        onRequest: onRequestEvent;

        /**
         * Notifies about proxy script errors.
         *
         * @param error
         */
        onError: Events.Event<(error: OnErrorErrorType) => void>;

        /**
         * Please use $(ref:proxy.onError).
         *
         * @param error
         */
        onProxyError: Events.Event<(error: OnProxyErrorErrorType) => void>;

        /**
         * Configures proxy settings. This setting's value is an object of type ProxyConfig.
         */
        settings: Types.Setting;
    }
}
