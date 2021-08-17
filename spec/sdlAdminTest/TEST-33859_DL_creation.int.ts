import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import expect from "expect";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testClientA: DesktopClient;
    let pmpHelper: PmpUser;
    let testUser01: TestUser[];
    const att1: string = "Margin";
    const att2: string  = "Equities";
    const att3: string  = "NA";
    const att4: string  = "BAU";
    let value: string;
    const sdlName: string = "SDL AUTO 01";
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        testUser01 = await testClientHelper.setupTestUsers(["Katya"]);
        // Connecting to Symphony webpage
        [testClientA] = await testClientHelper.setupDesktopClients(["Tania"], {user: { roles: ["INDIVIDUAL", "DISTRIBUTION_LIST_MANAGER", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});
    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
    });

    it("should be able create external DL with role DL Manager", async () => {
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
        await DistributionListScenarios.checkDLPage(testClientA);
        // Open Modal for DL creation
        await DistributionListScenarios.openModalForDLCreation(testClientA);
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
        await testClientA.setValue("//input[contains(@class, 'list-name-input')]", sdlName);
        value = await testClientA.getElementAttribute("//*[@name='isExternal']", "value");
        await testClientA.assert(() => expect(value).toBe("on"));
        await testClientA.click("//*[contains(@class, 'Select-multi-value-wrapper')][contains(@id,'react-select')]");
        await testClientA.click("//*[@class='Select-menu-outer']");
        await testClientA.waitForVisible("//*[@name='list-attribute-select'][@value='" + att1 + "']");
        await testClientA.click("//*[@name='list-attribute-select'][@value='" + att1 + "']");
        await testClientA.click("//*[@name='list-attribute-select'][@value='" + att2 + "']");
        await testClientA.click("//*[@name='list-attribute-select'][@value='" + att3 + "']");
        await testClientA.click("//*[@name='list-attribute-select'][@value='" + att4 + "']");
        // Checks
        await testClientA.waitForVisibleWithValue("//input[contains(@class, 'list-name-input')]", sdlName);
        await testClientA.waitForVisibleWithText("//*[@class='Select-value-label'][contains(@id,'-value-0')]", att1);
        await testClientA.waitForVisibleWithText("//*[@class='Select-value-label'][contains(@id,'-value-1')]", att2);
        await testClientA.waitForVisibleWithText("//*[@class='Select-value-label'][contains(@id,'-value-2')]", att3);
        await testClientA.waitForVisibleWithText("//*[@class='Select-value-label'][contains(@id,'-value-3')]", att4);
        await testClientA.waitForVisibleWithValue("//*[@class='list-display-name-box']/span", sdlName);
        await testClientA.waitForVisibleWithText("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag']", att1);
        await testClientA.waitForVisibleWithText("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag']", att2);
        await testClientA.waitForVisibleWithText("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag']", att3);
        await testClientA.waitForVisibleWithText("//*[@class='list-display-name-box']" +
            "/*[@class='list-attribute-tag']", att4);
        await testClientA.waitForVisibleWithText("//*[@class='list-display-name-box']/*[@class='external-pod-tag']", "EXT");
    });
});
