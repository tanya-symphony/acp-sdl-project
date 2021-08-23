#!/usr/bin/env groovy

// Source @ https://github.com/SymphonyOSF/SFE-RTC-pipeline/tree/master/vars
@Library('SFE-RTC-pipeline') _

def testPod1 = params.IS_BUILD_EPOD ? cicdUtils.getPodUrl("${deploymentName}-pod1") : params.TEST_EPOD_1
def adminUser = params.ADMIN_USER
def adminPassword = params.ADMIN_PWD

abortPreviousRunningBuilds()

node {
    def pod1Name = (stageNum % 2) ? testPod1 : testPod2
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
                withEnv([
                        "BACKEND_URL=${pod1Name}",
                        "START_PAGE_URL=${pod1Name}${params.START_PAGE_URL}",
                        "ADMIN_USER=${adminUser}",
                        "ADMIN_PWD=${adminPassword}"
                ]) {
                    stage("Test client plain") {
                        sh """npm run sdl-admin-test -- --verbose 2 \
                            --run-chrome-in-docker \
                            --adminName $ADMIN_USER --adminPwd $ADMIN_PWD \
                            --log-base-dir \"${env.BUILD_URL}/artifact/\" \
                            --backend-url https://$BACKEND_URL.symphony.com
                        """
                    }
                }
            }
        } finally {
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
