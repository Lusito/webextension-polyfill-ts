/**
 * Namespace: browser.pkcs11
 * Generated from Mozilla sources
 *
 * PKCS#11 module management API
 * Permissions: "pkcs11"
 */
export namespace Pkcs11 {
    export interface Static {

        /**
         * checks whether a PKCS#11 module, given by name, is installed
         *
         * @param name
         */
        isModuleInstalled(name: string): void;

        /**
         * Install a PKCS#11 module with a given name
         *
         * @param name
         * @param flags Optional.
         */
        installModule(name: string, flags?: number): void;

        /**
         * Remove an installed PKCS#11 module from firefox
         *
         * @param name
         */
        uninstallModule(name: string): void;

        /**
         * Enumerate a module's slots, each with their name and whether a token is present
         *
         * @param name
         */
        getModuleSlots(name: string): void;
    }
}
