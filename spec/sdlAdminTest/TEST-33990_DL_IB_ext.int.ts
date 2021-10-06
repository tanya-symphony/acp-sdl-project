import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import {AdminUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import expect from "expect";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";
import * as InfoBarriersScenarios from "../helpers/InfoBarriersScenarios";
import * as acpElements from "../pageObjects/acp/basic/IAdminConsoleBasicPage";
import * as dlElements from "../pageObjects/acp/dl/IDistributionListPage";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    // Test Data
    let testClientA: DesktopClient;
    let testUser01: TestUser;
    let testUser02: TestUser;
    let pmpHelper: PmpUser;
    let value: string;
    const att1: string = "Margin";
    const att2: string  = "Equities";
    const att3: string  = "NA";
    const att4: string  = "BAU";
    const sdlName: string = "SDL AUTO EXT " + Date.now().toString() + Math.random().toString().slice(2);
    const groupIBName01: string = "IB-test01" + Date.now().toString();
    const groupIBName02: string = "IB-test02" + Date.now().toString();
    const externalType: boolean = true;
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
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        // Connecting to Symphony webpage
        [testUser01, testUser02] = await testClientHelper.setupTestUsers(["IB01", "IB02"],
            { entitlements: userEntitlements, userMoreInfo: userMoreInfoForTest });
        [testClientA] = await testClientHelper.setupDesktopClients(["IBTEST"],
            {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
    });

    it("cannot add IB blocked users to new external SDL in ACP", async () => {
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToInfoBarriersPage(testClientA);
        // Check page
        await InfoBarriersScenarios.checkIBPage(testClientA);
        // Open Group management
        await InfoBarriersScenarios.goToGroupManagement(testClientA);
        // Create groups
        await InfoBarriersScenarios.createGroup(testClientA, groupIBName01);
        await InfoBarriersScenarios.createGroup(testClientA, groupIBName02);
        await InfoBarriersScenarios.addMemberToGroup(testClientA, groupIBName01, testUser01);
        await InfoBarriersScenarios.goBackToGroupList(testClientA);
        await InfoBarriersScenarios.addMemberToGroup(testClientA, groupIBName02, testUser02);
        await InfoBarriersScenarios.goBackToGroupList(testClientA);
        // IB policies
        await InfoBarriersScenarios.goToIBPolicies(testClientA);
        await InfoBarriersScenarios.createIBPolicy(testClientA, groupIBName01, groupIBName02);
        // Create SDL with users blocked by IB
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Check DL page
        await DistributionListScenarios.checkDLPage(testClientA);
        await DistributionListScenarios.openModalForDLCreation(testClientA);
        await DistributionListScenarios.fillDataStepCreateDL(testClientA,
            sdlName, att1, null, att3, att4, externalType);
        // Checks
        await DistributionListScenarios.checkDataStepCreateDL(testClientA,
            sdlName, att1, null, att3, att4, externalType);
        // Go to Member list
        await testClientA.click(dlElements.addMembersButtonModal);
        await testClientA.waitForVisible(dlElements.searchBarInputMemberList);
        await testClientA.waitForVisibleWithText(dlElements.warningMessageMemberList,
            "Only users that can chat in private external rooms will be shown in search results here.");
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser01);
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser02);
        // Validation
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser02.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        // Try to save list
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        // Catch error message
        await testClientA.waitForVisible(dlElements.errorMessageMemberList);
        await testClientA.waitForVisibleWithText(dlElements.errorMessageMemberList,
            "An information barrier violation was found between the group members");
        await testClientA.waitForVisible(dlElements.distributionListsModal);
        // Unselect one user
        await DistributionListScenarios.selectMemberStepCreateDL(testClientA, testUser02);
        value = await testClientA.getElementAttribute("//div[label[@for='user " + testUser01.userId + "']]", "class");
        await testClientA.assert(() => expect(value).toContain("is-selected"));
        await testClientA.waitForVisibleWithText("//*[contains(@class,'members-header-link')]/span", "1");
        await testClientA.waitForVisible(dlElements.saveButtonMemberList);
        await testClientA.click(dlElements.saveButtonMemberList);
        await testClientA.waitForNotVisible(dlElements.distributionListsModal);
        await testClientA.waitForVisible("//*[contains(@class,'list-name-box-with-tag')][.='" + sdlName + "']");
        // Delete current DL
        await DistributionListScenarios.openModalForDLEdition(testClientA, sdlName);
        // Delete DL
        await DistributionListScenarios.deleteDL(testClientA);
        await testClientA.waitForNotVisible(dlElements.distributionListsModal);
        await testClientA.waitForNotVisible(
            "//*[contains(@class,'list-name-box-with-tag')][.='" + sdlName + "']");
    });
});
