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

export async function finishAccountCreation(initiator: DesktopClient) {
    await initiator.waitForVisible(caElements.createAccountButton);
    await initiator.click(caElements.createAccountButton);
    await initiator.waitForVisible(caElements.userCreatedMessageLabel);
}
