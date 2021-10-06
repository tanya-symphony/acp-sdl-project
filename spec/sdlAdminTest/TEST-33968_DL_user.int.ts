import {
    describeWithTestClient,
    DesktopClient,
    TestClientFactory, TestUser,
} from "@symphony/rtc-greenkeeper-lib";
import {PmpUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import {AdminUser} from "@symphony/rtc-greenkeeper-lib/dist/TestClientFactory";
import * as AccountScenarios from "../helpers/AccountScenarios";
import * as ACPNavigationScenarios from "../helpers/ACPNavigationScenarios";
import * as DistributionListScenarios from "../helpers/DistributionListScenarios";
import * as acpElements from "../pageObjects/acp/basic/IAdminConsoleBasicPage";
import * as dlElements from "../pageObjects/acp/dl/IDistributionListPage";

describeWithTestClient("Targetting Symphony admin-console", (testClientHelper: TestClientFactory) => {
    let testUser01: TestUser;
    let testClientA: DesktopClient;
    let pmpHelper: PmpUser;
    const testUserName: string = "UserWithoutSDLRole" + + Date.now().toString();
    const passwordTest: string = "Symphony!123456";
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
        [testUser01] = await testClientHelper.setupTestUsers([testUserName]);
        await pmpHelper.updatePodSetting("https://warpdrive-lab.dev.symphony.com/env/tetianak-pod1/sbe/support/v1/system/settings/enable-distribution-list-management", "ENABLE");
        // Connecting to Symphony webpage
        [testClientA] = await testClientHelper.setupDesktopClients(["SDLTEST"],
            {user: { roles: ["INDIVIDUAL", "SUPER_ADMINISTRATOR", "L1_SUPPORT", "SUPER_COMPLIANCE_OFFICER"]}});    });

    beforeEach(async () => {
        const startPageQuery = `?showHotSpots=0`;
        await testClientA.loadPage(testClientA.getStartPageUrl() + startPageQuery);
        await testClientA.waitForVisible("#nav-profile");
        // Go from Client to Admin-console
        await ACPNavigationScenarios.openACPfromClient1_5(testClientA);
    });

    it("do update SDL manager role for existing user in ACP", async () => {
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Go to Browse Accounts page
        await ACPNavigationScenarios.goToBrowseAccountsPage(testClientA);
        // Check page
        await AccountScenarios.checkBrowseAccountsPage(testClientA);
        // Create user with DL role
        await AccountScenarios.openAccount(testClientA, testUserName);
        // Set password
        await AccountScenarios.changePasswordDuringAccountUpdate(testClientA, passwordTest);
        // Set role
        await AccountScenarios.setRoleDuringAccountCreation(testClientA, "DISTRIBUTION_LIST_MANAGER");
        // Finish creation
        await AccountScenarios.finishAccountUpdate(testClientA);
        // Logout
        await ACPNavigationScenarios.logOut(testClientA);
        // Login
        await ACPNavigationScenarios.loginACP(testClientA, testUser01.username, passwordTest);
        // Go to DL page
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Distribution list
        await DistributionListScenarios.checkDLPage(testClientA);
    });
});
