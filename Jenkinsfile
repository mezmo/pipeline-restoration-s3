def CREDS = [
    aws(credentialsId: 'aws',
        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'),
    string(credentialsId: 'github-api-token',
           variable: 'GITHUB_TOKEN')
]

def GIT_BRANCH = [env.CHANGE_BRANCH, env.BRANCH_NAME]?.find{branch -> branch != null}

def NPMRC = [
    configFile(fileId: 'npmrc', variable: 'NPM_CONFIG_USERCONFIG')
]

def filesyncAlert(String branch) {
    if (branch.startsWith("filesync")) {
        slackSend(color: "danger", channel: "#filesync-ci", message: "${env.JOB_NAME} failed! <${env.BUILD_URL}|link>")
    }
}
def TRIGGER_PATTERN = ".*@logdnabot.*"

pipeline {
    agent {
        node {
            label 'ec2-fleet'
            customWorkspace("/tmp/workspace/${BUILD_TAG.replaceAll('%2F', '_')}")
        }
    }

    options {
        ansiColor 'xterm'
        timeout time: 1, unit: 'HOURS'
        timestamps()
        withCredentials(CREDS)
    }
    triggers {
        issueCommentTrigger(TRIGGER_PATTERN)
    }
    environment {
        GIT_BRANCH = "${GIT_BRANCH}"
        LAST_COMMITTER = sh(script: 'git log -1 --format=%ae', returnStdout: true).trim()
    }

    tools {
        nodejs 'NodeJS 16'
    }

    stages {
        stage('Last committer not logdnabot') {
            when {
                not {
                    allOf {
                        branch 'main'
                        environment name: 'LAST_COMMITTER', value: 'bot@logdna.com'
                    }
                }
            }
            stages {
                stage('Setup') {
                    steps {
                        configFileProvider(NPMRC) {
                            sh 'npm ci --ignore-scripts'
                        }
                    }
                }

                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }

                stage('Test') {
                    steps {
                        sh 'npm run test'
                    }
                }

                stage('Release:Dry') {
                    agent {
                        docker {
                        image "us.gcr.io/logdna-k8s/node:20-ci"
                        label 'ec2-fleet'
                        customWorkspace("/tmp/workspace/${BUILD_TAG.replaceAll('%2F', '_')}")
                        }
                    }
                    environment {
                        GIT_BRANCH = "${GIT_BRANCH}"
                        LAST_COMMITTER = sh(script: 'git log -1 --format=%ae', returnStdout: true).trim()
                    }
                    when {
                        not { branch 'main' }
                    }

                    steps {
                        sh 'npm run package'
                        sh 'npm ci'
                        sh "npm run release:dry"
                    }
                }

                stage('Release') {
                    agent {
                        docker {
                        image "us.gcr.io/logdna-k8s/node:20-ci"
                        label 'ec2-fleet'
                        customWorkspace("/tmp/workspace/${BUILD_TAG.replaceAll('%2F', '_')}")
                        }
                    }
                    environment {
                        GIT_BRANCH = "${GIT_BRANCH}"
                        LAST_COMMITTER = sh(script: 'git log -1 --format=%ae', returnStdout: true).trim()
                    }
                    when {
                        branch 'main'
                    }

                    steps {
                        sh 'npm run package'
                        sh 'npm ci'
                        sh "npm run release"
                    }
                }
            }
        }
    }

    post {
        unsuccessful {
            filesyncAlert(GIT_BRANCH)
        }
    }
}
