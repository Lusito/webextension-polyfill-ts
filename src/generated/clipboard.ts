/**
 * Namespace: browser.clipboard
 * Generated from Mozilla sources
 *
 * Offers the ability to write to the clipboard. Reading is not supported because the clipboard can already be read through the standard web platform APIs.
 * Permissions: "clipboardWrite"
 */
export namespace Clipboard {

    /**
     * The type of imageData.
     */
    export type SetImageDataImageTypeEnum = "jpeg" | "png";

    export interface Static {

        /**
         * Copy an image to the clipboard. The image is re-encoded before it is written to the clipboard. If the image is invalid, the clipboard is not modified.
         *
         * @param imageData The image data to be copied.
         * @param imageType The type of imageData.
         * @returns Promise<void>
         */
        setImageData(imageData: ArrayBuffer, imageType: SetImageDataImageTypeEnum): Promise<void>;
    }
}
