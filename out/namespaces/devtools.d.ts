//////////////////////////////////////////////////////
// BEWARE: DO NOT EDIT MANUALLY! Changes will be lost!
//////////////////////////////////////////////////////

import { DevtoolsInspectedWindow } from "./devtools_inspectedWindow";
import { DevtoolsNetwork } from "./devtools_network";
import { DevtoolsPanels } from "./devtools_panels";

/**
 * Namespace: browser.devtools
 */
export namespace Devtools {
    interface Static {
        inspectedWindow: DevtoolsInspectedWindow.Static;
        network: DevtoolsNetwork.Static;
        panels: DevtoolsPanels.Static;
    }
}
