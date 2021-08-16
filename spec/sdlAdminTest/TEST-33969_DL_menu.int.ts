import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory,
} from "@symphony/rtc-greenkeeper-lib";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
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
});
