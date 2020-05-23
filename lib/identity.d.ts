/**
 * Namespace: browser.identity
 * Generated from Mozilla sources. Do not manually edit!
 *
 * Use the chrome.identity API to get OAuth2 access tokens. 
 * Permissions: "identity"
 */
import { Manifest } from "./manifest";

export declare namespace Identity {

    /**
     * An object encapsulating an OAuth account id.
     */
    interface AccountInfo {

        /**
         * A unique identifier for the account. This ID will not change for the lifetime of the account. 
         */
        id: string;
    }

    interface GetAuthTokenDetailsType {

        /**
         * Optional.
         */
        interactive?: boolean;

        /**
         * Optional.
         */
        account?: AccountInfo;

        /**
         * Optional.
         */
        scopes?: string[];
    }

    interface GetProfileUserInfoCallbackUserinfoType {
        email: string;

        id: string;
    }

    interface RemoveCachedAuthTokenDetailsType {
        token: string;
    }

    interface RemoveCachedAuthTokenCallbackUserinfoType {
        email: string;

        id: string;
    }

    interface LaunchWebAuthFlowDetailsType {
        url: Manifest.HttpURL;

        /**
         * Optional.
         */
        interactive?: boolean;
    }

    interface Static {

        /**
         * Starts an auth flow at the specified URL.
         *
         * @param details
         * @returns Promise<string>
         */
        launchWebAuthFlow(details: LaunchWebAuthFlowDetailsType): Promise<string>;

        /**
         * Generates a redirect URL to be used in |launchWebAuthFlow|.
         *
         * @param path Optional. The path appended to the end of the generated URL. 
         * @returns string
         */
        getRedirectURL(path?: string): string;
    }
}
