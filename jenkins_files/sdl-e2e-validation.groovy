@Library("sym-pipeline@master") _

import groovy.json.JsonSlurperClassic
import com.symphony.cicd.SymphonyCICDUtils
import com.symphony.cicd.build.YarnBuilder
import com.symphony.cicd.YarnAppDescriptor
import com.symphony.cicd.NotificationUtils

SymphonyCICDUtils cicdUtils = new SymphonyCICDUtils()
NotificationUtils notificationUtils = new NotificationUtils()

int parallelRuns = params.PARALLEL_TEST_STAGES as Integer
def sfeLiteHashHeaded = ""
// Paramaters for building new pod
def jobName = "${env.JOB_BASE_NAME}".toLowerCase()
def deploymentName = "${jobName}-${env.BUILD_NUMBER}-" + UUID.randomUUID().toString().take(4).replaceAll("[^a-zA-Z0-9-]+", "-")
def testPod1 = params.IS_BUILD_EPOD ? cicdUtils.getPodUrl("${deploymentName}-pod1") : params.TEST_EPOD_1
def testPod2 = params.IS_BUILD_EPOD ? cicdUtils.getPodUrl("${deploymentName}-pod2") : params.TEST_EPOD_2
def sfeLiteOrg = params.SFE_LITE_GIT_ORG
def sfeLiteBranch = params.SFE_LITE_GIT_BRANCH
def clientBffOrg = params.CLIENT_BFF_GIT_ORG
def clientBffBranch = params.CLIENT_BFF_GIT_BRANCH
def sbeOrg = params.SBE_GIT_ORG
def sbeBranch = params.SBE_GIT_BRANCH
def sfeClientOrg = params.SFE_CLIENT_GIT_ORG
def sfeClientBranch = params.SFE_CLIENT_GIT_BRANCH
def sfeLoginOrg = params.SFE_LOGIN_GIT_ORG
def sfeLoginBranch = params.SFE_LOGIN_GIT_BRANCH
def sfeAcOrg = params.SFE_AC_GIT_ORG
def sfeAcBranch = params.SFE_AC_GIT_BRANCH
def deploymentType = "SbeAndSfe"
def adminUser = params.ADMIN_USER
def adminPassword = params.ADMIN_PWD
def podEntitlements = """
    adminUsername: ${adminUser}
    adminPassword: ${adminPassword}
    podEntitlements:
      viewConversationHistory: true
      canForwardMessage: true
      podCanReceiveExternalFiles: true
      canIntegrateEmail: true
      canMobileCopyPaste: true
      navyBlueThemeEnabled: false
      canMobileOpenURL: true
      2FactorAuthACPEnabled: false
      enableMobilePolicies: true
      canMobileShareInternalFile: true
      dragAndDropEnabled: true
      canMobileShareExternalFile: true
      enableMobileShareExtensions: true
      restrictEmojiSet: false
      inlineImagePreviewEnabled: true
      offlineEmailNotificationsEnabled: true
      isImageCastingEnabled: true
      canMobileAccessAddressBook: true
      isImageCastingPreferred: true
      warnedWhenCommunicatingExternally: false
      canMobileShareFile: true
      enableMobilePIN: false
      isImageCastingEnforced: true
      canMobileSendFeedbackEmail: true
      canAutoConnect: true
      warnedWhenSharingFilesExternally: false
    userEntitlements:
      podLevelEnabled:
        postReadEnabled: true
        postWriteEnabled: true
        delegatesEnabled: true
        isExternalIMEnabled: true
        canShareFilesExternally: true
        canCreatePublicRoom: true
        canUpdateAvatar: true
        isExternalRoomEnabled: true
        canCreatePushedSignals: true
        canUseCompactMode: true
        mustBeRecorded: true
        sendFilesEnabled: true
        canUseInternalAudio: true
        canUseInternalVideo: true
        canProjectInternalScreenShare: true
        canViewInternalScreenShare: true
        canCreateMultiLateralRoom: true
        canJoinMultiLateralRoom: true
        canIntegrateEmail: true
        canUseFirehose: true
        canManageSignalSubscription: true
      userDefaults:
        postReadEnabled: true
        postWriteEnabled: true
        delegatesEnabled: true
        isExternalIMEnabled: true
        canShareFilesExternally: true
        canCreatePublicRoom: true
        canUpdateAvatar: true
        isExternalRoomEnabled: true
        canCreatePushedSignals: true
        canUseCompactMode: true
        mustBeRecorded: true
        sendFilesEnabled: true
        canUseInternalAudio: true
        canUseInternalVideo: true
        canProjectInternalScreenShare: true
        canViewInternalScreenShare: true
        canCreateMultiLateralRoom: true
        canJoinMultiLateralRoom: true
        canIntegrateEmail: true
        canUseFirehose: true
        canManageSignalSubscription: true
    fileTypeAllowed:
      .png:
        scopeInternal: true
        scopeExternal: true
      .xml:
        scopeInternal: true
        scopeExternal: true
      .zip:
        scopeInternal: true
        scopeExternal: true
      .txt:
        scopeInternal: true
        scopeExternal: true
      .docx:
        scopeInternal: true
        scopeExternal: true
      .jpg:
        scopeInternal: true
        scopeExternal: true
      .pdf:
        scopeInternal: true
        scopeExternal: true
"""
def enablePushNotification = env.NOTIFICATION_BUILD_RESULT ? env.NOTIFICATION_BUILD_RESULT.toBoolean() : false

def returnGreenkeeperStage(stageNum, parallelRuns, sfeLiteHashHeaded, sfeLiteOrg, sfeLiteBranch, testPod1, testPod2, adminUser, adminPassword) {
    return {
        stage("Validation Test - ${stageNum}") {
            try {
                def pod1Name = (stageNum % 2) ? testPod1 : testPod2
                def pod2Name = (stageNum % 2) ? testPod2 : testPod1
                def testSupportPortalKeyStore = params.TEST_SUPPORT_PORTAL_KEYSTORE_CREDS_ID ?: "test.support.portal.keystore"
                def testSupportPortalKeyStorePassword = params.TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD_CREDS_ID ?: "test.support.portal.keystore.password"
                def testSupportPortalKeyStoreAlias = params.TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS ?: "support-alias"
                def botPublicKeyRSA = params.BOT_PUBKEY_RSA_CREDS_ID ?: "bot-e2e-test-pubkey-rsa-gk"
                def botPrivateKeyRSA = params.BOT_PRIVKEY_RSA_CREDS_ID ?: "bot-e2e-test-privkey-rsa-gk"
                def urlSearchParams = (params.URL_SEARCH_PARAMS instanceof String && !params.URL_SEARCH_PARAMS.isEmpty()) ? "--url-search-params ${params.URL_SEARCH_PARAMS}" : ""

                withEnv([
                        "BACKEND_URL=${pod1Name}",
                        "START_PAGE_URL=${pod1Name}${params.START_PAGE_URL}",
                        "ADMIN_USER=${adminUser}",
                        "ADMIN_PWD=${adminPassword}",
                        "TEST_ARGS=--testSuiteName Validation-Test-${stageNum} --bucket ${stageNum}:${parallelRuns} --capture-interface ens4 ${params.TEST_ARGS} ${urlSearchParams}",
                        "TEST_USERS_SUFFIX=validation${env.BUILD_NUMBER}",
                        "LOG_DIR=logs-${stageNum}",
                        "REPORT_FILE_JSON=report-${stageNum}.json",
                        "TEST_RESULTS_FILE=test-results-${stageNum}.xml",
                        "TEST_RESULTS_JSON=test-results-${stageNum}.json",
                        "SFE_LITE_GIT_BRANCH=${sfeLiteBranch}",
                        "SFE_LITE_GIT_ORG=${sfeLiteOrg}",
                        "TEST_SUPPORT_PORTAL_KEYSTORE=${testSupportPortalKeyStore}",
                        "TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD=${testSupportPortalKeyStorePassword}",
                        "TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS=${testSupportPortalKeyStoreAlias}",
                        "BOT_PUBKEY_RSA_CREDS_ID=${botPublicKeyRSA}",
                        "BOT_PRIVKEY_RSA_CREDS_ID=${botPrivateKeyRSA}",
                        "STORAGE_BASE_URL=gs://sym-epod-cache"
                ]) {
                    // runGreenKeeperTest(sfeLiteHashHeaded)
                        sh """npm run sdl-admin-test -- --verbose 2 \
                            --run-chrome-in-docker \
                            --adminName $ADMIN_USER --adminPwd $ADMIN_PWD \
                            --log-base-dir \"${env.BUILD_URL}artifact/\" \
                            --backend-url $BACKEND_URL/admin-console \
                            --start-page-url $START_PAGE_URL
                        """
                }
            } catch (error) {
                println "Error on Validation Test - ${stageNum}: ${error}"
                error.printStackTrace()
            }
        }
    }
}

node {
    cleanWs()
    try {
        checkout scm
        withNvm("v10.3.0", "npmrcFile") {
            stage("Install") {
                sh "npm install"
            }
        if (params.IS_BUILD_EPOD) { // Run with new pod
            withCredentials([string(credentialsId: 'bff_keystore', variable: 'KEYSTORE')]) {
                withEnv([
                        "ALLOCATE_NODE_FOR_DEPLOYMENT=true",
                        "DEPLOYMENT_NAME=${deploymentName}",

                        "DISABLE_GENERIC_SCM=true",
                        "MS_NGINX_ENABLED=true",

                        "GIT_REPO=SBE",
                        "SFE_LITE_ENABLED=true",
                        "USE_EPOD_2_HOST=true",
                        "EPOD_NGINX_ENABLED=true",

                        "SFE_LITE_GIT_BRANCH=${sfeLiteBranch}",
                        "SFE_LITE_GIT_ORG=${sfeLiteOrg}",
                        "CLIENT_BFF_GIT_BRANCH=${clientBffBranch}",
                        "CLIENT_BFF_GIT_ORG=${clientBffOrg}",

                        "POD1_GIT_ORG=${sbeOrg}",
                        "POD1_GIT_BRANCH=${sbeBranch}",
                        "POD1_SFE_CLIENT_GIT_ORG=${sfeClientOrg}",
                        "POD1_SFE_CLIENT_GIT_BRANCH=${sfeClientBranch}",
                        "POD1_SFE_LOGIN_GIT_ORG=${sfeLoginOrg}",
                        "POD1_SFE_LOGIN_GIT_BRANCH=${sfeLoginBranch}",
                        "POD1_SFE_AC_GIT_ORG=${sfeAcOrg}",
                        "POD1_SFE_AC_GIT_BRANCH=${sfeAcBranch}",
                        "POD1_DEPLOYMENT_TYPE=${deploymentType}",
                        "POD1_AGENT_ENABLED=true",
                        "POD1_USE_SNSSQS=false",

                        "POD2_GIT_ORG=${sbeOrg}",
                        "POD2_GIT_BRANCH=${sbeBranch}",
                        "POD2_SFE_CLIENT_GIT_ORG=${sfeClientOrg}",
                        "POD2_SFE_CLIENT_GIT_BRANCH=${sfeClientBranch}",
                        "POD2_SFE_LOGIN_GIT_ORG=${sfeLoginOrg}",
                        "POD2_SFE_LOGIN_GIT_BRANCH=${sfeLoginBranch}",
                        "POD2_SFE_AC_GIT_ORG=${sfeAcOrg}",
                        "POD2_SFE_AC_GIT_BRANCH=${sfeAcBranch}",
                        "POD2_DEPLOYMENT_TYPE=${deploymentType}",
                        "POD2_AGENT_ENABLED=true",
                        "POD2_USE_SNSSQS=false",

                        "ENABLE_ICAP_SERVER=true",
                        "CONFIGURE_POD_ENTITLEMENTS=true",
                        "POD_ENTITLEMENTS=${podEntitlements}",
                        "KEYSTORE=${KEYSTORE}",
                        "STORAGE_BASE_URL=gs://sym-epod-cache"
                ]) {
                    xpod(2) {
                        sfeLiteHashHeaded = env.SFE_LITE_GIT_HASH
                        cicdUtils.gitCloneToSubdirectory("./ACP-SDL", "master", "https://github.com/tanya-symphony/acp-sdl-project.git")
                        parallel(new ArrayList(1..parallelRuns).collectEntries {index -> [("Validation Test - ${index}"): returnGreenkeeperStage(index, parallelRuns, sfeLiteHashHeaded, sfeLiteOrg, sfeLiteBranch, testPod1, testPod2, adminUser, adminPassword)]})

                        // Give a while for developers to debug issues on the current pod
                        sh "sleep ${params.DEBUG_SLEEP_TIMEOUT} || exit 0"
                    }
                }
            }
        } else { // Run with existing pod
            // sfeLiteHashHeaded = YarnBuilder.yarnCacheBuildOrDownloadIt(env, steps, YarnAppDescriptor.SFE_LITE, sfeLiteOrg, sfeLiteBranch)
            parallel(new ArrayList(1..parallelRuns).collectEntries {index -> [("Validation Test - ${index}"): returnGreenkeeperStage(index, parallelRuns, sfeLiteHashHeaded, sfeLiteOrg, sfeLiteBranch, testPod1, testPod2, adminUser, adminPassword)]})
        }
    } } catch (error) {
        error.printStackTrace()
        currentBuild.setDescription("Error while running test: ${error}")
        currentBuild.buildResult = 'FAILURE'
    } finally {
        stage("Archive artifacts") {
            try {
                dir("ACP-SDL/acp/e2e-test") {
                    for (i = 1 ; i <= parallelRuns ; i++) {
                        this.steps.sh "curl ${env.BUILD_URL}/artifact/logs-${i}/report.json --output report-${i}.json"
                    }
                    sh "./src/report/scripts/merge-report-files.sh fullReport report-*.json"
                    archiveArtifacts artifacts: "fullReport/**/*", allowEmptyArchive: true, fingerprint: true
                }

            } catch (error) {
                echo "Error while collecting reports: ${error}"
                error.printStackTrace()
            }
        }
    }
}

def getTestSummary(url) {
    def apiUrl = url + '/testReport/api/json'
    def summary = new JsonSlurperClassic().parse(new URL(apiUrl))
    int total = summary.failCount + summary.skipCount + summary.passCount
    def successPercentage = (String.format("%.2f", ((summary.passCount / total ) as Double) * 100)) as Double
    def failedTests = []
    def hasFailed =  false
    if (summary.failCount > 0) {
        hasFailed = true
        failedTests = summary.suites[0].cases
                .findAll {item -> item.status != "PASSED" }
        // If we send all the fields, there is a StackOverflow happening. So we need to only keep the ones we use
                .collect { item -> [className: item.className, name: item.name]}
    }
    return [
            testRunName: 'Epod - E2E 2.0',
            sfeBranch: "${env.SFE_LITE_GIT_ORG}:${env.SFE_LITE_GIT_BRANCH}",
            date: new Date().format("dd-MMM-yyyy hh:mm"),
            downstreamJobUrl: url,
            passCount: summary.passCount,
            failCount: summary.failCount,
            skipCount: summary.skipCount,
            totalCount: total,
            passPercentage: successPercentage,
            failedTests: failedTests,
            hasFailureDetails: hasFailed,
            noTestsFailure: false,
            unexpectedFailure: false,
            tagsIncluded: params.TEST_ARGS
    ]
}
