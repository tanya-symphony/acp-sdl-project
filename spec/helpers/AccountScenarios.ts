export * from "../helpers/AccountScenarios";
import { DesktopClient, TestUser } from "@symphony/rtc-greenkeeper-lib";
import expect from "expect";
import * as caElements from "../pageObjects/acp/create_account/ICreateAccountPage";
/**
 * Check CA page
 */
export async function checkCAPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText(caElements.headerCAPage, "Create an Account");
    await initiator.waitForVisible(caElements.createAccountButton);
}

/**
 * Fill base info for user creation
 * @param initiator
 * @param user - username
 */
export async function fillBaseInfoForAccountCreation(initiator: DesktopClient, user: string) {
    await initiator.waitForVisible(caElements.usernameInput);
    await initiator.setValue(caElements.usernameInput, user);
    await initiator.waitForVisible(caElements.firstNameInput);
    await initiator.setValue(caElements.firstNameInput, user);
    await initiator.waitForVisible(caElements.surnameInput);
    await initiator.setValue(caElements.surnameInput, user);
    await initiator.waitForVisible(caElements.prettyNameInput);
    await initiator.setValue(caElements.prettyNameInput, user);
    await initiator.waitForVisible(caElements.emailAddressInput);
    await initiator.setValue(caElements.emailAddressInput, user + "@test.com");
}

/**
 * Set user's password
 * @param initiator
 * @param password
 */
export async function changePasswordDuringAccountCreation(initiator: DesktopClient, password: string) {
    await initiator.waitForVisible(caElements.setManuallyPasswordRadioButton);
    await initiator.click(caElements.setManuallyPasswordRadioButton);
    await initiator.waitForVisible(caElements.passwordInput);
    await initiator.setValue(caElements.passwordInput, password);
}

/**
 * Set role method
 * @param initiator
 * @param role
 */
export async function setRoleDuringAccountCreation(initiator: DesktopClient, role: string) {
    switch (role) {
        case "DISTRIBUTION_LIST_MANAGER": {
            await initiator.waitForVisible(caElements.dlRoleLabel);
            await initiator.click(caElements.dlRoleLabel);
            // value = await initiator.getValue(caElements.dlRoleCheckbox);
            // await initiator.assert(() => expect(value).toBe("on"));
            break;
        }
    }
}

/**
 * Finish account creation
 * @param initiator
 */
export async function finishAccountCreation(initiator: DesktopClient) {
    await initiator.waitForVisible(caElements.createAccountButton);
    await initiator.click(caElements.createAccountButton);
    await initiator.waitForVisible(caElements.userCreatedMessageLabel);
}

/**
 * Check Browse accounts page
 */
export async function checkBrowseAccountsPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText(caElements.headerGenericPage, "Browse Accounts");
    await initiator.waitForVisible(caElements.filtersContainer);
}

/**
 * Check Browse accounts page
 */
export async function openAccount(initiator: DesktopClient, testUserName: string) {
    await initiator.waitForVisible(caElements.searchInput);
    await initiator.setValue(caElements.searchInput, testUserName);
    await initiator.waitForVisible("//*[@class='tt-dataset-user-search']" +
        "//*[@class='user-search-result__meta--pretty-name']/*/strong[.='" + testUserName + "']");
    await initiator.click("//*[@class='tt-dataset-user-search']" +
        "//*[@class='user-search-result__meta--pretty-name']/*/strong[.='" + testUserName + "']");
    await initiator.waitForVisible(caElements.changeStatusButton);
}

/**
 * Save changes for account update
 * @param initiator
 */
export async function finishAccountUpdate(initiator: DesktopClient) {
    await initiator.waitForVisible(caElements.updateProfileButton);
    await initiator.click(caElements.updateProfileButton);
    await initiator.waitForVisible(caElements.userUpdatedMessageLabel);
}

/**
 * Change user's password
 * @param initiator
 * @param password
 */
export async function changePasswordDuringAccountUpdate(initiator: DesktopClient, password: string) {
    await initiator.waitForVisible(caElements.resetPasswordButton);
    await initiator.moveMouseTo(caElements.resetPasswordButton);
    await initiator.waitForVisible(caElements.assignNewPasswordMenuItem);
    await initiator.click(caElements.assignNewPasswordMenuItem);
    await initiator.waitForVisible(caElements.modalContainer);
    await initiator.waitForVisible(caElements.newAssignedPasswordInput);
    await initiator.setValue(caElements.newAssignedPasswordInput, password);
    await initiator.waitForVisible(caElements.submitModalButton);
    await initiator.click(caElements.submitModalButton);
    await initiator.waitForVisible(caElements.notificationPasswordChangeLabel);
    await initiator.click(caElements.submitModalButton);
}
