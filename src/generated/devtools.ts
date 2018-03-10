/**
 * Namespace: browser.devtools
 * Generated from Mozilla sources
 *
 * Permissions: "manifest:devtools_page"
 */
import { DevtoolsInspectedWindow } from "./devtools_inspectedWindow";
import { DevtoolsNetwork } from "./devtools_network";
import { DevtoolsPanels } from "./devtools_panels";

export namespace Devtools {
    export interface Static {
        inspectedWindow: DevtoolsInspectedWindow.Static;
        network: DevtoolsNetwork.Static;
        panels: DevtoolsPanels.Static;
    }
}
