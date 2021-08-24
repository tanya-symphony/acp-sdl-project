@Library("sym-pipeline@master") _
@Library('SFE-RTC-pipeline')

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

node {
    def httpsPrefix = "https://"
    def pod1Name = params.TEST_EPOD_1
    def testSupportPortalKeyStore = params.TEST_SUPPORT_PORTAL_KEYSTORE_CREDS_ID ?: "test.support.portal.keystore"
    def testSupportPortalKeyStorePassword = params.TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD_CREDS_ID ?: "test.support.portal.keystore.password"
    def testSupportPortalKeyStoreAlias = params.TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS ?: "support-alias"
        cleanWs()
        try {
            checkout scm
            withNvm("v12.18.3", "npmrcFile") {
                stage("Install") {
                    sh "npm install"
                }
                withCredentials([string(credentialsId: 'bff_keystore', variable: 'KEYSTORE')]) {
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
                            sh """npm run sdl-admin-test -- --verbose 2 \
                            --run-chrome-in-docker \
                            --adminName $ADMIN_USER --adminPwd $ADMIN_PWD \
                            --log-base-dir \"${env.BUILD_URL}/artifact/\" \
                            --start-page-url ${START_PAGE_URL} \
                            --backend-url ${BACKEND_URL}/admin-console \
                            --support-portal-keystore-path \"${TEST_SUPPORT_PORTAL_KEYSTORE}\" \
                            --support-portal-keystore-password \"${TEST_SUPPORT_PORTAL_KEYSTORE_PASSWORD}\" \
                            --support-portal-keystore-alias \"${TEST_SUPPORT_PORTAL_KEYSTORE_ALIAS}\" \
                        """
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
                } finally {
                    cleanWs()
                }
            }
        }
}
