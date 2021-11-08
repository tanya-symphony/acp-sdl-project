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
    let testClientA: DesktopClient;
    let pmpHelper: PmpUser;
    const testUserName: string = "autotest" + + Date.now().toString();
    const passwordTest: string = "Symphony!123456";
    pmpHelper = testClientHelper.getPmpUser(["SP_CAN_MODIFY_POD_CONF"]);

    before(async () => {
        // Allowing all errors from client since this is just an example project
        TestClientFactory.globalLogWhitelist = [
            /.*/,
        ];
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

    it("do creation of new user with SDL manager role in ACP", async () => {
        // Admin Session start
        await ACPNavigationScenarios.adminSessionStart(testClientA);
        // Distribution list
        await ACPNavigationScenarios.goToCreateAnAccountPage(testClientA);
        // Check page
        await AccountScenarios.checkCAPage(testClientA);
        // Create user with DL role
        await AccountScenarios.fillBaseInfoForAccountCreation(testClientA, testUserName);
        // Set password
        await AccountScenarios.changePasswordDuringAccountCreation(testClientA, passwordTest);
        // Set role
        await AccountScenarios.setRoleDuringAccountCreation(testClientA, "DISTRIBUTION_LIST_MANAGER");
        // Finish creation
        await AccountScenarios.finishAccountCreation(testClientA);
        // Logout
        await ACPNavigationScenarios.logOut(testClientA);
        // Login
        await ACPNavigationScenarios.loginACP(testClientA, testUserName, passwordTest);
        // Go to DL page
        await ACPNavigationScenarios.goToDLPage(testClientA);
        // Distribution list
        await DistributionListScenarios.checkDLPage(testClientA);
    });
});
