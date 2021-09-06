import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import {AdminUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
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
    const att1: string = "Margin";
    const att2: string  = "Equities";
    const att3: string  = "NA";
    const att4: string  = "BAU";
    const sdlName: string = "SDL AUTO EXT " + Date.now().toString() + Math.random().toString().slice(2);
    const groupIBName01: string = "IB-test" + Date.now().toString() + Math.random().toString().slice(1);
    const groupIBName02: string = "IB-test" + Date.now().toString() + Math.random().toString().slice(1);
    const externalType: boolean = true;
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    const userEntitlements = {
        isExternalRoomEnabled: true };

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        // Connecting to Symphony webpage
        [testUser01, testUser02] = await testClientHelper.setupTestUsers(["FirstGroup", "SecondGroup"],
            { entitlements: userEntitlements } );
        [testClientA] = await testClientHelper.setupDesktopClients(["Ib-test"],
            {user: { roles: ["INDIVIDUAL", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
    });

    it("cannot add IB blocked users to new SDL in ACP", async () => {
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToInfoBarriersPage(testClientA);
        // Check page
        await InfoBarriersScenarios.checkIBPage(testClientA);
        // Open Group management
        await InfoBarriersScenarios.goToGroupManagement(testClientA);
        // Create group
        await InfoBarriersScenarios.createGroup(testClientA, groupIBName01);
        // TODO...
    });
});
