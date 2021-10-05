// Source @ https://github.com/SymphonyOSF/SFE-RTC-pipeline/tree/master/vars
@Library(["sym-pipeline@master", "SFE-RTC-pipeline"]) _

import groovy.json.JsonSlurperClassic
import com.symphony.cicd.SymphonyCICDUtils

SymphonyCICDUtils cicdUtils = new SymphonyCICDUtils()

int parallelRuns = params.PARALLEL_TEST_STAGES as Integer
def sfeLiteHashHeaded = ""
// Paramaters for building new pod
def jobName = "${env.JOB_BASE_NAME}".toLowerCase()
def deploymentName = "${jobName}-${env.BUILD_NUMBER}-" + UUID.randomUUID().toString().take(4).replaceAll("[^a-zA-Z0-9-]+", "-")
def testPod1 = params.TEST_EPOD_1
def testPod2 = params.TEST_EPOD_2
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

abortPreviousRunningBuilds()

node ("fe-integration") {
    def httpsPrefix = "https://"
    def pod1Name = params.TEST_EPOD_1
    def testSupportPortalKeyStore = params.TEST_SUPPORT_PORTAL_KEYSTORE_CREDS_ID ?: "test.support.portal.keystore"
    def testSupportPortalKeyStorePassword = params.TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD_CREDS_ID ?: "test.support.portal.keystore.password"
    def testSupportPortalKeyStoreAlias = params.TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS ?: "support-alias"
        cleanWs()
        try {
            checkout scm
            withNvm("v12.18.3", "npmrcFile") {
                withYvm("v1.15.2") {
                    stage("Install") {
                        sh "yarn install"
                    }

                    withCredentials([usernamePassword(credentialsId: "${params.POD_ADMIN_CREDS_ID}", usernameVariable: "ADMIN_USER", passwordVariable: "ADMIN_PWD"),
                                     file(credentialsId: "${testSupportPortalKeyStore}", variable: 'SUPPORT_PORTAL_KEYSTORE'),
                                     string(credentialsId: "${testSupportPortalKeyStorePassword}", variable: 'SUPPORT_PORTAL_KEYSTORE_PASSWORD')]) {
                        withEnv([
                                "BACKEND_URL=${httpsPrefix}${pod1Name}",
                                "START_PAGE_URL=${httpsPrefix}${pod1Name}${params.START_PAGE_URL}",
                                "ADMIN_USER=${adminUser}",
                                "ADMIN_PWD=${adminPassword}",
                                "TEST_SUPPORT_PORTAL_KEYSTORE=${testSupportPortalKeyStore}",
                                "TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD=${testSupportPortalKeyStorePassword}",
                                "TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS=${testSupportPortalKeyStoreAlias}"
                        ]) {
                            stage("Test acp-admin sdl tests") {
                                sh """yarn run sdl-admin-test  --verbose 2 \
                                    --docker \
                                    --adminName $ADMIN_USER --adminPwd $ADMIN_PWD \
                                    --log-base-dir \"${env.BUILD_URL}/artifact/\" \
                                    --start-page-url $START_PAGE_URL \
                                    --backend-url $BACKEND_URL/admin-console \
                                    --support-portal-keystore-path ${SUPPORT_PORTAL_KEYSTORE} \
                                    --support-portal-keystore-password ${SUPPORT_PORTAL_KEYSTORE_PASSWORD} \
                                    --support-portal-keystore-alias ${testSupportPortalKeyStoreAlias}
                        """
                            }
                        }
                    }
                }
            }
        }
        finally {
            stage("Archive artifacts") {
                try {
                    archiveArtifacts artifacts: "logs/**/*", allowEmptyArchive: true, fingerprint: true
                    junit testResults: "test-results/**/*.xml", allowEmptyResults: true

                    sh "curl ${env.BUILD_URL}/artifact/test-results-summary.xml --output test-results-summary.xml"

                    if(params.SEND_RESULTS_TO_XRAY) {
                        nvm('v12.13.0') {
                            withCredentials([
                                    string(credentialsId: "XRAY_CLIENT_ID", variable: 'XRAY_CLIENT_ID'),
                                    string(credentialsId: "XRAY_CLIENT_SECRET", variable: 'XRAY_CLIENT_SECRET')
                            ]) {
                                echo "Sending results to XRay ..."
                                try {
                                    sh "node node_modules/.bin/report-xray -u ${XRAY_CLIENT_ID} -p ${XRAY_CLIENT_SECRET} -i ${params.XRAY_TEST_PLAN_ID} -r ${params.XRAY_TEST_EXECUTION_ID} -f test-results-*.xml -s ${params.XRAY_TEST_EXECUTION_SUMMARY}"
                                } catch (error) {
                                    echo "Sending XRay results failed: ${error}"
                                }
                            }
                        }
                    }

                } finally {
                    if (sh(returnStdout: true, script: "docker ps -a -q")) {
                        sh 'docker rm $(docker stop $(docker ps -a -q))'
                    }
                    cleanWs()
                }
            }
        }
}
