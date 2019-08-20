import hudson.model.*
import jenkins.model.*
import groovy.io.FileType
import groovy.json.JsonSlurper

nodeVersion = '10.15.0'
pkgName = 'PayFactorsClient'

octoProject = 'Client-J'
octoChannel = 'Default'
octoVerSuffix = ''

slackCh = 'f-build'
slackTitle = 'Build'

suffix = null

isPublishable = true
isAutoDeployBranch = false

pipeline {
  agent { label 'ubuntu-node1' }

  options {
    buildDiscarder(logRotator(numToKeepStr:'20'))
    disableConcurrentBuilds()
  }

  stages {
    stage('Preparation') {
      steps {
        script {
          deleteDir()
          checkout scm
          echo "Branch: " + env.BRANCH_NAME

          env.buildurl = BUILD_URL.replace('codejenkins.engineering.payfactors.net', env.jenkins_server)

          nodejs(nodeVersion) {
            env.pkgVersion = sh(returnStdout: true, script: 'node -pe "require(\'./package.json\').version"').trim()
            env.pkgVersion = env.pkgVersion + "." + env.BUILD_NUMBER

            // Suffix according to branches.
            if (env.BRANCH_NAME == 'master') {
              suffix = 'Production'
              env.buildConfig = '--prod'
            } else if (env.BRANCH_NAME == 'develop') {
              isAutoDeployBranch = true
              suffix = 'Staging'
              env.buildConfig = '--configuration=staging'
            } else if (env.BRANCH_NAME ==~ /^hotfix\/.*/) {
              suffix = 'Hotfix'
              env.buildConfig = '--configuration=production'
            } else if (env.BRANCH_NAME ==~ /^release\/.*/) {
              suffix = 'RC'
              env.buildConfig = '--prod'
            } else if (env.BRANCH_NAME == 'Normandy/develop') {
              isAutoDeployBranch = true
              suffix = 'Normandy'
              octoChannel = 'Normandy'
              octoVerSuffix = '-NM'
              env.buildConfig = '--configuration=staging'
            } else {
              isPublishable = false
              suffix = env.BRANCH_NAME.substring(0,3)
              env.buildConfig = '--configuration=staging'
            }      
            
            slackTitle = (isAutoDeployBranch) ? 'Build/Deploy' : 'Build'

            env.pkgFullName = pkgName + "." + suffix + "-J." + env.pkgVersion
            echo env.pkgFullName

            currentBuild.description = "Built on: ${env.NODE_NAME}"
            currentBuild.displayName = env.pkgVersion

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
              def slackChConfig = new JsonSlurper().parseText(slackChConfigRaw)
              def branchShort = env.BRANCH_NAME.substring(0,4).toLowerCase()

              slackCh = slackChConfig[branchShort]

              echo "branchShort: ${branchShort}"

              // f-build is dumping ground for the rest of branches.
              if (slackCh == null) {
                slackCh = "f-build"
              } 
              
              echo "slackCh: ${slackCh}"
            }

            sh 'npm install'
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

    stage('Unit Test') {
      steps {
        script {
          nodejs(nodeVersion) {
            sh 'npm run test-report'
          }
        }
      }
      post {
        always {
          cobertura coberturaReportFile: 'output/coverage/jest/cobertura-coverage.xml', \
            conditionalCoverageTargets: '70, 0, 0', \
            lineCoverageTargets: '80, 0, 0', \
            maxNumberOfBuilds: 0, \
            methodCoverageTargets: '80, 0, 0', \
            sourceEncoding: 'ASCII', \
            zoomCoverageChart: false

          junit 'output/coverage/junit/junit.xml'
        }
        failure {
          script { 
            sendSlackFail(env.changeAuthorList)
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          nodejs(nodeVersion) {
            echo "Getting list of apps..."
            sh 'ls -I "smallbiz" apps > dirs'
            sh """
              cat dirs | time parallel -j-3 --halt soon,fail=1 'node_modules/.bin/ng build {} ${env.buildConfig} --progress=false && echo "{} build complete"'
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
            curl -X POST ${env.octopus_server}/api/packages/raw -H "X-Octopus-ApiKey: ${env.apikey}" -F "data=@${env.pkgFullName}.zip"
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
            --project ${octoProject} ^
            --channel ${octoChannel} ^
            --Version ${env.pkgVersion + octoVerSuffix} ^
            --packageversion ${env.pkgVersion} ^
            --deployto "Staging" ^
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
    success {
      script { 
        fullDur = (currentBuild.durationString).replace(' and counting',"")
        slackSend channel: slackCh, color: 'good', message: "*${slackTitle} Success* \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${env.pkgVersion} \nElapsed: ${fullDur} \nAuthor: ${env.lastAuthor} \n<${env.buildurl}|Build Log>"
      }
    }
    // aborted {
    //   script { 
    //     fullDur = (currentBuild.durationString).replace(' and counting',"")
    //     slackSend channel: slackCh, color: 'danger', message: "*${slackTitle} Aborted* (Stage: ${STAGE_NAME}) \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${env.pkgVersion} \nElapsed: ${fullDur} \nAuthor: ${env.lastAuthor} \n<${env.buildurl}console|Build Log>"
    //   }
    // }
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
  slackSend channel: slackCh, color: 'danger', message: "*${slackTitle} Failure* (Stage: ${STAGE_NAME}) \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${pkgVersion} \nElapsed: ${fullDur} \nAuthor: ${gitAuthor} \n<${env.buildurl}console|Build Log>"
}