/**
 * Namespace: browser.devtools.panels
 * Generated from Mozilla sources
 *
 * Use the <code>chrome.devtools.panels</code> API to integrate your extension into Developer Tools window UI: create your own panels, access existing panels, and add sidebars.
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { Manifest } from "./manifest";
import { Events } from "./events";

export namespace DevtoolsPanels {

    /**
     * Represents the Elements panel.
     */
    export interface ElementsPanel {

        /**
         * Creates a pane within panel's sidebar.
         *
         * @param title Text that is displayed in sidebar caption.
         * @returns Promise<ExtensionSidebarPane> A callback invoked when the sidebar is created.
         */
        createSidebarPane(title: string): Promise<ExtensionSidebarPane>;
    }

    /**
     * Represents the Sources panel.
     */
    export interface SourcesPanel {
    }

    /**
     * Represents a panel created by extension.
     */
    export interface ExtensionPanel {
    }

    /**
     * A sidebar created by the extension.
     */
    export interface ExtensionSidebarPane {

        /**
         * Sets an expression that is evaluated within the inspected page. The result is displayed in the sidebar pane.
         *
         * @param expression An expression to be evaluated in context of the inspected page. JavaScript objects and DOM nodes are displayed in an expandable tree similar to the console/watch.
         * @param rootTitle Optional. An optional title for the root of the expression tree.
         * @returns Promise<void> A callback invoked after the sidebar pane is updated with the expression evaluation results.
         */
        setExpression(expression: string, rootTitle?: string): Promise<void>;

        /**
         * Sets a JSON-compliant object to be displayed in the sidebar pane.
         *
         * @param jsonObject An object to be displayed in context of the inspected page. Evaluated in the context of the caller (API client).
         * @param rootTitle Optional. An optional title for the root of the expression tree.
         * @returns Promise<void> A callback invoked after the sidebar is updated with the object.
         */
        setObject(jsonObject: string, rootTitle?: string): Promise<void>;

        /**
         * Sets an HTML page to be displayed in the sidebar pane.
         *
         * @param path Relative path of an extension page to display within the sidebar.
         */
        setPage(path: Manifest.ExtensionURL): void;
    }

    /**
     * A button created by the extension.
     */
    export interface Button {
    }

    export interface Static {

        /**
         * Creates an extension panel.
         *
         * @param title Title that is displayed next to the extension icon in the Developer Tools toolbar.
         * @param iconPath Path of the panel's icon relative to the extension directory, or an empty string to use the default extension icon as the panel icon.
         * @param pagePath Path of the panel's HTML page relative to the extension directory.
         * @returns Promise<ExtensionPanel> A function that is called when the panel is created.
         */
        create(title: string, iconPath: "" | Manifest.ExtensionURL, pagePath: Manifest.ExtensionURL): Promise<ExtensionPanel>;

        /**
         * Fired when the devtools theme changes.
         *
         * @param themeName The name of the current devtools theme.
         */
        onThemeChanged: Events.Event<(themeName: string) => void>;

        /**
         * Elements panel.
         */
        elements: ElementsPanel;

        /**
         * Sources panel.
         */
        sources: SourcesPanel;

        /**
         * The name of the current devtools theme.
         */
        themeName: string;
    }
}
