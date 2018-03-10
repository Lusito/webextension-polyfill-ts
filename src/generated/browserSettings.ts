/**
 * Namespace: browser.browserSettings
 * Generated from Mozilla sources
 *
 * Use the <code>browser.browserSettings</code> API to control global settings of the browser.
 * Permissions: "browserSettings"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Types } from "./types";

export namespace BrowserSettings {

    /**
     * How images should be animated in the browser.
     */
    export type ImageAnimationBehavior = "normal" | "none" | "once";

    /**
     * After which mouse event context menus should popup.
     */
    export type ContextMenuMouseEvent = "mouseup" | "mousedown";

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

    /**
     * The type of proxy to use.
     */
    export type ProxyConfigProxyTypeEnum = "none" | "autoDetect" | "system" | "manual" | "autoConfig";

    export interface Static {

        /**
         * Allows or disallows pop-up windows from opening in response to user events.
         */
        allowPopupsForUserEvents: Types.Setting;

        /**
         * Enables or disables the browser cache.
         */
        cacheEnabled: Types.Setting;

        /**
         * Controls after which mouse event context menus popup. This setting's value is of type ContextMenuMouseEvent, which has possible values of <code>mouseup</code> and <code>mousedown</code>.
         */
        contextMenuShowEvent: Types.Setting;

        /**
         * Returns the value of the overridden home page. Read-only.
         */
        homepageOverride: Types.Setting;

        /**
         * Controls the behaviour of image animation in the browser. This setting's value is of type ImageAnimationBehavior, defaulting to <code>normal</code>.
         */
        imageAnimationBehavior: Types.Setting;

        /**
         * Returns the value of the overridden new tab page. Read-only.
         */
        newTabPageOverride: Types.Setting;

        /**
         * This boolean setting controls whether bookmarks are opened in the current tab or in a new tab.
         */
        openBookmarksInNewTabs: Types.Setting;

        /**
         * This boolean setting controls whether search results are opened in the current tab or in a new tab.
         */
        openSearchResultsInNewTabs: Types.Setting;

        /**
         * Configures proxy settings. This setting's value is an object of type ProxyConfig.
         */
        proxyConfig: Types.Setting;

        /**
         * Disables webAPI notifications.
         */
        webNotificationsDisabled: Types.Setting;
    }
}
