/**
 * Namespace: browser.devtools.network
 * Generated from Mozilla sources
 *
 * Use the <code>chrome.devtools.network</code> API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Events } from "./Events";

export namespace DevtoolsNetwork {

    /**
     * Represents a network request for a document resource (script, image and so on). See HAR Specification for reference.
     */
    export interface Request {

        /**
         * Returns content of the response body.
         *
         * @returns Promise<[string, string]> A function that receives the response body when the request completes.
         */
        getContent(): Promise<[string, string]>;
    }

    /**
     * A HAR log. See HAR specification for details.
     */
    export interface GetHARCallbackharLogType {
    }

    export interface Static {

        /**
         * Fired when the inspected window navigates to a new page.
         *
         * @param url URL of the new page.
         */
        onNavigated: Events.Event<(url: string) => void>;
    }
}
