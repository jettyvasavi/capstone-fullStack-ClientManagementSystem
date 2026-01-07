pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'jettyvasavi'
        BACKEND_IMAGE = 'corp-backend'
        FRONTEND_IMAGE = 'corp-frontend'
        EC2_IP = '13.239.239.173'
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/your-org/your-repo.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('Client Management System/Client-Management-System') {
                    sh 'docker build -t jettyvasavi/corp-backend:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend/corp-banking-cms') {
                    sh 'docker build -t jettyvasavi/corp-frontend:latest .'
                }
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push jettyvasavi/corp-backend:latest
                    docker push jettyvasavi/corp-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh '''
                    ssh ubuntu@$EC2_IP "
                      cd /home/ubuntu &&
                      docker-compose pull &&
                      docker-compose up -d
                    "
                    '''
                }
            }
        }
    }
}
