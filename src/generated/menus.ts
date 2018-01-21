/**
 * Namespace: browser.menus
 * Generated from Mozilla sources
 *
 * Use the browser.menus API to add items to the browser's menus. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
 * Permissions: "menus"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Tabs } from "./Tabs";
import { Events } from "./Events";

export namespace Menus {

    /**
     * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts except for 'tab' and 'tools_menu'.
     */
    export type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "password" | "image" | "video" | "audio" | "launcher" | "bookmark" | "browser_action" | "page_action" | "tab" | "tools_menu";

    /**
     * The type of menu item.
     */
    export type ItemType = "normal" | "checkbox" | "radio" | "separator";

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
         * If the element is a link, the text of that link.
         * Optional.
         */
        linkText?: string;

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

        /**
         * The id of the bookmark where the context menu was clicked, if it was on a bookmark.
         */
        bookmarkId: string;

        /**
         * An array of keyboard modifiers that were held while the menu item was clicked.
         */
        modifiers: OnClickDataModifiersItemEnum[];
    }

    export interface CreateCreatePropertiesType {

        /**
         * The type of menu item. Defaults to 'normal' if not specified.
         * Optional.
         */
        type?: ItemType;

        /**
         * The unique ID to assign to this item. Mandatory for event pages. Cannot be the same as another ID for this extension.
         * Optional.
         */
        id?: string;

        /**
         * Optional.
         */
        icons?: CreateCreatePropertiesTypeIconsType;

        /**
         * The text to be displayed in the item; this is <em>required</em> unless <code>type</code> is 'separator'. When the context is 'selection', you can use <code>%s</code> within the string to show the selected text. For example, if this parameter's value is "Translate '%s' to Pig Latin" and the user selects the word "cool", the context menu item for the selection is "Translate 'cool' to Pig Latin".
         * Optional.
         */
        title?: string;

        /**
         * The initial state of a checkbox or radio item: true for selected and false for unselected. Only one radio item can be selected at a time in a given group of radio items.
         * Optional.
         */
        checked?: boolean;

        /**
         * List of contexts this menu item will appear in. Defaults to ['page'] if not specified.
         * Optional.
         */
        contexts?: [ContextType];

        /**
         * A function that will be called back when the menu item is clicked. Event pages cannot use this; instead, they should register a listener for $(ref:contextMenus.onClicked).
         *
         * @param info Information about the item clicked and the context where the click happened.
         * @param tab The details of the tab where the click took place. Note: this parameter only present for extensions.
         */
        onclick?(info: OnClickData, tab: Tabs.Tab): void;

        /**
         * The ID of a parent menu item; this makes the item a child of a previously added item.
         * Optional.
         */
        parentId?: number | string;

        /**
         * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see $(topic:match_patterns)[Match Patterns].
         * Optional.
         */
        documentUrlPatterns?: string[];

        /**
         * Similar to documentUrlPatterns, but lets you filter based on the src attribute of img/audio/video tags and the href of anchor tags.
         * Optional.
         */
        targetUrlPatterns?: string[];

        /**
         * Whether this context menu item is enabled or disabled. Defaults to true.
         * Optional.
         */
        enabled?: boolean;

        /**
         * Specifies a command to issue for the context click.  Currently supports internal commands _execute_page_action, _execute_browser_action and _execute_sidebar_action.
         * Optional.
         */
        command?: string;
    }

    /**
     * The properties to update. Accepts the same values as the create function.
     */
    export interface UpdateUpdatePropertiesType {

        /**
         * Optional.
         */
        type?: ItemType;

        /**
         * Optional.
         */
        title?: string;

        /**
         * Optional.
         */
        checked?: boolean;

        /**
         * Optional.
         */
        contexts?: [ContextType];

        /**
         * @param info
         * @param tab The details of the tab where the click took place. Note: this parameter only present for extensions.
         */
        onclick?(info: OnClickData, tab: Tabs.Tab): void;

        /**
         * Note: You cannot change an item to be a child of one of its own descendants.
         * Optional.
         */
        parentId?: number | string;

        /**
         * Optional.
         */
        documentUrlPatterns?: string[];

        /**
         * Optional.
         */
        targetUrlPatterns?: string[];

        /**
         * Optional.
         */
        enabled?: boolean;
    }

    export type OnClickDataModifiersItemEnum = "Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl";

    export interface CreateCreatePropertiesTypeIconsType {
    }

    export interface Static {

        /**
         * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in $(ref:runtime.lastError)).
         *
         * @param createProperties
         * @param callback Optional. Called when the item has been created in the browser. If there were any problems creating the item, details will be available in $(ref:runtime.lastError).
         * @returns number | string The ID of the newly created item.
         */
        create(createProperties: CreateCreatePropertiesType, callback?: () => void): number | string;

        /**
         * Updates a previously created context menu item.
         *
         * @param id The ID of the item to update.
         * @param updateProperties The properties to update. Accepts the same values as the create function.
         * @returns Promise<void> Called when the context menu has been updated.
         */
        update(id: number | string, updateProperties: UpdateUpdatePropertiesType): Promise<void>;

        /**
         * Removes a context menu item.
         *
         * @param menuItemId The ID of the context menu item to remove.
         * @returns Promise<void> Called when the context menu has been removed.
         */
        remove(menuItemId: number | string): Promise<void>;

        /**
         * Removes all context menu items added by this extension.
         *
         * @returns Promise<void> Called when removal is complete.
         */
        removeAll(): Promise<void>;

        /**
         * Fired when a context menu item is clicked.
         *
         * @param info Information about the item clicked and the context where the click happened.
         * @param tab Optional. The details of the tab where the click took place. If the click did not take place in a tab, this parameter will be missing.
         */
        onClicked: Events.Event<(info: OnClickData, tab: Tabs.Tab | undefined) => void>;

        /**
         * The maximum number of top level extension items that can be added to an extension action context menu. Any items beyond this limit will be ignored.
         */
        ACTION_MENU_TOP_LEVEL_LIMIT: 6;
    }
}
