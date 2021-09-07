export * from "../helpers/InfoBarriersScenarios";
import { DesktopClient, TestUser } from "@symphony/rtc-greenkeeper-lib";
import expect from "expect";
import * as ibElements from "../pageObjects/acp/ib/IInformationBarriersPage";
/**
 * Check IB page
 */
export async function checkIBPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText(ibElements.headerGenericPage, "Information Barriers");
    await initiator.waitForVisible(ibElements.createIbPolicyButton);
}

/**
 * Navigation back
 */
export async function goBackToGroupList(initiator: DesktopClient) {
    await initiator.waitForVisible(ibElements.backArrowButton);
    await initiator.click(ibElements.backArrowButton);
    await initiator.waitForVisible(ibElements.groupManagementCreateButton);
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
 * Go to ib policies
 */
export async function goToIBPolicies(initiator: DesktopClient) {
    await initiator.waitForVisible(ibElements.ibPoliciesTab);
    await initiator.click(ibElements.ibPoliciesTab);
    await initiator.waitForVisible(ibElements.createIbPolicyButton);
}

/**
 * Create IB group
 */
export async function createGroup(initiator: DesktopClient, groupName: string) {
    await initiator.waitForVisible(ibElements.groupManagementCreateButton);
    await initiator.click(ibElements.groupManagementCreateButton);
    await initiator.waitForVisible(ibElements.createIBModal);
    await initiator.waitForVisible(ibElements.groupNameInput);
    await initiator.setValue(ibElements.groupNameInput, groupName);
    await initiator.waitForVisible(ibElements.createIBButtonModal);
    await initiator.click(ibElements.createIBButtonModal);
    await initiator.waitForVisible(ibElements.bannerIBPage + "[contains(text(),'IB Group successfully created')]");
    await initiator.waitForVisible("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + groupName + "']");
}

/**
 * Add member to group
 */
export async function addMemberToGroup(initiator: DesktopClient, groupName: string, user: TestUser) {
    await initiator.waitForVisible("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + groupName + "']");
    await initiator.click("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + groupName + "']");
    await initiator.waitForVisible(ibElements.groupMembershipSearchInput);
    await initiator.setValue(ibElements.groupMembershipSearchInput, user.username);
    await initiator.waitForVisible("//*[@role='option'][contains(@aria-label,'" + user.emailAddress + "')]");
    await initiator.click("//*[@role='option'][contains(@aria-label,'" + user.emailAddress + "')]");
    await initiator.waitForVisible("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + user.emailAddress + "']");
}

/**
 * Create IB group
 */
export async function createIBPolicy(initiator: DesktopClient, groupName01: string, groupName02: string) {
    await initiator.waitForVisible(ibElements.createIbPolicyButton);
    await initiator.click(ibElements.createIbPolicyButton);
    await initiator.waitForVisible(ibElements.createIBModal);
    await initiator.waitForVisible(ibElements.firstGroupInput);
    await initiator.waitForVisible(ibElements.secondGroupInput);
    await initiator.setValue(ibElements.firstGroupInput, groupName01);
    await initiator.waitForVisible("//*[@role='option'][contains(text(),'" + groupName01 + "')]");
    await initiator.click("//*[@role='option'][contains(text(),'" + groupName01 + "')]");
    await initiator.setValue(ibElements.secondGroupInput, groupName02);
    await initiator.waitForVisible("//*[@role='option'][contains(text(),'" + groupName02 + "')]");
    await initiator.click("//*[@role='option'][contains(text(),'" + groupName02 + "')]");
    await initiator.waitForVisible(ibElements.createIBButtonModal);
    await initiator.click(ibElements.createIBButtonModal);
    await initiator.waitForVisible(ibElements.bannerIBPage + "[contains(text(),'IB Policy successfully created.')]");
    await initiator.waitForVisible("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + groupName01 + "']");
    await initiator.waitForVisible("//*[@class=" +
        "'fixedDataTableCellLayout_main public_fixedDataTableCell_main']/*/a[.='" + groupName02 + "']");
}
