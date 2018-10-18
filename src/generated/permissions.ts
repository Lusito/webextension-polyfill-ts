/**
 * Namespace: browser.permissions
 * Generated from Mozilla sources
 *
 * Permissions: "manifest:optional_permissions"
 */
import { Manifest } from "./manifest";

export namespace Permissions {
    export interface Permissions {

        /**
         * Optional.
         */
        permissions?: Manifest.OptionalPermission[];

        /**
         * Optional.
         */
        origins?: Manifest.MatchPattern[];
    }

    export interface AnyPermissions {

        /**
         * Optional.
         */
        permissions?: Manifest.Permission[];

        /**
         * Optional.
         */
        origins?: Manifest.MatchPattern[];
    }

    export interface Static {

        /**
         * Get a list of all the extension's permissions.
         *
         * @returns Promise<AnyPermissions>
         */
        getAll(): Promise<AnyPermissions>;

        /**
         * Check if the extension has the given permissions.
         *
         * @param permissions
         * @returns Promise<boolean>
         */
        contains(permissions: AnyPermissions): Promise<boolean>;

        /**
         * Request the given permissions.
         *
         * @param permissions
         * @returns Promise<boolean>
         */
        request(permissions: Permissions): Promise<boolean>;

        /**
         * Relinquish the given permissions.
         *
         * @param permissions
         * @returns Promise<void>
         */
        remove(permissions: Permissions): Promise<void>;
    }
}
