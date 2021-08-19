import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";

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
        [testClientA] = await testClientHelper.setupDesktopClients(["Tania"], {user: { roles: ["INDIVIDUAL", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
    });

    it("do not show Distribution list menu for non-SDL manager", async () => {
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await testClientA.waitForNotVisible(".distributionLists");
    });
    it("do not get access by URL admin-console/index.html#distributionLists for non-SDL manager", async () => {
        // Distribution list
        await testClientA.loadPage("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/admin-console/index.html#distributionLists");
        await testClientA.waitForNotVisible(".distributionLists");
        await testClientA.waitForNotVisibleWithText("//*[@data-test-id='L5kazWLrVk']", "Distribution Lists");
        await testClientA.waitForNotVisible(".create-new-list-btn");
    });
});
