export * from "../helpers/InfoBarriersScenarios";
import { DesktopClient, TestUser } from "@symphony/rtc-greenkeeper-lib";
import expect from "expect";
import * as ibElements from "../pageObjects/acp/ib/IInformationBarriersPage";
/**
 * Check CA page
 */
export async function checkIBPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText(ibElements.headerGenericPage, "Information Barriers");
    await initiator.waitForVisible(ibElements.createIbPolicyButton);
}

/**
 * Go to group management
 */
export async function goToGroupManagement(initiator: DesktopClient) {
    await initiator.waitForVisible(ibElements.groupManagementTab);
    await initiator.click(ibElements.groupManagementTab);
    await initiator.waitForVisible(ibElements.groupManagementCreateButton);
}

/**
 * Create IB group
 */
export async function createGroup(initiator: DesktopClient, groupName: string) {
    await initiator.waitForVisible(ibElements.groupManagementCreateButton);
    await initiator.click(ibElements.groupManagementCreateButton);
    await initiator.waitForVisible(ibElements.createGroupIBModal);
    // TODO ...
}
