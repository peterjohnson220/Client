import hudson.model.*
import jenkins.model.*
import groovy.io.FileType
import groovy.json.JsonSlurperClassic
import java.text.SimpleDateFormat

nodeVersion = '12.15.0'
pkgName = 'PayFactorsClient'

octoProject = 'Client-J'
octoChannel = 'Default'
octoVerSuffix = ''

slackCh = 'f-build'
slackTitle = 'Build'

suffix = ""
verDetails = ""
numOfApps = "0"
env.pkgVersion = "N/A"

isPublishable = true
isAutoDeployBranch = false
buildRunning = true
BuildNode = ""

pipeline {
  agent { label 'ubuntu-util' }

  options {
    buildDiscarder(logRotator(numToKeepStr:'20'))
    disableConcurrentBuilds()
    parallelsAlwaysFailFast()
    timeout(time: 30, unit: 'MINUTES', activity: true)
  }

  stages {
    stage('Node Select') {
      steps {
        script {
          // Options to select a node to build from.
          properties([[$class: 'ScannerJobProperty', doNotScan: false], disableConcurrentBuilds(), [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false], parameters([[$class: 'ChoiceParameter', choiceType: 'PT_SINGLE_SELECT', filterLength: 1, filterable: false, name: 'Select_Build_Node', randomName: 'choice-parameter-6628075511885619', script: [$class: 'GroovyScript', fallbackScript: [classpath: [], sandbox: false, script: ''], script: [classpath: [], sandbox: true, script: '''return[
            \'Any:selected\',
            \'if00bldlin001\',
            \'if00bldlin002\',
            \'if00bldlin003\'
            ]''']]]]), throttleJobProperty(categories: [], limitOneJobWithMatchingParams: false, maxConcurrentPerNode: 0, maxConcurrentTotal: 0, paramsToUseForLimit: '', throttleEnabled: false, throttleOption: 'project')])

          echo "env.Select_Build_Node: " + env.Select_Build_Node

          if (env.Select_Build_Node == null || env.Select_Build_Node == "Any") {
            BuildNode = "ubuntu"
          } else {
            BuildNode = env.Select_Build_Node
          }

          echo "Node: " + BuildNode
        }
      }
      post {
        failure {
          script {
            sendSlackFail(env.lastAuthor, env.pkgVersion)
          }
        }
      }
    }

    stage('In Queue') {
      agent { label BuildNode }
      stages {
        stage('Preparation') {
          steps {
            script {
              deleteDir()
              checkout scm
              echo "Branch: " + env.BRANCH_NAME

              env.buildurl = BUILD_URL.replace('codejenkins.engineering.payfactors.net', env.jenkins_server)

              nodejs(nodeVersion) {
                def date = new Date()
                sdf = new SimpleDateFormat("yyMMddHHmm")
                dateVer = sdf.format(date)
                echo "datetime (yyMMddHHmm): " + dateVer

                def pkgVersionOrig = sh(returnStdout: true, script: 'node -pe "require(\'./package.json\').version"').trim()
                env.pkgVersion = pkgVersionOrig + "." + env.BUILD_NUMBER

                // Suffix according to branches.
                if (env.BRANCH_NAME == 'master') {
                  suffix = '-Production'
                  env.buildConfig = '--prod'

                } else if (env.BRANCH_NAME == 'develop') {
                  isAutoDeployBranch = true
                  suffix = '-Staging'
                  env.octoEnv = 'Staging'
                  env.buildConfig = '--configuration=staging'

                } else if (env.BRANCH_NAME ==~ /^hotfix\/.*/) {
                  suffix = '-Hotfix'
                  env.buildConfig = '--configuration=production'

                  // Including date so hotfix packages from diff branches will be sorted correctly from Octopus.
                  env.pkgVersion = pkgVersionOrig + "." + dateVer

                  branchShortName = env.BRANCH_NAME.replace('hotfix/','')
                  branchShortName = branchShortName.replaceAll('[^a-zA-Z0-9 ]','')
                  int subStrLen = branchShortName.length() < 13 ? branchShortName.length() : 13
                  verDetails = "-" + branchShortName.substring(0,subStrLen) + "." + env.BUILD_NUMBER

                } else if (env.BRANCH_NAME ==~ /^release\/.*/) {
                  suffix = '-RC'
                  env.buildConfig = '--prod'

                  // Including date so hotfix packages from diff branches will be sorted correctly from Octopus.
                  env.pkgVersion = pkgVersionOrig + "." + dateVer

                  branchShortName = env.BRANCH_NAME.replace('release/RC-','')
                  branchShortName = branchShortName.replace('release/','')
                  branchShortName = branchShortName.replaceAll('[^a-zA-Z0-9 ]','')
                  int subStrLen = branchShortName.length() < 13 ? branchShortName.length() : 13
                  verDetails = "-" + branchShortName.substring(0,subStrLen) + "." + env.BUILD_NUMBER

                // Generalized branch condition for team envs. Take this if there is a conflict.
                } else if (env.BRANCH_NAME ==~ /.*\/develop/) {
                  isAutoDeployBranch = true
                  teamName = env.BRANCH_NAME.split('/')[0]
                  suffix = "-${teamName}"
                  octoChannel = "${teamName}"
                  env.octoEnv = "${teamName}"
                  octoVerSuffix = "-${teamName.substring(0,3).toUpperCase()}"
                  env.buildConfig = '--configuration=staging'

                } else {
                  isPublishable = false
                  env.buildConfig = '--configuration=staging'

                  branchShortName = env.BRANCH_NAME.replaceAll('[^a-zA-Z0-9 ]','')
                  int subStrLen = branchShortName.length() < 13 ? branchShortName.length() : 13
                  verDetails = "-" + branchShortName.substring(0,subStrLen)
                }

                slackTitle = (isAutoDeployBranch) ? 'Build/Deploy' : 'Build'

                env.pkgFullName = pkgName + ".${env.pkgVersion}${suffix}${verDetails}"
                echo "Package Name: ${env.pkgFullName}.zip"

                // currentBuild.description = "Built on: ${env.NODE_NAME}"
                currentBuild.displayName = "#" + env.BUILD_NUMBER + " - " + env.pkgVersion + ": ${env.NODE_NAME}"

                changeLogOrig = getGitChangeLog()

                def lastAuthorEmail = sh (
                  script: "git show -s --format='%ae' HEAD",
                  returnStdout: true
                ).trim()

                env.lastAuthor = lastAuthorEmail.replaceAll('@.*','')

                echo "The last commit was written by ${env.lastAuthor} (${lastAuthorEmail})."

                changeLog = changeLogOrig.replaceAll('\\_','\\\\_')
                writeFile file: 'CHANGES', text: changeLog

                sh "git log -n 1 --pretty=format:'%H' > sha.txt"

                // Select slack channel
                configFileProvider([configFile(fileId: 'b6ff041b-b388-489a-b63b-e3389d76cea9', variable: 'slackChConfigFile')]) {
                  def slackChConfigRaw = readFile slackChConfigFile
                  def slackChConfig = new JsonSlurperClassic().parseText(slackChConfigRaw)
                  def branchShort = env.BRANCH_NAME.substring(0,4).toLowerCase()

                  slackCh = slackChConfig[branchShort]

                  echo "branchShort: ${branchShort}"

                  // f-build is dumping ground for the rest of branches.
                  if (slackCh == null) {
                    slackCh = "f-build"
                  }

                  echo "slackCh: ${slackCh}"
                }

                numOfApps = sh(returnStdout: true, script: 'ls -l apps | grep -c ^d').trim()
              }
            }

            stash includes: 'CHANGES', name: 'changes'
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage('npm ci') {
          steps {
            script {
              nodejs(nodeVersion) {
                sh 'npm ci'
              }
            }
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage('Unit Test') {
          steps {
            script {
              nodejs(nodeVersion) {
                // Sometimes jest cache causes Unit Test issue.
                sh """
                  if [ -d /tmp/jest_rt ]; then
                    echo "Clearing jest cache..."
                    rm -rf /tmp/jest_rt/*
                  fi
                """

                sh 'npm run test-report'
              }
            }
          }
          post {
//             always {
//               cobertura coberturaReportFile: 'output/coverage/jest/cobertura-coverage.xml', \
//                 maxNumberOfBuilds: 0, \
//                 sourceEncoding: 'ASCII', \
//                 zoomCoverageChart: false
//
//               junit 'output/coverage/junit/junit.xml'
//             }
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage('Build') {
          environment {
            KENDO_UI_LICENSE = credentials('KENDO_UI_LICENSE')
          }
          steps {
            parallel (
              Build: {
                script {
                  nodejs(nodeVersion) {
                    sh "KENDO_UI_LICENSE=${env.KENDO_UI_LICENSE}"
                    sh "npx kendo-ui-license activate"

                    sh "npx gulp sass"
                    
                    echo "Getting list of apps..."
                    sh 'ls apps > dirs'
                    sh """
                      cat dirs | time parallel -j-${env.Client_Build_Throttle} --halt soon,fail=1 'node_modules/.bin/ng build {} ${env.buildConfig} --progress=false && node_modules/.bin/gulp purgecss -a={} && echo "{} build complete"'
                    """
                    sh "cp apps/data-insights/reports.html dist/apps/data-insights/reports.html"
                    buildRunning = false
                  }
                }
              },
              BuildTimeTracker: {
                script {
                  timerCnt=0
                  alerted=false

                  currBuildDesc = currentBuild.description

                  while (buildRunning == true) {
                    sh 'sleep 30'

                    buildLogRaw = currentBuild.rawBuild.getLog(100000)
                    buildCnt = buildLogRaw.count { it.contains("build complete")}
                    // Need to subtract 'build complete' from the commandline.
                    currentBuild.description = currBuildDesc + "\n${buildCnt-1}/${numOfApps} apps built"

                    timerCnt++

                    // If build takes longer than 30 min, alert once.
                    if ( timerCnt > 60 && alerted==false ) {
                      echo '30m passed, alerting slack...'
                      slackSend channel: 't-devops', color: 'warning', message: ":warning: Client build time for <${env.buildurl}|*${env.BRANCH_NAME} #${env.BUILD_NUMBER}*> on ${env.NODE_NAME} has exceeded 30m. Please check."
                      alerted=true
                    }
                  }
                  echo 'buildRunning is now false'
                }
              }, failFast: true
            )
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage('Package') {
          steps {
            script {
              dir ("dist/apps") {
                sh """
                  cp ../../sha.txt .
                  cp ../../CHANGES .
                  zip -r ../../${env.pkgFullName}.zip *
                """
              }
            }
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage('Publish') {
          when { expression { return isPublishable }}
          environment {
            apikey = credentials('octoapikey')
          }
          steps {
            script {
              sh """
                curl -X POST ${env.octopus_server}/api/packages/raw -H "X-Octopus-ApiKey:${env.apikey}" -F "data=@${env.pkgFullName}.zip" --fail
              """
            }
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }

        stage ('Deploy') {
          agent { label 'windows-deploy' }
          when { expression { return isAutoDeployBranch}}
          environment {
            apikey = credentials('octoapikey')
          }
          steps {
            unstash 'changes'

            withEnv(["PATH+OCTO=${tool name: 'OctopusTools.6.12.0', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'}"]) {
              bat """@echo off
                octo create-release ^
                --server ${env.octopus_server}/ ^
                --apiKey ${env.apikey} ^
                --project "${octoProject}" ^
                --channel "${octoChannel}" ^
                --Version ${env.pkgVersion + octoVerSuffix} ^
                --packageversion ${env.pkgVersion}${suffix}${verDetails} ^
                --deployto "${env.octoEnv}" ^
                --guidedfailure=false ^
                --releasenotesfile "CHANGES" ^
                --deploymenttimeout=00:45:00 ^
                --progress ^
                --waitfordeployment
              """
            }
          }
          post {
            failure {
              script {
                sendSlackFail(env.lastAuthor, env.pkgVersion)
              }
            }
          }
        }
      }
      post {
        failure {
          script {
            sendSlackFail(env.lastAuthor, env.pkgVersion)
          }
        }
      }
    }
  }
  post {
    success {
      script {
        fullDur = (currentBuild.durationString).replace(' and counting',"")
        slackSend channel: slackCh, color: 'good', message: "<${env.buildurl}|*${slackTitle} Success*> - ${fullDur}\n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${env.BUILD_NUMBER} - ${env.pkgVersion} \nAuthor: ${env.lastAuthor}"
      }
    }
  }
}

@NonCPS
def getGitChangeLog() {
  def gitchangelog = ''
  def changeLogSets = null
  def lastAuthor = null
  def entries = null
  def entry = null
  def files = null
  def file = null

  changeLogSets = currentBuild.changeSets
  echo "changeLogSets.size(): ${changeLogSets.size()}"

  if (changeLogSets != null) {
    for (int i = 0; i < changeLogSets.size(); i++) {
      entries = changeLogSets[i].items

      for (int j = 0; j < entries.length; j++) {
        entry = entries[j]
        gitchangelog = gitchangelog + "<b>${entry.commitId}</b> by <b>${entry.author}</b> on ${new Date(entry.timestamp)}:<br/>${entry.msg}<br/>"

        files = new ArrayList(entry.affectedFiles)
        for (int k = 0; k < files.size(); k++) {
          file = files[k]
          gitchangelog = gitchangelog + "&nbsp;&nbsp;[${file.editType.name} - ${file.path}]<br/>"
        }
      }
    }
  }
  return gitchangelog
}

def sendSlackFail(gitAuthor, pkgVersion) {
  fullDur = (currentBuild.durationString).replace(' and counting',"")
  slackSend channel: slackCh, color: 'danger', message: "<${env.buildurl}|*${slackTitle} Failure*> (Stage: ${STAGE_NAME}) - ${fullDur}\n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${env.BUILD_NUMBER} - ${pkgVersion} \nAuthor: ${gitAuthor}"
}
