/**
 * Namespace: browser.privacy.network
 * Generated from Mozilla sources
 *
 * Use the <code>browser.privacy</code> API to control usage of the features in the browser that can affect a user's privacy.
 * Permissions: "privacy"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Types } from "./types";

export namespace PrivacyNetwork {

    /**
     * The IP handling policy of WebRTC.
     */
    export type IPHandlingPolicy = "default" | "default_public_and_private_interfaces" | "default_public_interface_only" | "disable_non_proxied_udp";

    export interface Static {

        /**
         * If enabled, the browser attempts to speed up your web browsing experience by pre-resolving DNS entries, prerendering sites (<code>&lt;link rel='prefetch' ...&gt;</code>), and preemptively opening TCP and SSL connections to servers.  This preference's value is a boolean, defaulting to <code>true</code>.
         */
        networkPredictionEnabled: Types.Setting;

        /**
         * Allow users to enable and disable RTCPeerConnections (aka WebRTC).
         */
        peerConnectionEnabled: Types.Setting;

        /**
         * Allow users to specify the media performance/privacy tradeoffs which impacts how WebRTC traffic will be routed and how much local address information is exposed. This preference's value is of type IPHandlingPolicy, defaulting to <code>default</code>.
         */
        webRTCIPHandlingPolicy: Types.Setting;
    }
}
