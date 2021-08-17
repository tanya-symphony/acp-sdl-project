import {
    AdminUser,
    describeWithTestClient,
    DesktopClient,
    TestClientFactory,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;
    let pmpHelper: PmpUser;
    let adminUser: AdminUser;
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);
    adminUser = testClientHelper.getAdmin();

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
        await testClientA.click("#toolbar-settings");
        await testClientA.waitForVisible("#generalSettingsTrigger");
        await testClientA.click("#generalSettingsTrigger");
        await testClientA.waitForVisible(".show-admin-link");
        await testClientA.click(".show-admin-link");
        // Admin Session start
        await testClientA.waitForVisible(".auth");
        await testClientA.waitForVisible("//*[@data-test-id='MId2Y5ONzB']");
        await testClientA.click("//*[@data-test-id='MId2Y5ONzB']");
        await testClientA.waitForVisible("#left-nav");
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
