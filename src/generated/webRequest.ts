/**
 * Namespace: browser.webRequest
 * Generated from Mozilla sources
 *
 * Use the <code>browser.webRequest</code> API to observe and analyze traffic and to intercept, block, or modify requests in-flight.
 * Permissions: "webRequest"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Events } from "./Events";

export namespace WebRequest {
    export type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object" | "object_subrequest" | "xmlhttprequest" | "xbl" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font" | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest" | "other";

    export type OnBeforeRequestOptions = "blocking" | "requestBody";

    export type OnBeforeSendHeadersOptions = "requestHeaders" | "blocking";

    export type OnSendHeadersOptions = "requestHeaders";

    export type OnHeadersReceivedOptions = "blocking" | "responseHeaders";

    export type OnAuthRequiredOptions = "responseHeaders" | "blocking" | "asyncBlocking";

    export type OnResponseStartedOptions = "responseHeaders";

    export type OnBeforeRedirectOptions = "responseHeaders";

    export type OnCompletedOptions = "responseHeaders";

    /**
     * An object describing filters to apply to webRequest events.
     */
    export interface RequestFilter {

        /**
         * A list of URLs or URL patterns. Requests that cannot match any of the URLs will be filtered out.
         */
        urls: [string];

        /**
         * A list of request types. Requests that cannot match any of the types will be filtered out.
         * Optional.
         */
        types?: [ResourceType];

        /**
         * Optional.
         */
        tabId?: number;

        /**
         * Optional.
         */
        windowId?: number;
    }

    /**
     * An array of HTTP headers. Each header is represented as a dictionary containing the keys <code>name</code> and either <code>value</code> or <code>binaryValue</code>.
     */
    export type HttpHeaders = HttpHeadersItemType[];

    /**
     * Returns value for event handlers that have the 'blocking' extraInfoSpec applied. Allows the event handler to modify network requests.
     */
    export interface BlockingResponse {

        /**
         * If true, the request is cancelled. Used in onBeforeRequest, this prevents the request from being sent.
         * Optional.
         */
        cancel?: boolean;

        /**
         * Only used as a response to the onBeforeRequest and onHeadersReceived events. If set, the original request is prevented from being sent/completed and is instead redirected to the given URL. Redirections to non-HTTP schemes such as data: are allowed. Redirects initiated by a redirect action use the original request method for the redirect, with one exception: If the redirect is initiated at the onHeadersReceived stage, then the redirect will be issued using the GET method.
         * Optional.
         */
        redirectUrl?: string;

        /**
         * Only used as a response to the onBeforeRequest event. If set, the original request is prevented from being sent/completed and is instead upgraded to a secure request.  If any extension returns <code>redirectUrl</code> during onBeforeRequest, <code>upgradeToSecure</code> will have no affect.
         * Optional.
         */
        upgradeToSecure?: boolean;

        /**
         * Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.
         * Optional.
         */
        requestHeaders?: HttpHeaders;

        /**
         * Only used as a response to the onHeadersReceived event. If set, the server is assumed to have responded with these response headers instead. Only return <code>responseHeaders</code> if you really want to modify the headers in order to limit the number of conflicts (only one extension may modify <code>responseHeaders</code> for each request).
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials.
         * Optional.
         */
        authCredentials?: BlockingResponseAuthCredentialsType;
    }

    /**
     * Contains data uploaded in a URL request.
     */
    export interface UploadData {

        /**
         * An ArrayBuffer with a copy of the data.
         * Optional.
         */
        bytes?: any;

        /**
         * A string with the file's path and name.
         * Optional.
         */
        file?: string;
    }

    export interface FilterResponseDataReturnType {
    }

    export interface OnBeforeRequestDetailsType {

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
         * Contains the HTTP request body data. Only provided if extraInfoSpec contains 'requestBody'.
         * Optional.
         */
        requestBody?: OnBeforeRequestDetailsTypeRequestBodyType;

        /**
         * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
         */
        tabId: number;

        /**
         * How the requested resource will be used.
         */
        type: ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;
    }

    export interface OnBeforeSendHeadersDetailsType {

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
        type: ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;

        /**
         * The HTTP request headers that are going to be sent out with this request.
         * Optional.
         */
        requestHeaders?: HttpHeaders;
    }

    export interface OnSendHeadersDetailsType {

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
        type: ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;

        /**
         * The HTTP request headers that have been sent out with this request.
         * Optional.
         */
        requestHeaders?: HttpHeaders;
    }

    export interface OnHeadersReceivedDetailsType {

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
        type: ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;

        /**
         * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line).
         */
        statusLine: string;

        /**
         * The HTTP response headers that have been received with this response.
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * Standard HTTP status code returned by the server.
         */
        statusCode: number;
    }

    export interface OnAuthRequiredDetailsType {

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
        type: ResourceType;

        /**
         * The time when this signal is triggered, in milliseconds since the epoch.
         */
        timeStamp: number;

        /**
         * The authentication scheme, e.g. Basic or Digest.
         */
        scheme: string;

        /**
         * The authentication realm provided by the server, if there is one.
         * Optional.
         */
        realm?: string;

        /**
         * The server requesting authentication.
         */
        challenger: OnAuthRequiredDetailsTypeChallengerType;

        /**
         * True for Proxy-Authenticate, false for WWW-Authenticate.
         */
        isProxy: boolean;

        /**
         * The HTTP response headers that were received along with this response.
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
         */
        statusLine: string;

        /**
         * Standard HTTP status code returned by the server.
         */
        statusCode: number;
    }

    export interface OnResponseStartedDetailsType {

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
        type: ResourceType;

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
         * Standard HTTP status code returned by the server.
         */
        statusCode: number;

        /**
         * The HTTP response headers that were received along with this response.
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
         */
        statusLine: string;
    }

    export interface OnBeforeRedirectDetailsType {

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
        type: ResourceType;

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
         * Standard HTTP status code returned by the server.
         */
        statusCode: number;

        /**
         * The new URL.
         */
        redirectUrl: string;

        /**
         * The HTTP response headers that were received along with this redirect.
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
         */
        statusLine: string;
    }

    export interface OnCompletedDetailsType {

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
        type: ResourceType;

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
         * Standard HTTP status code returned by the server.
         */
        statusCode: number;

        /**
         * The HTTP response headers that were received along with this response.
         * Optional.
         */
        responseHeaders?: HttpHeaders;

        /**
         * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
         */
        statusLine: string;
    }

    export interface OnErrorOccurredDetailsType {

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
        type: ResourceType;

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
         * The error description. This string is <em>not</em> guaranteed to remain backwards compatible between releases. You must not parse and act based upon its content.
         */
        error: string;
    }

    export interface HttpHeadersItemType {

        /**
         * Name of the HTTP header.
         */
        name: string;

        /**
         * Value of the HTTP header if it can be represented by UTF-8.
         * Optional.
         */
        value?: string;

        /**
         * Value of the HTTP header if it cannot be represented by UTF-8, stored as individual byte values (0..255).
         * Optional.
         */
        binaryValue?: number[];
    }

    /**
     * Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials.
     */
    export interface BlockingResponseAuthCredentialsType {
        username: string;

        password: string;
    }

    /**
     * If the request method is POST and the body is a sequence of key-value pairs encoded in UTF8, encoded as either multipart/form-data, or application/x-www-form-urlencoded, this dictionary is present and for each key contains the list of all values for that key. If the data is of another media type, or if it is malformed, the dictionary is not present. An example value of this dictionary is {'key': ['value1', 'value2']}.
     */
    export interface OnBeforeRequestDetailsTypeRequestBodyFormDataType {
    }

    /**
     * Contains the HTTP request body data. Only provided if extraInfoSpec contains 'requestBody'.
     */
    export interface OnBeforeRequestDetailsTypeRequestBodyType {

        /**
         * Errors when obtaining request body data.
         * Optional.
         */
        error?: string;

        /**
         * If the request method is POST and the body is a sequence of key-value pairs encoded in UTF8, encoded as either multipart/form-data, or application/x-www-form-urlencoded, this dictionary is present and for each key contains the list of all values for that key. If the data is of another media type, or if it is malformed, the dictionary is not present. An example value of this dictionary is {'key': ['value1', 'value2']}.
         * Optional.
         */
        formData?: OnBeforeRequestDetailsTypeRequestBodyFormDataType;

        /**
         * If the request method is PUT or POST, and the body is not already parsed in formData, then the unparsed request body elements are contained in this array.
         * Optional.
         */
        raw?: UploadData[];
    }

    /**
     * The server requesting authentication.
     */
    export interface OnAuthRequiredDetailsTypeChallengerType {
        host: string;

        port: number;
    }

    /**
     * Fired when a request is about to occur.
     */
    export interface onBeforeRequestEvent extends Events.Event<(details: OnBeforeRequestDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnBeforeRequestDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnBeforeRequestOptions[]): void;
    }

    /**
     * Fired before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any HTTP data is sent. 
     */
    export interface onBeforeSendHeadersEvent extends Events.Event<(details: OnBeforeSendHeadersDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnBeforeSendHeadersDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnBeforeSendHeadersOptions[]): void;
    }

    /**
     * Fired just before a request is going to be sent to the server (modifications of previous onBeforeSendHeaders callbacks are visible by the time onSendHeaders is fired).
     */
    export interface onSendHeadersEvent extends Events.Event<(details: OnSendHeadersDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnSendHeadersDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnSendHeadersOptions[]): void;
    }

    /**
     * Fired when HTTP response headers of a request have been received.
     */
    export interface onHeadersReceivedEvent extends Events.Event<(details: OnHeadersReceivedDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnHeadersReceivedDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnHeadersReceivedOptions[]): void;
    }

    /**
     * Fired when an authentication failure is received. The listener has three options: it can provide authentication credentials, it can cancel the request and display the error page, or it can take no action on the challenge. If bad user credentials are provided, this may be called multiple times for the same request.
     */
    export interface onAuthRequiredEvent extends Events.Event<(details: OnAuthRequiredDetailsType, callback: Function | undefined) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnAuthRequiredDetailsType, callback: Function | undefined) => void, filter?: RequestFilter, extraInfoSpec?: OnAuthRequiredOptions[]): void;
    }

    /**
     * Fired when the first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.
     */
    export interface onResponseStartedEvent extends Events.Event<(details: OnResponseStartedDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnResponseStartedDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnResponseStartedOptions[]): void;
    }

    /**
     * Fired when a server-initiated redirect is about to occur.
     */
    export interface onBeforeRedirectEvent extends Events.Event<(details: OnBeforeRedirectDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnBeforeRedirectDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnBeforeRedirectOptions[]): void;
    }

    /**
     * Fired when a request is completed.
     */
    export interface onCompletedEvent extends Events.Event<(details: OnCompletedDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         * @param extraInfoSpec Optional. Array of extra information that should be passed to the listener function.
         */
        addListener(callback: (details: OnCompletedDetailsType) => void, filter?: RequestFilter, extraInfoSpec?: OnCompletedOptions[]): void;
    }

    /**
     * Fired when an error occurs.
     */
    export interface onErrorOccurredEvent extends Events.Event<(details: OnErrorOccurredDetailsType) => void> {

        /**
         * Registers an event listener <em>callback</em> to an event.
         *
         * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
         * @param filter Optional. A set of filters that restricts the events that will be sent to this listener.
         */
        addListener(callback: (details: OnErrorOccurredDetailsType) => void, filter?: RequestFilter): void;
    }

    export interface Static {

        /**
         * Needs to be called when the behavior of the webRequest handlers has changed to prevent incorrect handling due to caching. This function call is expensive. Don't call it often.
         *
         * @returns Promise<void>
         */
        handlerBehaviorChanged(): Promise<void>;

        /**
         * ...
         *
         * @param requestId
         * @returns FilterResponseDataReturnType
         */
        filterResponseData(requestId: string): FilterResponseDataReturnType;

        /**
         * Fired when a request is about to occur.
         */
        onBeforeRequest: onBeforeRequestEvent;

        /**
         * Fired before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any HTTP data is sent. 
         */
        onBeforeSendHeaders: onBeforeSendHeadersEvent;

        /**
         * Fired just before a request is going to be sent to the server (modifications of previous onBeforeSendHeaders callbacks are visible by the time onSendHeaders is fired).
         */
        onSendHeaders: onSendHeadersEvent;

        /**
         * Fired when HTTP response headers of a request have been received.
         */
        onHeadersReceived: onHeadersReceivedEvent;

        /**
         * Fired when an authentication failure is received. The listener has three options: it can provide authentication credentials, it can cancel the request and display the error page, or it can take no action on the challenge. If bad user credentials are provided, this may be called multiple times for the same request.
         */
        onAuthRequired: onAuthRequiredEvent;

        /**
         * Fired when the first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.
         */
        onResponseStarted: onResponseStartedEvent;

        /**
         * Fired when a server-initiated redirect is about to occur.
         */
        onBeforeRedirect: onBeforeRedirectEvent;

        /**
         * Fired when a request is completed.
         */
        onCompleted: onCompletedEvent;

        /**
         * Fired when an error occurs.
         */
        onErrorOccurred: onErrorOccurredEvent;

        /**
         * The maximum number of times that <code>handlerBehaviorChanged</code> can be called per 10 minute sustained interval. <code>handlerBehaviorChanged</code> is an expensive function call that shouldn't be called often.
         */
        MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: 20;
    }
}
