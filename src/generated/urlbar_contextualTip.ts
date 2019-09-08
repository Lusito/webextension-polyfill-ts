/**
 * Namespace: browser.urlbar.contextualTip
 * Generated from Mozilla sources
 *
 * A contextual tip appears in the urlbar's view (its search results panel) and has an icon, text, optional button, and an optional link. Use the <code>browser.urlbar.contextualTip</code> API to experiment with the contextual tip. Restricted to Mozilla privileged WebExtensions.
 *
 * Comments found in source JSON schema files:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Manifest } from "./manifest";
import { Events } from "./events";

export namespace UrlbarContextualTip {

    /**
     * An object containing the path to an icon, the title, button title, and link title to set on the contextual tip.
     */
    export interface ContextualTip {

        /**
         * Specifies the default icon and theme icons
         * Optional.
         */
        icon?: ContextualTipIconType;

        /**
         * A string to be used as the contextual tip's title.
         */
        title: string;

        /**
         * A string to be used as the contextual tip's button's title.
         * Optional.
         */
        buttonTitle?: string;

        /**
         * A string to be used as the contextual tip's link's title.
         * Optional.
         */
        linkTitle?: string;
    }

    /**
     * Specifies the default icon and theme icons
     */
    export interface ContextualTipIconType {

        /**
         * Specifies the default icon to use in the contextual tip.
         */
        defaultIcon: string | Manifest.IconPath;

        /**
         * Specifies icons to use for dark and light themes. Each item in the array is for a specified icon size.
         * Optional.
         */
        themeIcons?: Manifest.ThemeIcons[];
    }

    export interface Static {

        /**
         * Sets the contextual tip in the most recent browser winodw with the given icon, title, button title, and link title. If the urlbar's view is not already open, then it will be opened so the contextual tip will be visible. Note that when the urlbar's view is closed, the contextual tip is hidden and will not appear again. `browser.urlbar.contextualTip.set` must be called each time a contextual tip should appear.
         *
         * @param details Specifies the contextual tip's texts.
         */
        set(details: ContextualTip): void;

        /**
         * Hides the contextual tip (it will still be in the DOM).
         */
        remove(): void;

        /**
         * Fired when the user clicks the contextual tip's button.
         *
         * @param windowId The id of the window where the contextual tip's button was clicked.
         */
        onButtonClicked: Events.Event<(windowId: number) => void>;

        /**
         * Fired when the user clicks the contextual tip's link.
         *
         * @param windowId The id of the window where the contextual tip's link was clicked.
         */
        onLinkClicked: Events.Event<(windowId: number) => void>;
    }
}
