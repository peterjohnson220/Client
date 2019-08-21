import groovy.io.FileType

nodeVersion = '10.15.0'
pkgName = 'PayFactorsClient'

octoProject = 'Client-J'
octoChannel = 'Default'

slackCh = 'jenkins-test'

buildConfig = null
pkgFullName = null
pkgVersion = null

isAutoDeployBranch = (env.BRANCH_NAME == 'develop')
isPublishable = (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME ==~ /^hotfix\/.*/ || env.BRANCH_NAME ==~ /^release\/.*/) ? true : false

pipeline {
  agent { label 'ubuntu-node1' }

  options {
    buildDiscarder(logRotator(numToKeepStr:'20'))
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES', activity: true)
  }

  stages {
    stage('Preparation') {
      steps {
        script {
          deleteDir()
          checkout scm
          echo "Branch: " + env.BRANCH_NAME

          nodejs(nodeVersion) {
            pkgVersion = sh(returnStdout: true, script: 'node -pe "require(\'./package.json\').version"').trim()
            pkgVersion = pkgVersion + "." + env.BUILD_NUMBER

            // Suffix according to branches.
            if (env.BRANCH_NAME == 'master') {
              suffix = 'Production'
              buildConfig = '--prod'
            } else if (env.BRANCH_NAME == 'develop') {
              suffix = 'Staging'
              buildConfig = '--configuration=staging'
              env.octoEnv = 'Staging'
            } else if (env.BRANCH_NAME ==~ /^hotfix\/.*/) {
              suffix = 'Hotfix'
              buildConfig = '--configuration=production'
            } else if (env.BRANCH_NAME ==~ /^release\/.*/) {
              suffix = 'RC'
              buildConfig = '--prod'
            } else if (env.BRANCH_NAME == 'Normandy/develop') {
              suffix = 'Normandy'
              buildConfig = '--configuration=staging'
              octoChannel = 'Normandy'
              env.octoEnv = 'Normandy'
            } else {
              suffix = env.BRANCH_NAME.substring(0,3)
              buildConfig = '--configuration=staging'
            }      
            
            pkgFullName = pkgName + "." + suffix + "-J." + pkgVersion
            echo pkgFullName

            currentBuild.description = "Built on: ${env.NODE_NAME}"
            currentBuild.displayName = pkgVersion

            changeLog = getGitChangeLog().replaceAll('\\_','\\\\_')
            writeFile file: 'CHANGES', text: changeLog

            sh 'npm install'
          }
        }
        
        stash includes: 'CHANGES', name: 'changes'
      }
      post {
        failure {
          script { 
            sendSlackFail()
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
            sendSlackFail()
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
              cat dirs | time parallel -j-2 --halt soon,fail=1 'node_modules/.bin/ng build {} ${buildConfig} --progress=false && echo "{} build complete"'
            """
          }
        }
      }
      post {
        failure {
          script { 
            sendSlackFail()
          }
        }
      }
    }

    stage('Package') {
      steps {
        script {
          dir ("dist/apps") {
            sh """
              cp ../../CHANGES .
              zip -r ../../${pkgFullName}.zip *
            """
          }
        }
      }
      post {
        failure {
          script { 
            sendSlackFail()
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
            curl -X POST ${env.octopus_server}/api/packages/raw -H "X-Octopus-ApiKey: ${env.apikey}" -F "data=@${pkgFullName}.zip"
          """
        }
      }
      post {
        failure {
          script { 
            sendSlackFail()
          }
        }
      }
    }

    stage ('Deploy') {
      agent { label 'windows' }
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
            --Version ${pkgVersion} ^
            --packageversion ${pkgVersion} ^
            --deployto ${env.octoEnv} ^
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
            sendSlackFail()
          }
        }
      }
    }
  }
  post {
    success {
      script { 
        fullDur = (currentBuild.durationString).replace(' and counting',"")
        slackSend channel: slackCh, color: 'good', message: "*Build/Deploy Success* \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${pkgVersion} \nElapsed: ${fullDur} \n<${BUILD_URL}|Build Log>"
      }
    }
    // aborted {
    //   script { 
    //     fullDur = (currentBuild.durationString).replace(' and counting',"")
    //     slackSend channel: slackCh, color: 'danger', message: "*Build Aborted* (Stage: ${STAGE_NAME}) \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${pkgVersion} \nElapsed: ${fullDur} \n<${BUILD_URL}console|Build Log>"
    //   }
    // }
  }
}

@NonCPS
def getGitChangeLog() {
  def gitchangelog = ''
  def changeLogSets = null
  def entries = null
  def entry = null
  def files = null
  def file = null

  changeLogSets = currentBuild.changeSets

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

def sendSlackFail() { 
  fullDur = (currentBuild.durationString).replace(' and counting',"")
  slackSend channel: slackCh, color: 'danger', message: "*Build Failure* (Stage: ${STAGE_NAME}) \n*${env.JOB_NAME.replaceAll('%2F','/')}* - #${pkgVersion} \nElapsed: ${fullDur} \n<${BUILD_URL}console|Build Log>"
}