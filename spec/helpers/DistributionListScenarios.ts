export * from "../helpers/DistributionListScenarios";
import { DesktopClient } from "@symphony/rtc-greenkeeper-lib";

/**
 * Create SDL with name, 4 attributes and user
 */
// export async function createSDL(streamId: string, initiator: DesktopClient, ...participants: DesktopClient[]) {}

/**
 * Check DL page
 */
export async function checkDLPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText("//*[@data-test-id='L5kazWLrVk']", "Distribution Lists");
    await initiator.waitForVisible(".create-new-list-btn");
    await initiator.waitForVisible("//*[@data-test-id='p6kl7M869p']/a[.='Audit Trail']");
}

/**
 * Open Modal for DL creation
 */
export async function openModalForDLCreation(initiator: DesktopClient) {
    await initiator.click(".create-new-list-btn");
    await initiator.waitForVisible(".distribution-lists-modal");
    await initiator.waitForVisible("//input[contains(@class, 'list-name-input')]");
    await initiator.waitForVisible("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
}
