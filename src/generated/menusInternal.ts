/**
 * Namespace: browser.menusInternal
 * Generated from Mozilla sources
 *
 * Use the <code>browser.contextMenus</code> API to add items to the browser's context menu. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
 *
 * Comments found in source JSON schema files:
 * Copyright 2014 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
export namespace MenusInternal {

    /**
     * Information sent when a context menu item is clicked.
     */
    export interface OnClickData {

        /**
         * The ID of the menu item that was clicked.
         */
        menuItemId: number | string;

        /**
         * The parent ID, if any, for the item clicked.
         * Optional.
         */
        parentMenuItemId?: number | string;

        /**
         * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
         * Optional.
         */
        mediaType?: string;

        /**
         * If the element is a link, the URL it points to.
         * Optional.
         */
        linkUrl?: string;

        /**
         * Will be present for elements with a 'src' URL.
         * Optional.
         */
        srcUrl?: string;

        /**
         * The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
         * Optional.
         */
        pageUrl?: string;

        /**
         *  The URL of the frame of the element where the context menu was clicked, if it was in a frame.
         * Optional.
         */
        frameUrl?: string;

        /**
         * The text for the context selection, if any.
         * Optional.
         */
        selectionText?: string;

        /**
         * A flag indicating whether the element is editable (text input, textarea, etc.).
         */
        editable: boolean;

        /**
         * A flag indicating the state of a checkbox or radio item before it was clicked.
         * Optional.
         */
        wasChecked?: boolean;

        /**
         * A flag indicating the state of a checkbox or radio item after it is clicked.
         * Optional.
         */
        checked?: boolean;
    }

    export interface Static {
    }
}
