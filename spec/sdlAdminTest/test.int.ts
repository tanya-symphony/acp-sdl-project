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
        [testClientA] = await testClientHelper.setupDesktopClients(["Tania"], {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
    });

    it("should be able create internal DL with role DL Manager", async () => {
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
        await testClientA.waitForVisible(".distributionLists");
        await testClientA.click(".distributionLists");
        // Check DL page
        await testClientA.waitForVisibleWithText("//*[@data-test-id='L5kazWLrVk']", "Distribution Lists");
        await testClientA.waitForVisible(".create-new-list-btn");
        await testClientA.waitForVisible("//*[@data-test-id='p6kl7M869p']/a[.='Audit Trail']");
        // Open Modal for DL creation
        await testClientA.click(".create-new-list-btn");
        await testClientA.waitForVisible(".distribution-lists-modal");
        await testClientA.waitForVisible("//input[contains(@class, 'list-name-input')]");
        await testClientA.waitForVisible("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
        // External / Internal
        await testClientA.waitForExist("//*[@name='isExternal']");
        await testClientA.waitForVisible("//*[contains(@class, 'list-display-name-box')]");
        await testClientA.waitForVisible("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisible("//button[contains(@class, 'cancel-button')]");
        // Check errors
        await testClientA.click("//button[contains(@class, 'add-members-button')]");
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must provide a non-empty name");
        await testClientA.waitForVisibleWithText("//*[@class='settings-management']/*/*[@class='warning-text']", "You must select at least one attribute");
        // Enter data
        await testClientA.setValue("//input[contains(@class, 'list-name-input')]", "SDL AUTO 01");
        // await testClientA.assert(await testClientA.getValue("//*[@name='isExternal']") === 'on');
        await testClientA.click("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
        await testClientA.click("//*[@class='Select-menu-outer']");
    });
});
