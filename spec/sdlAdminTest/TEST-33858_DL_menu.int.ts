import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";
import * as acpElements from "../pageObjects/acp/basic/IAdminConsoleBasicPage";
import * as dlElements from "../pageObjects/acp/dl/IDistributionListPage";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;
    let pmpHelper: PmpUser;
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        // Connecting to Symphony webpage
        [testClientA] = await testClientHelper.setupDesktopClients(["SDLTEST"],
            {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
    });

    it("do have new item 'Distribution list' under Company setting in ACP", async () => {
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Distribution list
        await DistributionListScenarios.checkDLPage(testClientA);
    });
});
