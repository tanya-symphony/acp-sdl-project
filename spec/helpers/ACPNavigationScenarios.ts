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
    await initiator.waitForVisible(acpElements.distributionListsMenu);
    await initiator.click(acpElements.distributionListsMenu);
}

/**
 * Go to Create Account page
 */
export async function goToCreateAnAccountPage(initiator: DesktopClient) {
    await initiator.waitForVisible(acpElements.createUserMenu);
    await initiator.click(acpElements.createUserMenu);
}

/**
 * Go to Browse Account page
 */
export async function goToBrowseAccountsPage(initiator: DesktopClient) {
    await initiator.waitForVisible(acpElements.browseAccountsMenu);
    await initiator.click(acpElements.browseAccountsMenu);
}

/**
 * Go to DL page
 */
export async function logOut(initiator: DesktopClient) {
    await initiator.waitForVisible(acpElements.accountNameLabel);
    await initiator.moveMouseTo(acpElements.accountNameLabel);
    await initiator.waitForVisible(acpElements.logOutLink);
    await initiator.click(acpElements.logOutLink);
    await initiator.waitForVisible(acpElements.signInButton);
}

/**
 * Login
 */
export async function loginACP(initiator: DesktopClient, emailUser: string, password: string) {
    await initiator.waitForVisible(acpElements.signInButton);
    await initiator.waitForVisible(acpElements.emailSignInInput);
    await initiator.setValue(acpElements.emailSignInInput, emailUser);
    await initiator.waitForVisible(acpElements.passwordSignInInput);
    await initiator.setValue(acpElements.passwordSignInInput, password);
    await initiator.waitForVisible(acpElements.signInButton);
    await initiator.click(acpElements.signInButton);

}
