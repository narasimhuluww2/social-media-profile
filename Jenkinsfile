pipeline {
  agent any
  environment {
     IMAGE_NAME = "pistionhead/social-media-ui"
     TAG = "latest"
     PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
  }
  stages {
      stage('CLONING REPO') {
         steps {
              echo "cloning repo.....📦📦📦"
              git branch: 'main', url: 'https://github.com/VARUNx96/SOCIAL_MEDIA_PROFILE_UI.git' 
         }
      }
      stage('BUILD IMAGE') {
         steps {
              echo "building docker image.....🧱🧱🧱"
              sh 'docker build -t $IMAGE_NAME:$TAG .'
         }
      }
      stage('DOCKER HUB LOGIN') {
         steps {
              withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
              usernameVariable: 'USER',
              passwordVariable: 'PASS')]) {
                    echo "logging into docker...🐳🐳🐳"
                    sh 'docker login -u $USER -p $PASS'
                    }
         }
      }
      stage('PUSH DOCKER IMAGE'){
         steps{
                echo "pushing image...🫸🫸🫸"
                sh 'docker push $IMAGE_NAME:$TAG'
         }
      }
      stage('Run Application') {
         steps {
           sh '''
             docker compose down || true
             docker compose up -d --build
           '''
           echo "CHECK: LOCALHOST:3000"
         }
      }
  }
}
