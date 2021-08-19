import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import expect from "expect";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;
    let testUser01: TestUser;
    let testUser02: TestUser;
    let testUser03: TestUser;
    let testUser04: TestUser;
    let pmpHelper: PmpUser;
    let value: string;
    const att1: string = "Confirmation";
    const att2: string  = "Fixed Income";
    const att3: string  = "EMEA";
    const att4: string  = "Escalation";
    // Update
    const att1Update: string = "Margin";
    const att2Update: string  = "Equities";
    const att3Update: string  = "NA";
    const att4Update: string  = "BAU";
    const sdlName: string = "SDL AUTO INT" + Date.now().toString() + Math.random().toString().slice(2);
    const sdlNameUpdate: string = "UPDATED SDL AUTO INT" + Date.now().toString() + Math.random().toString().slice(2);
    const externalType: boolean = false;
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    const userEntitlements = {
        isExternalRoomEnabled: true };

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        [testUser01, testUser02, testUser03] = await testClientHelper.setupTestUsers(["A", "B", "C"],
            { entitlements: userEntitlements } );
        [testUser04] = await testClientHelper.setupTestUsers(["NoEntitlementsCanChat"]);
        [testClientA] = await testClientHelper.setupDesktopClients(["Tania"],
            {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
    });

    it("should be able create internal DL with role DL Manager", async () => {
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL creation
        await DistributionListScenarios.openModalForDLCreation(testClientA);
        // External / Internal
        await DistributionListScenarios.checkModalForDLCreation(testClientA);
        // Check errors
        await testClientA.click("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must provide a non-empty name");
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must select at least one attribute");
        // Enter data
        await DistributionListScenarios.fillDataStepCreateDL(testClientA, sdlName, att1, att2, att3, att4,
            externalType);
        // Checks
        await DistributionListScenarios.checkDataStepCreateDL(testClientA, sdlName, att1, att2, att3, att4,
            externalType);
        // Go to Member list
        await testClientA.click("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisible("#members-search");
        await testClientA.waitForNotVisibleWithText(".warning-text.warning-text-block.info-text", "Only users that can chat in private external rooms will be shown in search results here.");
        await DistributionListScenarios.addMemberStepCreateDL(testClientA, testUser01);
        await DistributionListScenarios.addMemberStepCreateDL(testClientA, testUser02);
        await DistributionListScenarios.addMemberStepCreateDL(testClientA, testUser03);
        await DistributionListScenarios.addMemberStepCreateDL(testClientA, testUser04);
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser02.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser03.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "4");
        await testClientA.waitForVisible("//*[contains(@class,'update-list-button')][.='Save the list']");
        await testClientA.click("//*[contains(@class,'update-list-button')][.='Save the list']");
        // Check DL in whole list
        await DistributionListScenarios.checkDLinList(testClientA, sdlName, att1, att2, att3, att4,
            externalType, 4);
    });

    it("should be able update internal DL with role DL Manager", async () => {
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL update
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlName);
        // Enter data
        await DistributionListScenarios.fillDataStepCreateDL(testClientA, sdlNameUpdate, att1Update,
            att2Update, att3Update, att4Update, null);
        // Checks
        await DistributionListScenarios.checkDataStepCreateDL(testClientA, sdlNameUpdate, att1Update,
            att2Update, att3Update, att4Update, externalType);
        // Go to Member list
        await testClientA.click("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisible("#members-search");
        await testClientA.waitForNotVisibleWithText(".warning-text.warning-text-block.info-text", "Only users that can chat in private external rooms will be shown in search results here.");
        await testClientA.waitForVisible("//*[contains(@class,'update-list-button')][.='Save the list']");
        await testClientA.click("//*[contains(@class,'update-list-button')][.='Save the list']");
        // Check DL in whole list
        // tslint:disable-next-line:max-line-length
        await DistributionListScenarios.checkDLinList(testClientA, sdlNameUpdate, att1Update, att2Update, att3Update, att4Update,
            externalType, 4);
        // Remove some attributes
        // Open Modal for DL update
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlNameUpdate);
        // tslint:disable-next-line:max-line-length
        await testClientA.waitForVisible("//*[./*[@class='Select-value-label'][contains(@id,'-value-0')]/span[.='" + att1Update + "']]/*[@class='Select-value-icon']");
        // tslint:disable-next-line:max-line-length
        await testClientA.waitForVisible("//*[./*[@class='Select-value-label'][contains(@id,'-value-1')]/span[.='" + att2Update + "']]/*[@class='Select-value-icon']");
        await testClientA.click("//*[./*[@class='Select-value-label'][contains(@id,'-value-0')]/span[.='" + att1Update + "']]/*[@class='Select-value-icon']");
        await testClientA.click("//*[./*[@class='Select-value-label'][contains(@id,'-value-0')]/span[.='" + att2Update + "']]/*[@class='Select-value-icon']");
        // tslint:disable-next-line:max-line-length
        await testClientA.waitForNotVisible("//*[@class='Select-value-label'][contains(@id,'-value-')]/span[.='" + att1Update + "']");
        // tslint:disable-next-line:max-line-length
        await testClientA.waitForNotVisible("//*[@class='Select-value-label'][contains(@id,'-value-')]/span[.='" + att2Update + "']");
        await testClientA.waitForVisible("//*[@class='list-display-name-box']/span[contains(text(), '" +
            sdlNameUpdate + "')]");
        await testClientA.waitForNotVisible("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag'][contains(text(), '" + att1Update + "')]");
        await testClientA.waitForNotVisible("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag'][contains(text(), '" + att2Update + "')]");
        await testClientA.waitForVisible("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag'][contains(text(), '" + att3Update + "')]");
        await testClientA.waitForVisible("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag'][contains(text(), '" + att4Update + "')]");
        // Go to Member list
        await testClientA.click("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisible("#members-search");
        await testClientA.waitForNotVisibleWithText(".warning-text.warning-text-block.info-text", "Only users that can chat in private external rooms will be shown in search results here.");
        await testClientA.waitForVisible("//*[contains(@class,'update-list-button')][.='Save the list']");
        await testClientA.click("//*[contains(@class,'update-list-button')][.='Save the list']");
        // Check DL in whole list
        await testClientA.waitForNotVisible("//div[@role='row'][./*[.='" + sdlNameUpdate + "']]//*[@class='list-attribute-tag'][.='" + att1Update + "']");
        await testClientA.waitForNotVisible("//div[@role='row'][./*[.='" + sdlNameUpdate + "']]//*[@class='list-attribute-tag'][.='" + att2Update + "']");
        await DistributionListScenarios.checkDLinList(testClientA, sdlNameUpdate, null, null, att3Update, att4Update,
            externalType, 4);
    });
});
