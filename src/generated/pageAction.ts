/**
 * Namespace: browser.pageAction
 * Generated from Mozilla sources
 *
 * Use the <code>browser.pageAction</code> API to put icons inside the address bar. Page actions represent actions that can be taken on the current page, but that aren't applicable to all pages.
 * Permissions: "manifest:page_action"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Tabs } from "./tabs";
import { Events } from "./events";

export namespace PageAction {

    /**
     * Pixel data for an image. Must be an ImageData object (for example, from a <code>canvas</code> element).
     */
    export interface ImageDataType {
    }

    export interface IsShownDetailsType {

        /**
         * Specify the tab to get the shownness from.
         */
        tabId: number;
    }

    export interface SetTitleDetailsType {

        /**
         * The id of the tab for which you want to modify the page action.
         */
        tabId: number;

        /**
         * The tooltip string.
         */
        title: string | null;
    }

    export interface GetTitleDetailsType {

        /**
         * Specify the tab to get the title from.
         */
        tabId: number;
    }

    export interface SetIconDetailsType {

        /**
         * The id of the tab for which you want to modify the page action.
         */
        tabId: number;

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
    }

    export interface SetPopupDetailsType {

        /**
         * The id of the tab for which you want to modify the page action.
         */
        tabId: number;

        /**
         * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
         */
        popup: string | null;
    }

    export interface GetPopupDetailsType {

        /**
         * Specify the tab to get the popup from.
         */
        tabId: number;
    }

    export interface Static {

        /**
         * Shows the page action. The page action is shown whenever the tab is selected.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @returns Promise<void>
         */
        show(tabId: number): Promise<void>;

        /**
         * Hides the page action.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @returns Promise<void>
         */
        hide(tabId: number): Promise<void>;

        /**
         * Checks whether the page action is shown.
         *
         * @param details
         * @returns Promise<boolean>
         */
        isShown(details: IsShownDetailsType): Promise<boolean>;

        /**
         * Sets the title of the page action. This is displayed in a tooltip over the page action.
         *
         * @param details
         */
        setTitle(details: SetTitleDetailsType): void;

        /**
         * Gets the title of the page action.
         *
         * @param details
         * @returns Promise<string>
         */
        getTitle(details: GetTitleDetailsType): Promise<string>;

        /**
         * Sets the icon for the page action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the <b>path</b> or the <b>imageData</b> property must be specified.
         *
         * @param details
         * @returns Promise<void>
         */
        setIcon(details: SetIconDetailsType): Promise<void>;

        /**
         * Sets the html document to be opened as a popup when the user clicks on the page action's icon.
         *
         * @param details
         * @returns Promise<void>
         */
        setPopup(details: SetPopupDetailsType): Promise<void>;

        /**
         * Gets the html document set as the popup for this page action.
         *
         * @param details
         * @returns Promise<string>
         */
        getPopup(details: GetPopupDetailsType): Promise<string>;

        /**
         * Opens the extension page action in the active window.
         *
         * @returns Promise<void>
         */
        openPopup(): Promise<void>;

        /**
         * Fired when a page action icon is clicked.  This event will not fire if the page action has a popup.
         *
         * @param tab
         */
        onClicked: Events.Event<(tab: Tabs.Tab) => void>;
    }
}
