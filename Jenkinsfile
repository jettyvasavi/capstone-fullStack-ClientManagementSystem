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
                git 'https://github.com/jettyvasavi/capstone-fullStack-ClientManagementSystem.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                // Escape spaces in folder names
                dir('ClientManagementSystem/Client-Management-System') {
                    sh 'docker build -t $DOCKERHUB_USER/$BACKEND_IMAGE:latest .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend/corp-banking-cms') {
                    sh 'docker build -t $DOCKERHUB_USER/$FRONTEND_IMAGE:latest .'
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
                        docker push $DOCKERHUB_USER/$BACKEND_IMAGE:latest
                        docker push $DOCKERHUB_USER/$FRONTEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP '
                            cd /home/ubuntu &&
                            docker-compose pull &&
                            docker-compose up -d
                        '
                    """
                }
            }
        }
    }
}

