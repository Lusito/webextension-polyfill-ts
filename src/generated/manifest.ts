/**
 * Namespace: browser.manifest
 * Generated from Mozilla sources
 *
 * Permissions: -
 *
 * Comments found in source JSON schema files:
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Copyright 2014 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 * Copyright 2013 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
import { ExtensionTypes } from "./extensionTypes";
import { Experiments } from "./experiments";

export namespace Manifest {

    /**
     * Common properties for all manifest.json files
     */
    export interface ManifestBase {
        manifest_version: number;

        /**
         * Optional.
         */
        applications?: ManifestBaseApplicationsType;

        /**
         * Optional.
         */
        browser_specific_settings?: ManifestBaseBrowserSpecificSettingsType;

        name: string;

        /**
         * Optional.
         */
        short_name?: string;

        /**
         * Optional.
         */
        description?: string;

        /**
         * Optional.
         */
        author?: string;

        version: string;

        /**
         * Optional.
         */
        homepage_url?: string;
    }

    /**
     * Represents a WebExtension manifest.json file
     */
    export interface WebExtensionManifest extends ManifestBase {

        /**
         * Optional.
         */
        minimum_chrome_version?: string;

        /**
         * Optional.
         */
        minimum_opera_version?: string;

        /**
         * Optional.
         */
        icons?: {[s:string]:ExtensionFileUrl};

        /**
         * Optional.
         */
        incognito?: WebExtensionManifestIncognitoEnum;

        /**
         * Optional.
         */
        background?: WebExtensionManifestBackgroundC1Type | WebExtensionManifestBackgroundC2Type;

        /**
         * Optional.
         */
        options_ui?: WebExtensionManifestOptionsUiType;

        /**
         * Optional.
         */
        content_scripts?: ContentScript[];

        /**
         * Optional.
         */
        content_security_policy?: string;

        /**
         * Optional.
         */
        permissions?: PermissionOrOrigin[];

        /**
         * Optional.
         */
        optional_permissions?: OptionalPermissionOrOrigin[];

        /**
         * Optional.
         */
        web_accessible_resources?: string[];

        /**
         * Optional.
         */
        developer?: WebExtensionManifestDeveloperType;

        /**
         * Optional.
         */
        hidden?: boolean;

        /**
         * Optional.
         */
        browser_action?: WebExtensionManifestBrowserActionType;

        /**
         * Optional.
         */
        chrome_settings_overrides?: WebExtensionManifestChromeSettingsOverridesType;

        /**
         * Optional.
         */
        commands?: WebExtensionManifestCommandsType;

        /**
         * Optional.
         */
        devtools_page?: ExtensionURL;

        /**
         * Optional.
         */
        experiment_apis?: WebExtensionManifestExperimentApisType;

        /**
         * A list of protocol handler definitions.
         * Optional.
         */
        protocol_handlers?: ProtocolHandler[];

        /**
         * Optional.
         */
        default_locale?: string;

        /**
         * Optional.
         */
        omnibox?: WebExtensionManifestOmniboxType;

        /**
         * Optional.
         */
        page_action?: WebExtensionManifestPageActionType;

        /**
         * Optional.
         */
        sidebar_action?: WebExtensionManifestSidebarActionType;

        /**
         * Optional.
         */
        theme_experiment?: ThemeExperiment;

        /**
         * Optional.
         */
        chrome_url_overrides?: WebExtensionManifestChromeUrlOverridesType;

        /**
         * Optional.
         */
        user_scripts?: WebExtensionManifestUserScriptsType;
    }

    /**
     * Represents a WebExtension language pack manifest.json file
     */
    export interface WebExtensionLangpackManifest extends ManifestBase {

        /**
         * Optional.
         */
        homepage_url?: string;

        langpack_id: string;

        languages: {[s:string]:WebExtensionLangpackManifestLanguagesPatternType};

        /**
         * Optional.
         */
        sources?: {[s:string]:WebExtensionLangpackManifestSourcesPatternType};
    }

    /**
     * Represents a WebExtension dictionary manifest.json file
     */
    export interface WebExtensionDictionaryManifest extends ManifestBase {

        /**
         * Optional.
         */
        homepage_url?: string;

        dictionaries: {[s:string]:string};
    }

    export interface ThemeIcons {

        /**
         * A light icon to use for dark themes
         */
        light: ExtensionURL;

        /**
         * The dark icon to use for light themes
         */
        dark: ExtensionURL;

        /**
         * The size of the icons
         */
        size: number;
    }

    export type OptionalPermission = "clipboardRead" | "clipboardWrite" | "geolocation" | "idle" | "notifications" | "bookmarks" | "browserSettings" | "cookies" | "downloads" | "downloads.open" | "find" | "history" | "menus.overrideContext" | "search" | "activeTab" | "tabs" | "tabHide" | "topSites" | "webNavigation" | "webRequest" | "webRequestBlocking";

    export type OptionalPermissionOrOrigin = OptionalPermission | MatchPattern;

    export type Permission = OptionalPermission | "alarms" | "mozillaAddons" | "storage" | "unlimitedStorage" | "browsingData" | "contextualIdentities" | "devtools" | "dns" | "geckoProfiler" | "identity" | "management" | "menus" | "contextMenus" | "pkcs11" | "privacy" | "proxy" | "nativeMessaging" | "sessions" | "theme" | string;

    export type PermissionOrOrigin = Permission | MatchPattern;

    export type HttpURL = string;

    export type ExtensionURL = string;

    export type ExtensionFileUrl = string;

    export type ImageDataOrExtensionURL = string;

    export type ExtensionID = string;

    export interface FirefoxSpecificProperties {

        /**
         * Optional.
         */
        id?: ExtensionID;

        /**
         * Optional.
         */
        update_url?: string;

        /**
         * Optional.
         */
        strict_min_version?: string;

        /**
         * Optional.
         */
        strict_max_version?: string;
    }

    export type MatchPattern = "<all_urls>" | MatchPatternRestricted | MatchPatternUnestricted;

    /**
     * Same as MatchPattern above, but excludes <all_urls>
     */
    export type MatchPatternRestricted = string;

    /**
     * Mostly unrestricted match patterns for privileged add-ons. This should technically be rejected for unprivileged add-ons, but, reasons. The MatchPattern class will still refuse privileged schemes for those extensions.
     */
    export type MatchPatternUnestricted = string;

    /**
     * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time. Based on InjectDetails, but using underscore rather than camel case naming conventions.
     */
    export interface ContentScript {
        matches: MatchPattern[];

        /**
         * Optional.
         */
        exclude_matches?: MatchPattern[];

        /**
         * Optional.
         */
        include_globs?: string[];

        /**
         * Optional.
         */
        exclude_globs?: string[];

        /**
         * The list of CSS files to inject
         * Optional.
         */
        css?: ExtensionURL[];

        /**
         * The list of JS files to inject
         * Optional.
         */
        js?: ExtensionURL[];

        /**
         * If allFrames is <code>true</code>, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's <code>false</code> and is only injected into the top frame.
         * Optional.
         */
        all_frames?: boolean;

        /**
         * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is <code>false</code>.
         * Optional.
         */
        match_about_blank?: boolean;

        /**
         * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
         * Optional.
         */
        run_at?: ExtensionTypes.RunAt;
    }

    export type IconPath = {[s:string]:ExtensionFileUrl} | ExtensionFileUrl;

    export type IconImageData = {[s:string]:ImageData} | ImageData;

    export type PersistentBackgroundProperty = boolean;

    export type KeyName = string;

    /**
     * Represents a protocol handler definition.
     */
    export interface ProtocolHandler {

        /**
         * A user-readable title string for the protocol handler. This will be displayed to the user in interface objects as needed.
         */
        name: string;

        /**
         * The protocol the site wishes to handle, specified as a string. For example, you can register to handle SMS text message links by registering to handle the "sms" scheme.
         */
        protocol: "bitcoin" | "dat" | "dweb" | "geo" | "gopher" | "im" | "ipfs" | "ipns" | "irc" | "ircs" | "magnet" | "mailto" | "mms" | "news" | "nntp" | "sip" | "sms" | "smsto" | "ssb" | "ssh" | "tel" | "urn" | "webcal" | "wtai" | "xmpp" | string;

        /**
         * The URL of the handler, as a string. This string should include "%s" as a placeholder which will be replaced with the escaped URL of the document to be handled. This URL might be a true URL, or it could be a phone number, email address, or so forth.
         */
        uriTemplate: ExtensionURL | HttpURL;
    }

    export type ThemeColor = string | [number, number, number] | [number, number, number, number];

    export interface ThemeExperiment {

        /**
         * Optional.
         */
        stylesheet?: ExtensionURL;

        /**
         * Optional.
         */
        images?: ThemeExperimentImagesType;

        /**
         * Optional.
         */
        colors?: ThemeExperimentColorsType;

        /**
         * Optional.
         */
        properties?: ThemeExperimentPropertiesType;
    }

    export interface ThemeType {

        /**
         * Optional.
         */
        images?: ThemeTypeImagesType;

        /**
         * Optional.
         */
        colors?: ThemeTypeColorsType;

        /**
         * Optional.
         */
        icons?: ThemeTypeIconsType;

        /**
         * Optional.
         */
        properties?: ThemeTypePropertiesType;
    }

    /**
     * Contents of manifest.json for a static theme
     */
    export interface ThemeManifest extends Manifest.ManifestBase {
        theme: ThemeType;

        /**
         * Optional.
         */
        default_locale?: string;

        /**
         * Optional.
         */
        theme_experiment?: ThemeExperiment;

        /**
         * Optional.
         */
        icons?: {[s:string]:string};
    }

    export interface ManifestBaseApplicationsType {

        /**
         * Optional.
         */
        gecko?: FirefoxSpecificProperties;
    }

    export interface ManifestBaseBrowserSpecificSettingsType {

        /**
         * Optional.
         */
        gecko?: FirefoxSpecificProperties;
    }

    export type WebExtensionManifestIncognitoEnum = "not_allowed" | "spanning";

    export interface WebExtensionManifestBackgroundC1Type {
        page: ExtensionURL;

        /**
         * Optional.
         */
        persistent?: boolean;
    }

    export interface WebExtensionManifestBackgroundC2Type {
        scripts: ExtensionURL[];

        /**
         * Optional.
         */
        persistent?: boolean;
    }

    export interface WebExtensionManifestOptionsUiType {
        page: ExtensionURL;

        /**
         * Optional.
         */
        browser_style?: boolean;

        /**
         * Optional.
         */
        chrome_style?: boolean;

        /**
         * Optional.
         */
        open_in_tab?: boolean;
    }

    export interface WebExtensionManifestDeveloperType {

        /**
         * Optional.
         */
        name?: string;

        /**
         * Optional.
         */
        url?: string;
    }

    /**
     * Defines the location the browserAction will appear by default.  The default location is navbar.
     */
    export type WebExtensionManifestBrowserActionDefaultAreaEnum = "navbar" | "menupanel" | "tabstrip" | "personaltoolbar";

    export interface WebExtensionManifestBrowserActionType {

        /**
         * Optional.
         */
        default_title?: string;

        /**
         * Optional.
         */
        default_icon?: IconPath;

        /**
         * Specifies icons to use for dark and light themes
         * Optional.
         */
        theme_icons?: ThemeIcons[];

        /**
         * Optional.
         */
        default_popup?: string;

        /**
         * Optional.
         */
        browser_style?: boolean;

        /**
         * Defines the location the browserAction will appear by default.  The default location is navbar.
         * Optional.
         */
        default_area?: WebExtensionManifestBrowserActionDefaultAreaEnum;
    }

    export interface WebExtensionManifestChromeSettingsOverridesSearchProviderParamsItemType {

        /**
         * A url parameter name
         */
        name: string;

        /**
         * The type of param can be either "purpose" or "pref".
         * Optional.
         */
        condition?: "purpose" | "pref";

        /**
         * The preference to retreive the value from.
         * Optional.
         */
        pref?: string;

        /**
         * The context that initiates a search, required if condition is "purpose".
         * Optional.
         */
        purpose?: "contextmenu" | "searchbar" | "homepage" | "keyword" | "newtab";

        /**
         * A url parameter value.
         * Optional.
         */
        value?: string;
    }

    export interface WebExtensionManifestChromeSettingsOverridesSearchProviderType {
        name: string;

        /**
         * Optional.
         */
        keyword?: string;

        search_url: string;

        /**
         * Optional.
         */
        favicon_url?: string;

        /**
         * Optional.
         */
        suggest_url?: string;

        /**
         * POST parameters to the search_url as a query string.
         * Optional.
         */
        search_url_post_params?: string;

        /**
         * POST parameters to the suggest_url as a query string.
         * Optional.
         */
        suggest_url_post_params?: string;

        /**
         * Encoding of the search term.
         * Optional.
         */
        encoding?: string;

        /**
         * Sets the default engine to a built-in engine only.
         * Optional.
         */
        is_default?: boolean;

        /**
         * A list of optional search url parameters. This allows the additon of search url parameters based on how the search is performed in Firefox.
         * Optional.
         */
        params?: WebExtensionManifestChromeSettingsOverridesSearchProviderParamsItemType[];
    }

    export interface WebExtensionManifestChromeSettingsOverridesType {

        /**
         * Optional.
         */
        homepage?: string;

        /**
         * Optional.
         */
        search_provider?: WebExtensionManifestChromeSettingsOverridesSearchProviderType;
    }

    export interface WebExtensionManifestCommandsSuggestedKeyType {

        /**
         * Optional.
         */
        default?: KeyName;

        /**
         * Optional.
         */
        mac?: KeyName;

        /**
         * Optional.
         */
        linux?: KeyName;

        /**
         * Optional.
         */
        windows?: KeyName;

        /**
         * Optional.
         */
        chromeos?: string;

        /**
         * Optional.
         */
        android?: string;

        /**
         * Optional.
         */
        ios?: string;
    }

    export interface WebExtensionManifestCommandsType {

        /**
         * Optional.
         */
        suggested_key?: WebExtensionManifestCommandsSuggestedKeyType;

        /**
         * Optional.
         */
        description?: string;
    }

    export interface WebExtensionManifestExperimentApisType extends Experiments.ExperimentAPI {
    }

    export interface WebExtensionManifestOmniboxType {
        keyword: string;
    }

    export interface WebExtensionManifestPageActionType {

        /**
         * Optional.
         */
        default_title?: string;

        /**
         * Optional.
         */
        default_icon?: IconPath;

        /**
         * Optional.
         */
        default_popup?: string;

        /**
         * Optional.
         */
        browser_style?: boolean;

        /**
         * Optional.
         */
        show_matches?: MatchPattern[];

        /**
         * Optional.
         */
        hide_matches?: MatchPatternRestricted[];

        /**
         * Optional.
         */
        pinned?: boolean;
    }

    export interface WebExtensionManifestSidebarActionType {

        /**
         * Optional.
         */
        default_title?: string;

        /**
         * Optional.
         */
        default_icon?: IconPath;

        /**
         * Optional.
         */
        browser_style?: boolean;

        default_panel: string;

        /**
         * Whether or not the sidebar is opened at install. Default is <code>true</code>.
         * Optional.
         */
        open_at_install?: boolean;
    }

    export interface WebExtensionManifestChromeUrlOverridesType {

        /**
         * Optional.
         */
        newtab?: ExtensionURL;
    }

    export interface WebExtensionManifestUserScriptsType {

        /**
         * Optional.
         */
        api_script?: Manifest.ExtensionURL;
    }

    export interface WebExtensionLangpackManifestLanguagesPatternType {
        chrome_resources: {[s:string]:ExtensionURL | {[s:string]:ExtensionURL}};

        version: string;
    }

    export interface WebExtensionLangpackManifestSourcesPatternType {
        base_path: ExtensionURL;

        /**
         * Optional.
         */
        paths?: string[];
    }

    export interface ThemeExperimentImagesType {
    }

    export interface ThemeExperimentColorsType {
    }

    export interface ThemeExperimentPropertiesType {
    }

    export interface ThemeTypeImagesType {

        /**
         * Optional.
         */
        additional_backgrounds?: ImageDataOrExtensionURL[];

        /**
         * Optional.
         */
        theme_frame?: ImageDataOrExtensionURL;
    }

    export interface ThemeTypeColorsType {

        /**
         * Optional.
         */
        tab_selected?: ThemeColor;

        /**
         * Optional.
         */
        frame?: ThemeColor;

        /**
         * Optional.
         */
        frame_inactive?: ThemeColor;

        /**
         * Optional.
         */
        tab_background_text?: ThemeColor;

        /**
         * Optional.
         */
        tab_background_separator?: ThemeColor;

        /**
         * Optional.
         */
        tab_loading?: ThemeColor;

        /**
         * Optional.
         */
        tab_text?: ThemeColor;

        /**
         * Optional.
         */
        tab_line?: ThemeColor;

        /**
         * Optional.
         */
        toolbar?: ThemeColor;

        /**
         * Optional.
         */
        bookmark_text?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_text?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_border?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_separator?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_top_separator?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_bottom_separator?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_vertical_separator?: ThemeColor;

        /**
         * Optional.
         */
        icons?: ThemeColor;

        /**
         * Optional.
         */
        icons_attention?: ThemeColor;

        /**
         * Optional.
         */
        button_background_hover?: ThemeColor;

        /**
         * Optional.
         */
        button_background_active?: ThemeColor;

        /**
         * Optional.
         */
        popup?: ThemeColor;

        /**
         * Optional.
         */
        popup_text?: ThemeColor;

        /**
         * Optional.
         */
        popup_border?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_focus?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_text_focus?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_border_focus?: ThemeColor;

        /**
         * Optional.
         */
        popup_highlight?: ThemeColor;

        /**
         * Optional.
         */
        popup_highlight_text?: ThemeColor;

        /**
         * Optional.
         */
        ntp_background?: ThemeColor;

        /**
         * Optional.
         */
        ntp_text?: ThemeColor;

        /**
         * Optional.
         */
        sidebar?: ThemeColor;

        /**
         * Optional.
         */
        sidebar_border?: ThemeColor;

        /**
         * Optional.
         */
        sidebar_text?: ThemeColor;

        /**
         * Optional.
         */
        sidebar_highlight?: ThemeColor;

        /**
         * Optional.
         */
        sidebar_highlight_text?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_highlight?: ThemeColor;

        /**
         * Optional.
         */
        toolbar_field_highlight_text?: ThemeColor;
    }

    export interface ThemeTypeIconsType {

        /**
         * Optional.
         */
        back?: ExtensionURL;

        /**
         * Optional.
         */
        forward?: ExtensionURL;

        /**
         * Optional.
         */
        reload?: ExtensionURL;

        /**
         * Optional.
         */
        stop?: ExtensionURL;

        /**
         * Optional.
         */
        bookmark_star?: ExtensionURL;

        /**
         * Optional.
         */
        bookmark_menu?: ExtensionURL;

        /**
         * Optional.
         */
        downloads?: ExtensionURL;

        /**
         * Optional.
         */
        home?: ExtensionURL;

        /**
         * Optional.
         */
        app_menu?: ExtensionURL;

        /**
         * Optional.
         */
        cut?: ExtensionURL;

        /**
         * Optional.
         */
        copy?: ExtensionURL;

        /**
         * Optional.
         */
        paste?: ExtensionURL;

        /**
         * Optional.
         */
        new_window?: ExtensionURL;

        /**
         * Optional.
         */
        new_private_window?: ExtensionURL;

        /**
         * Optional.
         */
        save_page?: ExtensionURL;

        /**
         * Optional.
         */
        print?: ExtensionURL;

        /**
         * Optional.
         */
        history?: ExtensionURL;

        /**
         * Optional.
         */
        full_screen?: ExtensionURL;

        /**
         * Optional.
         */
        find?: ExtensionURL;

        /**
         * Optional.
         */
        options?: ExtensionURL;

        /**
         * Optional.
         */
        addons?: ExtensionURL;

        /**
         * Optional.
         */
        developer?: ExtensionURL;

        /**
         * Optional.
         */
        synced_tabs?: ExtensionURL;

        /**
         * Optional.
         */
        open_file?: ExtensionURL;

        /**
         * Optional.
         */
        sidebars?: ExtensionURL;

        /**
         * Optional.
         */
        subscribe?: ExtensionURL;

        /**
         * Optional.
         */
        text_encoding?: ExtensionURL;

        /**
         * Optional.
         */
        email_link?: ExtensionURL;

        /**
         * Optional.
         */
        forget?: ExtensionURL;

        /**
         * Optional.
         */
        pocket?: ExtensionURL;

        /**
         * Optional.
         */
        getmsg?: ExtensionURL;

        /**
         * Optional.
         */
        newmsg?: ExtensionURL;

        /**
         * Optional.
         */
        address?: ExtensionURL;

        /**
         * Optional.
         */
        reply?: ExtensionURL;

        /**
         * Optional.
         */
        replyall?: ExtensionURL;

        /**
         * Optional.
         */
        replylist?: ExtensionURL;

        /**
         * Optional.
         */
        forwarding?: ExtensionURL;

        /**
         * Optional.
         */
        delete?: ExtensionURL;

        /**
         * Optional.
         */
        junk?: ExtensionURL;

        /**
         * Optional.
         */
        file?: ExtensionURL;

        /**
         * Optional.
         */
        nextUnread?: ExtensionURL;

        /**
         * Optional.
         */
        prevUnread?: ExtensionURL;

        /**
         * Optional.
         */
        mark?: ExtensionURL;

        /**
         * Optional.
         */
        tag?: ExtensionURL;

        /**
         * Optional.
         */
        compact?: ExtensionURL;

        /**
         * Optional.
         */
        archive?: ExtensionURL;

        /**
         * Optional.
         */
        chat?: ExtensionURL;

        /**
         * Optional.
         */
        nextMsg?: ExtensionURL;

        /**
         * Optional.
         */
        prevMsg?: ExtensionURL;

        /**
         * Optional.
         */
        QFB?: ExtensionURL;

        /**
         * Optional.
         */
        conversation?: ExtensionURL;

        /**
         * Optional.
         */
        newcard?: ExtensionURL;

        /**
         * Optional.
         */
        newlist?: ExtensionURL;

        /**
         * Optional.
         */
        editcard?: ExtensionURL;

        /**
         * Optional.
         */
        newim?: ExtensionURL;

        /**
         * Optional.
         */
        send?: ExtensionURL;

        /**
         * Optional.
         */
        spelling?: ExtensionURL;

        /**
         * Optional.
         */
        attach?: ExtensionURL;

        /**
         * Optional.
         */
        security?: ExtensionURL;

        /**
         * Optional.
         */
        save?: ExtensionURL;

        /**
         * Optional.
         */
        quote?: ExtensionURL;

        /**
         * Optional.
         */
        buddy?: ExtensionURL;

        /**
         * Optional.
         */
        join_chat?: ExtensionURL;

        /**
         * Optional.
         */
        chat_accounts?: ExtensionURL;

        /**
         * Optional.
         */
        calendar?: ExtensionURL;

        /**
         * Optional.
         */
        tasks?: ExtensionURL;

        /**
         * Optional.
         */
        synchronize?: ExtensionURL;

        /**
         * Optional.
         */
        newevent?: ExtensionURL;

        /**
         * Optional.
         */
        newtask?: ExtensionURL;

        /**
         * Optional.
         */
        editevent?: ExtensionURL;

        /**
         * Optional.
         */
        today?: ExtensionURL;

        /**
         * Optional.
         */
        category?: ExtensionURL;

        /**
         * Optional.
         */
        complete?: ExtensionURL;

        /**
         * Optional.
         */
        priority?: ExtensionURL;

        /**
         * Optional.
         */
        saveandclose?: ExtensionURL;

        /**
         * Optional.
         */
        attendees?: ExtensionURL;

        /**
         * Optional.
         */
        privacy?: ExtensionURL;

        /**
         * Optional.
         */
        status?: ExtensionURL;

        /**
         * Optional.
         */
        freebusy?: ExtensionURL;

        /**
         * Optional.
         */
        timezones?: ExtensionURL;
    }

    export type ThemeTypePropertiesAdditionalBackgroundsAlignmentItemEnum = "bottom" | "center" | "left" | "right" | "top" | "center bottom" | "center center" | "center top" | "left bottom" | "left center" | "left top" | "right bottom" | "right center" | "right top";

    export type ThemeTypePropertiesAdditionalBackgroundsTilingItemEnum = "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

    export interface ThemeTypePropertiesType {

        /**
         * Optional.
         */
        additional_backgrounds_alignment?: ThemeTypePropertiesAdditionalBackgroundsAlignmentItemEnum[];

        /**
         * Optional.
         */
        additional_backgrounds_tiling?: ThemeTypePropertiesAdditionalBackgroundsTilingItemEnum[];
    }

    export interface Static {
    }
}
