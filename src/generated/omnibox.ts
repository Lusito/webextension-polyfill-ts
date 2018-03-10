/**
 * Namespace: browser.omnibox
 * Generated from Mozilla sources
 *
 * The omnibox API allows you to register a keyword with Firefox's address bar.
 * Permissions: "manifest:omnibox"
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Events } from "./events";

export namespace Omnibox {

    /**
     * The style type.
     */
    export type DescriptionStyleType = "url" | "match" | "dim";

    /**
     * The window disposition for the omnibox query. This is the recommended context to display results. For example, if the omnibox command is to navigate to a certain URL, a disposition of 'newForegroundTab' means the navigation should take place in a new selected tab.
     */
    export type OnInputEnteredDisposition = "currentTab" | "newForegroundTab" | "newBackgroundTab";

    /**
     * A suggest result.
     */
    export interface SuggestResult {

        /**
         * The text that is put into the URL bar, and that is sent to the extension when the user chooses this entry.
         */
        content: string;

        /**
         * The text that is displayed in the URL dropdown. Can contain XML-style markup for styling. The supported tags are 'url' (for a literal URL), 'match' (for highlighting text that matched what the user's query), and 'dim' (for dim helper text). The styles can be nested, eg. <dim><match>dimmed match</match></dim>. You must escape the five predefined entities to display them as text: stackoverflow.com/a/1091953/89484 
         */
        description: string;
    }

    /**
     * A suggest result.
     */
    export interface DefaultSuggestResult {

        /**
         * The text that is displayed in the URL dropdown.
         */
        description: string;
    }

    /**
     * The style ranges for the description, as provided by the extension.
     */
    export interface SuggestResultDescriptionStylesItemType {
        offset: number;

        /**
         * The style type
         */
        type: DescriptionStyleType;

        /**
         * Optional.
         */
        length?: number;
    }

    /**
     * The style ranges for the description, as provided by ToValue().
     */
    export interface SuggestResultDescriptionStylesRawItemType {
        offset: number;

        type: number;
    }

    /**
     * The style ranges for the description, as provided by the extension.
     */
    export interface DefaultSuggestResultDescriptionStylesItemType {
        offset: number;

        /**
         * The style type
         */
        type: DescriptionStyleType;

        /**
         * Optional.
         */
        length?: number;
    }

    /**
     * The style ranges for the description, as provided by ToValue().
     */
    export interface DefaultSuggestResultDescriptionStylesRawItemType {
        offset: number;

        type: number;
    }

    export interface Static {

        /**
         * Sets the description and styling for the default suggestion. The default suggestion is the text that is displayed in the first suggestion row underneath the URL bar.
         *
         * @param suggestion A partial SuggestResult object, without the 'content' parameter.
         */
        setDefaultSuggestion(suggestion: DefaultSuggestResult): void;

        /**
         * User has started a keyword input session by typing the extension's keyword. This is guaranteed to be sent exactly once per input session, and before any onInputChanged events.
         */
        onInputStarted: Events.Event<() => void>;

        /**
         * User has changed what is typed into the omnibox.
         *
         * @param text
         * @param suggest A callback passed to the onInputChanged event used for sending suggestions back to the browser.
         */
        onInputChanged: Events.Event<(text: string, suggest: (suggestResults: SuggestResult[]) => void) => void>;

        /**
         * User has accepted what is typed into the omnibox.
         *
         * @param text
         * @param disposition
         */
        onInputEntered: Events.Event<(text: string, disposition: OnInputEnteredDisposition) => void>;

        /**
         * User has ended the keyword input session without accepting the input.
         */
        onInputCancelled: Events.Event<() => void>;
    }
}
