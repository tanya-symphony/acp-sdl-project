export * from "../helpers/AccountScenarios";
import { DesktopClient, TestUser } from "@symphony/rtc-greenkeeper-lib";
import * as caElements from "../pageObjects/acp/create_account/ICreateAccountPage";
/**
 * Check CA page
 */
export async function checkCAPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText(caElements.headerCAPage, "Create an Account");
    await initiator.waitForVisible(caElements.createAccountButton);
}

export async function fillBaseInfoForAccountCreation(initiator: DesktopClient, user: TestUser) {
    await initiator.waitForVisible(caElements.usernameInput);
    await initiator.setValue(caElements.usernameInput, user.username);
    await initiator.waitForVisible(caElements.firstNameInput);
    await initiator.setValue(caElements.firstNameInput, user.username);
    await initiator.waitForVisible(caElements.surnameInput);
    await initiator.setValue(caElements.surnameInput, user.username);
    await initiator.waitForVisible(caElements.prettyNameInput);
    await initiator.setValue(caElements.prettyNameInput, user.displayname);
    await initiator.waitForVisible(caElements.emailAddressInput);
    await initiator.setValue(caElements.emailAddressInput, user.emailAddress);
}
