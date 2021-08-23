#!/usr/bin/env groovy

// Source @ https://github.com/SymphonyOSF/SFE-RTC-pipeline/tree/master/vars
@Library('SFE-RTC-pipeline') _

properties([
    parameters([
        string(name: "POD_NAME", defaultValue: "st2", description: "Name of the pod to run tests against"),
        string(name: "POD_ADMIN_CREDS_ID", defaultValue: "st2admin", description: "Id of jenkins credentials for pod admin username/password"),
        string(name: "JENKINS_NODE_LABEL", defaultValue: "fe-integration", description: "Label for the jenkins node which the job will run on"),
        string(name: "TEST_USERS_SUFFIX", defaultValue: "$env.BRANCH_NAME", description: "Suffix of test users"),
    ])
])

abortPreviousRunningBuilds()

node {
        cleanWs()
        try {
            checkout scm
            withNvm("v10.3.0", "npmrcFile") {
                stage("Install") {
                    sh "npm install"
                }
                withCredentials([
                    usernamePassword(credentialsId: "${params.POD_ADMIN_CREDS_ID}", usernameVariable: "ADMIN_USER", passwordVariable: "ADMIN_PWD"),
                ]) {
                    stage("Test client plain") {
                        sh """npm run sdl-admin-test -- --verbose 2 \
                            --run-chrome-in-docker \
                            --adminName $ADMIN_USER --adminPwd $ADMIN_PWD \
                            --log-base-dir \"${env.BUILD_URL}/artifact/\" \
                            --backend-url https://${params.POD_NAME}.symphony.com
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
