import expect from "expect";

export * from "../helpers/DistributionListScenarios";
import {DesktopClient, TestUser} from "@symphony/rtc-greenkeeper-lib";
import * as dlElements from "../pageObjects/acp/dl/IDistributionListPage";

/**
 * Check DL page
 */
export async function checkDLPage(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText("//*[@data-test-id='L5kazWLrVk']", "Distribution Lists");
    await initiator.waitForVisible(dlElements.createDlButton);
    await initiator.waitForVisible("//*[@data-test-id='p6kl7M869p']/a[.='Audit Trail']");
}

/**
 * Open Modal for DL creation
 */
export async function openModalForDLCreation(initiator: DesktopClient) {
    await initiator.click(dlElements.createDlButton);
    await initiator.waitForVisible(dlElements.distributionListsModal);
    await initiator.waitForVisible("//input[contains(@class, 'list-name-input')]");
    await initiator.waitForVisible("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
}

/**
 * Check Modal of DL creation
 */
export async function checkModalForDLCreation(initiator: DesktopClient) {
    await initiator.waitForExist("//*[@name='isExternal']");
    await initiator.waitForVisible("//*[contains(@class, 'list-display-name-box')]");
    await initiator.waitForVisible("//button[contains(@class, 'add-members-button')]");
    await initiator.waitForVisible("//button[contains(@class, 'cancel-button')]");
}

/**
 * Create DL
 */
export async function fillDataStepCreateDL(initiator: DesktopClient, sdlName: string,
                                           att1: string, att2: string, att3: string, att4: string, external: boolean) {
    await initiator.setValue("//input[contains(@class, 'list-name-input')]", sdlName);
    if (external && external !== null) {
    const value = await initiator.getElementAttribute("//*[@name='isExternal']", "value");
    await initiator.assert(() => expect(value).toBe("on"));
        // tslint:disable-next-line:align
    }  if (!external && external !== null) {
        await initiator.waitForVisible("//*[./*[@name='isExternal']]");
        await initiator.click("//*[./*[@name='isExternal']]");
        // FIXME!!! Bug - await initiator.assert(() => expect(value).toBe("off"));
    }
    await initiator.click("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
    await initiator.click("//*[@class='Select-menu-outer']");
    if (att1 !== null || att1 !== undefined) {
        await initiator.waitForVisible("//*[@class='Select-menu-outer']//*[./input[@id='" + att1 + "'][@type='radio']]/label");
        await initiator.click("//*[@class='Select-menu-outer']//*[./input[@id='" + att1 + "'][@type='radio']]/label");
    }
    if (att2 !== null || att2 !== undefined) {
        await initiator.waitForVisible("//*[@class='Select-menu-outer']//*[./input[@id='" + att2 + "'][@type='radio']]/label");
        await initiator.click("//*[@class='Select-menu-outer']//*[./input[@id='" + att2 + "'][@type='radio']]/label");
    }
    if (att3 !== null || att3 !== undefined) {
        await initiator.waitForVisible("//*[@class='Select-menu-outer']//*[./input[@id='" + att3 + "'][@type='radio']]/label");
        await initiator.click("//*[@class='Select-menu-outer']//*[./input[@id='" + att3 + "'][@type='radio']]/label");
    }
    if (att4 !== null || att4 !== undefined) {
        await initiator.waitForVisible("//*[@class='Select-menu-outer']//*[./input[@id='" + att4 + "'][@type='radio']]/label");
        await initiator.click("//*[@class='Select-menu-outer']//*[./input[@id='" + att4 + "'][@type='radio']]/label");
    }
    await initiator.waitForVisible("//*[@class='toggle-menu-arrow']/*[.='Attributes']");
    await initiator.click("//*[@class='toggle-menu-arrow']/*[.='Attributes']");
}

/**
 * Check first step data DL
 */
export async function checkDataStepCreateDL(initiator: DesktopClient, sdlName: string,
                                            att1: string, att2: string, att3: string, att4: string, external: boolean) {
    await initiator.waitForVisibleWithValue("//input[contains(@class, 'list-name-input')]", sdlName);
    await initiator.waitForVisible("//*[@class='Select-value-label'][contains(@id,'-value-0')]/span[.='" + att1 + "']");
    await initiator.waitForVisible("//*[@class='Select-value-label'][contains(@id,'-value-1')]/span[.='" + att2 + "']");
    await initiator.waitForVisible("//*[@class='Select-value-label'][contains(@id,'-value-2')]/span[.='" + att3 + "']");
    await initiator.waitForVisible("//*[@class='Select-value-label'][contains(@id,'-value-3')]/span[.='" + att4 + "']");
    await initiator.waitForVisible("//*[@class='list-display-name-box']/span[contains(text(), '" +
        sdlName + "')]");
    await initiator.waitForVisible("//*[@class='list-display-name-box']" +
        "/*[@class='list-attribute-tag'][contains(text(), '" + att1 + "')]");
    await initiator.waitForVisible("//*[@class='list-display-name-box']" +
        "/*[@class='list-attribute-tag'][contains(text(), '" + att2 + "')]");
    await initiator.waitForVisible("//*[@class='list-display-name-box']" +
        "/*[@class='list-attribute-tag'][contains(text(), '" + att3 + "')]");
    await initiator.waitForVisible("//*[@class='list-display-name-box']" +
        "/*[@class='list-attribute-tag'][contains(text(), '" + att4 + "')]");
    if (external) {
    await initiator.waitForVisibleWithText("//*[@class='list-display-name-box']/*[@class='external-pod-tag']",
        "EXT"); } else {await initiator.waitForNotVisibleWithText("//*[@class='list-display-name-box']" +
        "/*[@class='external-pod-tag']", "EXT"); }
}

/**
 * Add member to SDL
 */
export async function selectMemberStepCreateDL(initiator: DesktopClient, testUser: TestUser) {
    await initiator.waitForVisible(`//*[./*/*/label[@for='user ${testUser.userId}']]/*[.='${testUser.displayname}']`);
    await initiator.waitForVisible("//label[@for='user " + testUser.userId + "']");
    await initiator.click("//label[@for='user " + testUser.userId + "']");
}

/**
 * Open Modal for DL edition
 */
export async function openModalForDLEdition(initiator: DesktopClient, sdlName: string) {
    await initiator.waitForVisible("//*[contains(@class,'list-name-box-with-tag')][.='" + sdlName + "']");
    await initiator.moveMouseTo("//*[contains(@class,'list-name-box-with-tag')][.='" + sdlName + "']");
    await initiator.waitForVisible("//button[@class='edit-list-btn'][.='Edit List']");
    await initiator.click("//button[@class='edit-list-btn'][.='Edit List']");
    await initiator.waitForVisible(dlElements.distributionListsModal);
    await initiator.waitForVisible("//input[contains(@class, 'list-name-input')]");
    await initiator.waitForVisible("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
}

/**
 * Check DL in list
 */
export async function checkDLinList(initiator: DesktopClient, sdlName: string,
                                    // tslint:disable-next-line:max-line-length
                                    att1: string, att2: string, att3: string, att4: string, external: boolean, membersCount: number) {
    await initiator.waitForNotVisible(".distribution-lists-modal");
    await initiator.waitForVisible("//*[contains(@class,'list-name-box-with-tag')][.='" + sdlName + "']");
    if (att1 !== null && att1 !== undefined) {
        // tslint:disable-next-line:max-line-length
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='list-attribute-tag'][.='" + att1 + "']"); }
    if (att2 !== null && att2 !== undefined) {
        // tslint:disable-next-line:max-line-length
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='list-attribute-tag'][.='" + att2 + "']"); }
    if (att3 !== null && att3 !== undefined) {
        // tslint:disable-next-line:max-line-length
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='list-attribute-tag'][.='" + att3 + "']"); }
    if (att4 !== null && att4 !== undefined) {
        // tslint:disable-next-line:max-line-length
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='list-attribute-tag'][.='" + att4 + "']"); }
    // tslint:disable-next-line:max-line-length
    if (external) {
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='external-pod-tag']"); }
    // tslint:disable-next-line:max-line-length
    await initiator.waitForVisible("//div[@role='row'][./*[.='" + sdlName + "']]//*[@class='list-text-cell']/span[.='" + membersCount + "']");
}

/**
 * Delete DL
 */
export async function deleteDL(initiator: DesktopClient) {
    await initiator.waitForVisibleWithText("//label[@for='want-to-delete']", "I want to delete this list");
    await initiator.click("//label[@for='want-to-delete']");
    await initiator.waitForVisibleWithText("//label[@for='acknowledge-delete']", "I acknowledge that this action cannot be undone");
    await initiator.click("//label[@for='acknowledge-delete']");
    await initiator.waitForVisible(".delete-list-button");
    await initiator.click(".delete-list-button");
}
