/**
 * Namespace: browser.declarativeNetRequest
 * Generated from Mozilla sources. Do not manually edit!
 *
 * Use the declarativeNetRequest API to block or modify network requests by specifying declarative rules.
 * Permissions: "declarativeNetRequest", "declarativeNetRequestWithHostAccess"
 *
 * Comments found in source JSON schema files:
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export namespace DeclarativeNetRequest {
    /**
     * How the requested resource will be used. Comparable to the webRequest.ResourceType type.
     */
    type ResourceType =
        | "main_frame"
        | "sub_frame"
        | "stylesheet"
        | "script"
        | "image"
        | "object"
        | "object_subrequest"
        | "xmlhttprequest"
        | "xslt"
        | "ping"
        | "beacon"
        | "xml_dtd"
        | "font"
        | "media"
        | "websocket"
        | "csp_report"
        | "imageset"
        | "web_manifest"
        | "speculative"
        | "other";

    interface MatchedRule {
        /**
         * A matching rule's ID.
         */
        ruleId: number;

        /**
         * ID of the Ruleset this rule belongs to.
         */
        rulesetId: string;
    }

    interface Rule {
        /**
         * An id which uniquely identifies a rule. Mandatory and should be >= 1.
         */
        id: number;

        /**
         * Rule priority. Defaults to 1. When specified, should be >= 1
         * Optional.
         */
        priority?: number;

        /**
         * The condition under which this rule is triggered.
         */
        condition: RuleConditionType;

        /**
         * The action to take if this rule is matched.
         */
        action: RuleActionType;
    }

    interface UpdateSessionRulesOptionsType {
        /**
         * IDs of the rules to remove. Any invalid IDs will be ignored.
         * Optional.
         */
        removeRuleIds?: number[];

        /**
         * Rules to add.
         * Optional.
         */
        addRules?: Rule[];
    }

    /**
     * The details of the request to test.
     */
    interface TestMatchOutcomeRequestType {
        /**
         * The URL of the hypothetical request.
         */
        url: string;

        /**
         * The initiator URL (if any) for the hypothetical request.
         * Optional.
         */
        initiator?: string;

        /**
         * Standard HTTP method of the hypothetical request.
         * Optional.
         */
        method?: string;

        /**
         * The resource type of the hypothetical request.
         */
        type: ResourceType;

        /**
         * The ID of the tab in which the hypothetical request takes place. Does not need to correspond to a real tab ID.
         * Default is -1, meaning that the request isn't related to a tab.
         * Optional.
         */
        tabId?: number;
    }

    interface TestMatchOutcomeCallbackResultType {
        /**
         * The rules (if any) that match the hypothetical request.
         */
        matchedRules: MatchedRule[];
    }

    /**
     * Specifies whether the network request is first-party or third-party to the domain from which it originated. If omitted,
     * all requests are matched.
     */
    type RuleConditionDomainTypeEnum = "firstParty" | "thirdParty";

    /**
     * The condition under which this rule is triggered.
     */
    interface RuleConditionType {
        /**
         * TODO: link to doc explaining supported pattern. The pattern which is matched against the network request url.
         * Only one of 'urlFilter' or 'regexFilter' can be specified.
         * Optional.
         */
        urlFilter?: string;

        /**
         * Regular expression to match against the network request url. Only one of 'urlFilter' or 'regexFilter' can be specified.
         * Optional.
         */
        regexFilter?: string;

        /**
         * Whether 'urlFilter' or 'regexFilter' is case-sensitive. Defaults to true.
         * Optional.
         */
        isUrlFilterCaseSensitive?: boolean;

        /**
         * The rule will only match network requests originating from the list of 'initiatorDomains'. If the list is omitted,
         * the rule is applied to requests from all domains.
         * Optional.
         */
        initiatorDomains?: string[];

        /**
         * The rule will not match network requests originating from the list of 'initiatorDomains'.
         * If the list is empty or omitted, no domains are excluded. This takes precedence over 'initiatorDomains'.
         * Optional.
         */
        excludedInitiatorDomains?: string[];

        /**
         * The rule will only match network requests when the domain matches one from the list of 'requestDomains'.
         * If the list is omitted, the rule is applied to requests from all domains.
         * Optional.
         */
        requestDomains?: string[];

        /**
         * The rule will not match network requests when the domains matches one from the list of 'excludedRequestDomains'.
         * If the list is empty or omitted, no domains are excluded. This takes precedence over 'requestDomains'.
         * Optional.
         */
        excludedRequestDomains?: string[];

        /**
         * List of resource types which the rule can match. When the rule action is 'allowAllRequests',
         * this must be specified and may only contain 'main_frame' or 'sub_frame'. Cannot be specified if 'excludedResourceTypes'
         * is specified. If neither of them is specified, all resource types except 'main_frame' are matched.
         * Optional.
         */
        resourceTypes?: ResourceType[];

        /**
         * List of resource types which the rule won't match. Cannot be specified if 'resourceTypes' is specified.
         * If neither of them is specified, all resource types except 'main_frame' are matched.
         * Optional.
         */
        excludedResourceTypes?: ResourceType[];

        /**
         * List of HTTP request methods which the rule can match. Should be a lower-case method such as 'connect', 'delete', 'get',
         * 'head', 'options', 'patch', 'post', 'put'.'
         * Optional.
         */
        requestMethods?: string[];

        /**
         * List of request methods which the rule won't match. Cannot be specified if 'requestMethods' is specified.
         * If neither of them is specified, all request methods are matched.
         * Optional.
         */
        excludedRequestMethods?: string[];

        /**
         * Specifies whether the network request is first-party or third-party to the domain from which it originated. If omitted,
         * all requests are matched.
         * Optional.
         */
        domainType?: RuleConditionDomainTypeEnum;

        /**
         * List of tabIds which the rule should match. An ID of -1 matches requests which don't originate from a tab.
         * Only supported for session-scoped rules.
         * Optional.
         */
        tabIds?: number[];

        /**
         * List of tabIds which the rule should not match. An ID of -1 excludes requests which don't originate from a tab.
         * Only supported for session-scoped rules.
         * Optional.
         */
        excludedTabIds?: number[];
    }

    type RuleActionTypeEnum = "block" | "redirect" | "allow" | "upgradeScheme" | "modifyHeaders" | "allowAllRequests";

    /**
     * TODO: URLTransform - Url transformations to perform.
     */
    interface RuleActionRedirectTransformType {
        [s: string]: unknown;
    }

    /**
     * Describes how the redirect should be performed. Only valid when type is 'redirect'.
     */
    interface RuleActionRedirectType {
        /**
         * Path relative to the extension directory. Should start with '/'.
         * Optional.
         */
        extensionPath?: string;

        /**
         * TODO: URLTransform - Url transformations to perform.
         * Optional.
         */
        transform?: RuleActionRedirectTransformType;

        /**
         * The redirect url. Redirects to JavaScript urls are not allowed.
         * Optional.
         */
        url?: string;

        /**
         * TODO with regexFilter + Substitution pattern for rules which specify a 'regexFilter'.
         * Optional.
         */
        regexSubstitution?: string;
    }

    /**
     * The operation to be performed on a header. The 'append' operation is not supported for request headers.
     */
    type RuleActionRequestHeadersOperationEnum = "set" | "remove";

    /**
     * The request headers to modify for the request. Only valid when type is 'modifyHeaders'.
     */
    interface RuleActionRequestHeadersType {
        /**
         * The name of the request header to be modified.
         */
        header: string;

        /**
         * The operation to be performed on a header. The 'append' operation is not supported for request headers.
         */
        operation: RuleActionRequestHeadersOperationEnum;

        /**
         * The new value for the header. Must be specified for the 'set' operation.
         * Optional.
         */
        value?: string;
    }

    /**
     * The operation to be performed on a header.
     */
    type RuleActionResponseHeadersOperationEnum = "append" | "set" | "remove";

    /**
     * The response headers to modify for the request. Only valid when type is 'modifyHeaders'.
     */
    interface RuleActionResponseHeadersType {
        /**
         * The name of the response header to be modified.
         */
        header: string;

        /**
         * The operation to be performed on a header.
         */
        operation: RuleActionResponseHeadersOperationEnum;

        /**
         * The new value for the header. Must be specified for the 'append' and 'set' operations.
         * Optional.
         */
        value?: string;
    }

    /**
     * The action to take if this rule is matched.
     */
    interface RuleActionType {
        type: RuleActionTypeEnum;

        /**
         * Describes how the redirect should be performed. Only valid when type is 'redirect'.
         * Optional.
         */
        redirect?: RuleActionRedirectType;

        /**
         * The request headers to modify for the request. Only valid when type is 'modifyHeaders'.
         * Optional.
         */
        requestHeaders?: RuleActionRequestHeadersType;

        /**
         * The response headers to modify for the request. Only valid when type is 'modifyHeaders'.
         * Optional.
         */
        responseHeaders?: RuleActionResponseHeadersType;
    }

    interface Static {
        /**
         * Modifies the current set of session scoped rules for the extension. The rules with IDs listed in options.
         * removeRuleIds are first removed, and then the rules given in options.addRules are added.
         * These rules are not persisted across sessions and are backed in memory.
         *
         * @param options
         * @returns Called when the session rules have been updated
         */
        updateSessionRules(options: UpdateSessionRulesOptionsType): Promise<void>;

        /**
         * Returns the current set of session scoped rules for the extension.
         */
        getSessionRules(): Promise<Rule[]>;

        /**
         * Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request.
         *
         * @param request The details of the request to test.
         * @returns Called with the details of matched rules.
         */
        testMatchOutcome(request: TestMatchOutcomeRequestType): Promise<TestMatchOutcomeCallbackResultType>;
    }
}
