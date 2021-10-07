import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import expect from "expect";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";
import * as dlElements from "../pageObjects/acp/dl/IDistributionListPage";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;
    let testUser01: TestUser;
    let testUser02: TestUser;
    let testUser03: TestUser;
    let testUser04: TestUser;
    let testUser05: TestUser;
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

    const userMoreInfoForTest = {
        function: [att1],
        instrument: [att2],
        marketCoverage: [att3],
        responsibility: [att4],
    };

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        await pmpHelper.updatePodSetting(testClientHelper.getHost().backendUrl.replace("/admin-console", "") +
            "/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        [testUser04] = await testClientHelper.setupTestUsers(["NoEntitlementsCanChat"],
            { userMoreInfo: userMoreInfoForTest });
        [testUser01, testUser02, testUser03, testUser05] = await testClientHelper.setupTestUsers(["A", "B", "C", "AddRemoveTest"],
            { entitlements: userEntitlements, userMoreInfo: userMoreInfoForTest });
        [testClientA] = await testClientHelper.setupDesktopClients(["SDLTEST"],
            {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
    });

    it("should be able create internal DL with role DL Manager", async () => {
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
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must provide a non-empty name");
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must select at least one attribute");
        // Enter data
        await DistributionListScenarios.fillDataStepCreateDL(testClientA, sdlName, att1, null, att3, att4,
            externalType);
        // Checks
        await DistributionListScenarios.checkDataStepCreateDL(testClientA, sdlName, att1, null, att3, att4,
            externalType);
        // Go to Member list
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForNotVisibleWithText(dlElements.warningMessageMemberList, "Only users that can chat in private external rooms will be shown in search results here.");
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser01);
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser02);
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser03);
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser04);
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser02.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser03.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser04.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "4");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        // Check DL in whole list
        await DistributionListScenarios.checkDLinList(testClientA, sdlName, att1, null, att3, att4,
            externalType, 4);
    });

    it("should be able update internal DL with role DL Manager", async () => {
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
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForNotVisibleWithText(dlElements.warningMessageMemberList, "Only users that can chat in private external rooms will be shown in search results here.");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
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
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForNotVisibleWithText(dlElements.warningMessageMemberList, "Only users that can chat in private external rooms will be shown in search results here.");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        // Check DL in whole list
        await testClientA.waitForNotVisible("//div[@role='row'][./*[.='" + sdlNameUpdate + "']]//*[@class='list-attribute-tag'][.='" + att1Update + "']");
        await testClientA.waitForNotVisible("//div[@role='row'][./*[.='" + sdlNameUpdate + "']]//*[@class='list-attribute-tag'][.='" + att2Update + "']");
        await DistributionListScenarios.checkDLinList(testClientA, sdlNameUpdate, null, null, att3Update, att4Update,
            externalType, 4);
    });

    it("should be able add member to internal DL with role DL Manager", async () => {
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL update
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlNameUpdate);
        // Go to Member list
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForNotVisibleWithText(dlElements.warningMessageMemberList, "Only users that can chat in private external rooms will be shown in search results here.");
        // Search and select user
        await testClientA.sleep(499);
        await testClientA.setValue(dlElements.searchBarInputMemberList, testUser05.displayname);
        await testClientA.waitForVisible(dlElements.resetSearchButtonMemberList);
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "4");
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser05);
        await testClientA.click(dlElements.resetSearchButtonMemberList);
        await testClientA.waitForNotVisible(dlElements.loaderMemberList);
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser05.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser02.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser03.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser04.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "5");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        // Check DL in whole list
        await DistributionListScenarios.checkDLinList(testClientA, sdlNameUpdate, null, null, att3Update, att4Update,
            externalType, 5);
    });

    it("should be able remove member from internal DL with role DL Manager", async () => {
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL update
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlNameUpdate);
        // Go to Member list
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForNotVisibleWithText(dlElements.warningMessageMemberList, "Only users that can chat in private external rooms will be shown in search results here.");
        // Search and select user
        await testClientA.sleep(499);
        await testClientA.setValue(dlElements.searchBarInputMemberList, testUser05.displayname);
        await testClientA.waitForVisible(dlElements.resetSearchButtonMemberList);
        await testClientA.waitForNotVisible(dlElements.loaderMemberList);
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "5");
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser05);
        await testClientA.click(dlElements.resetSearchButtonMemberList);
        await testClientA.waitForNotVisible(dlElements.loaderMemberList);
        await testClientA.sleep(499);
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser02.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser03.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser04.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "4");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        // Check DL in whole list
        await DistributionListScenarios.checkDLinList(testClientA, sdlNameUpdate, null, null, att3Update, att4Update,
            externalType, 4);
    });

    it("should be able delete internal DL with role DL Manager", async () => {
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL update
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlNameUpdate);
        // Delete DL
        await DistributionListScenarios.deleteDL(testClientA);
        await testClientA.waitForNotVisible(dlElements.distributionListsModal);
        await testClientA.waitForNotVisible(
            "//*[contains(@class,'list-name-box-with-tag')][.='" + sdlNameUpdate + "']");
    });
});
