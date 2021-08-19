export * from "../helpers/ACPNavigationScenarios";
import { DesktopClient } from "@symphony/rtc-greenkeeper-lib";
import * as acpElements from "../pageObjects/acp/basic/IAdminConsoleBasicPage";

/**
 * Open ACP portal page
 */
export async function openACPfromClient1_5(initiator: DesktopClient) {
    await initiator.click("#toolbar-settings");
    await initiator.waitForVisible("#generalSettingsTrigger");
    await initiator.click("#generalSettingsTrigger");
    await initiator.waitForVisible(".show-admin-link");
    await initiator.click(".show-admin-link");
}

/**
 * Admin session start
 */
export async function adminSessionStart(initiator: DesktopClient) {
    await initiator.waitForVisible(acpElements.authModal);
    await initiator.waitForVisible(acpElements.beginSessionButton);
    await initiator.click(acpElements.beginSessionButton);
    await initiator.waitForVisible(acpElements.leftNavPanel);
}

/**
 * Go to DL page
 */
export async function goToDLPage(initiator: DesktopClient) {
    await initiator.waitForVisible(".distributionLists");
    await initiator.click(".distributionLists");
}
