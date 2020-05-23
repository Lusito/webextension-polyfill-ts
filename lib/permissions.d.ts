/**
 * Namespace: browser.permissions
 * Generated from Mozilla sources. Do not manually edit!
 *
 * Permissions: "manifest:optional_permissions"
 */
import { Manifest } from "./manifest";
import { Events } from "./events";

export declare namespace Permissions {
    interface Permissions {

        /**
         * Optional.
         */
        permissions?: Manifest.OptionalPermission[];

        /**
         * Optional.
         */
        origins?: Manifest.MatchPattern[];
    }

    interface AnyPermissions {

        /**
         * Optional.
         */
        permissions?: Manifest.Permission[];

        /**
         * Optional.
         */
        origins?: Manifest.MatchPattern[];
    }

    interface Static {

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

        /**
         * Fired when the extension acquires new permissions.
         *
         * @param permissions
         */
        onAdded: Events.Event<(permissions: Permissions) => void>;

        /**
         * Fired when permissions are removed from the extension.
         *
         * @param permissions
         */
        onRemoved: Events.Event<(permissions: Permissions) => void>;
    }
}
