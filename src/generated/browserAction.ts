/**
 * Namespace: browser.browserAction
 * Generated from Mozilla sources
 *
 * Use browser actions to put icons in the main browser toolbar, to the right of the address bar. In addition to its icon, a browser action can also have a tooltip, a badge, and a popup.
 * Permissions: "manifest:browser_action"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Tabs } from "./tabs";
import { Events } from "./events";

export namespace BrowserAction {
    export type ColorArray = number[];

    /**
     * Pixel data for an image. Must be an ImageData object (for example, from a <code>canvas</code> element).
     */
    export interface ImageDataType {
    }

    export interface SetTitleDetailsType {

        /**
         * The string the browser action should display when moused over.
         */
        title: string | null;

        /**
         * Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.
         * Optional.
         */
        tabId?: number;
    }

    export interface GetTitleDetailsType {

        /**
         * Specify the tab to get the title from. If no tab is specified, the non-tab-specific title is returned.
         * Optional.
         */
        tabId?: number;
    }

    export interface SetIconDetailsType {

        /**
         * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals <code>scale</code>, then image with size <code>scale</code> * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
         * Optional.
         */
        imageData?: ImageDataType | {[s:string]:ImageDataType};

        /**
         * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals <code>scale</code>, then image with size <code>scale</code> * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
         * Optional.
         */
        path?: string | {[s:string]:string};

        /**
         * Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.
         * Optional.
         */
        tabId?: number;
    }

    export interface SetPopupDetailsType {

        /**
         * Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.
         * Optional.
         */
        tabId?: number;

        /**
         * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
         */
        popup: string | null;
    }

    export interface GetPopupDetailsType {

        /**
         * Specify the tab to get the popup from. If no tab is specified, the non-tab-specific popup is returned.
         * Optional.
         */
        tabId?: number;
    }

    export interface SetBadgeTextDetailsType {

        /**
         * Any number of characters can be passed, but only about four can fit in the space.
         */
        text: string | null;

        /**
         * Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.
         * Optional.
         */
        tabId?: number;
    }

    export interface GetBadgeTextDetailsType {

        /**
         * Specify the tab to get the badge text from. If no tab is specified, the non-tab-specific badge text is returned.
         * Optional.
         */
        tabId?: number;
    }

    export interface SetBadgeBackgroundColorDetailsType {

        /**
         * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is <code>[255, 0, 0, 255]</code>. Can also be a string with a CSS value, with opaque red being <code>#FF0000</code> or <code>#F00</code>.
         */
        color: string | ColorArray | null;

        /**
         * Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.
         * Optional.
         */
        tabId?: number;
    }

    export interface GetBadgeBackgroundColorDetailsType {

        /**
         * Specify the tab to get the badge background color from. If no tab is specified, the non-tab-specific badge background color is returned.
         * Optional.
         */
        tabId?: number;
    }

    export interface IsEnabledDetailsType {

        /**
         * Specify the tab to get the enabledness from. If no tab is specified, the non-tab-specific enabledness is returned.
         * Optional.
         */
        tabId?: number;
    }

    export interface Static {

        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @param details
         * @returns Promise<void>
         */
        setTitle(details: SetTitleDetailsType): Promise<void>;

        /**
         * Gets the title of the browser action.
         *
         * @param details
         * @returns Promise<string>
         */
        getTitle(details: GetTitleDetailsType): Promise<string>;

        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the <b>path</b> or the <b>imageData</b> property must be specified.
         *
         * @param details
         * @returns Promise<void>
         */
        setIcon(details: SetIconDetailsType): Promise<void>;

        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @param details
         * @returns Promise<void>
         */
        setPopup(details: SetPopupDetailsType): Promise<void>;

        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @param details
         * @returns Promise<string>
         */
        getPopup(details: GetPopupDetailsType): Promise<string>;

        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @param details
         * @returns Promise<void>
         */
        setBadgeText(details: SetBadgeTextDetailsType): Promise<void>;

        /**
         * Gets the badge text of the browser action. If no tab is specified, the non-tab-specific badge text is returned.
         *
         * @param details
         * @returns Promise<string>
         */
        getBadgeText(details: GetBadgeTextDetailsType): Promise<string>;

        /**
         * Sets the background color for the badge.
         *
         * @param details
         * @returns Promise<void>
         */
        setBadgeBackgroundColor(details: SetBadgeBackgroundColorDetailsType): Promise<void>;

        /**
         * Gets the background color of the browser action.
         *
         * @param details
         * @returns Promise<ColorArray>
         */
        getBadgeBackgroundColor(details: GetBadgeBackgroundColorDetailsType): Promise<ColorArray>;

        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @param tabId Optional. The id of the tab for which you want to modify the browser action.
         * @returns Promise<void>
         */
        enable(tabId?: number): Promise<void>;

        /**
         * Disables the browser action for a tab.
         *
         * @param tabId Optional. The id of the tab for which you want to modify the browser action.
         * @returns Promise<void>
         */
        disable(tabId?: number): Promise<void>;

        /**
         * Checks whether the browser action is enabled.
         *
         * @param details
         */
        isEnabled(details: IsEnabledDetailsType): void;

        /**
         * Opens the extension popup window in the active window.
         */
        openPopup(): void;

        /**
         * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
         *
         * @param tab
         */
        onClicked: Events.Event<(tab: Tabs.Tab) => void>;
    }
}
