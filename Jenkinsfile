// vim: et:ts=4:sw=4:ft=groovy
def utils = new io.jetstack.Utils()
node('docker'){
    catchError {
        def imageName = 'eu.gcr.io/jetstack-gke/jetstack-website'
        def imageTag = "jenkins-${env.BUILD_NUMBER}"

        utils.jenkinsSlack('start')

        stage 'Checkout source code'
        checkout scm

        stage 'Build docker image'
        sh "docker build -t ${imageName}:${imageTag} ."

        stage 'Push image to registry'
        withCredentials([[$class: 'FileBinding', credentialsId: '72d41e8b-bb51-40aa-afcd-c48e6ff0dbdb', variable: 'DOCKER_CONFIG_FILE']]) {
            try {

                // prepare docker auth
                sh 'mkdir -p _temp_dockercfg'
                sh 'ln -sf \$DOCKER_CONFIG_FILE _temp_dockercfg/config.json'

                // push
                sh "docker --config=_temp_dockercfg push ${imageName}:${imageTag}"
                currentBuild.description = "${imageName}:${imageTag}\ngit_commit=${utils.gitCommit().take(8)}"
            } finally {
                sh 'rm -rf _temp_dockercfg'
            }
        }

        stage 'Deploy to kubernetes cluster dev'
        withCredentials([[$class: 'FileBinding', credentialsId: 'f6924377-3f1f-49ce-a796-ec3435437e1a', variable: 'KUBECTL_CONFIG']]) {
            sh "kubectl --kubeconfig=\$KUBECTL_CONFIG --namespace=blog patch deployment blog-dev -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"blog\",\"image\":\"${imageName}:${imageTag}\"}]}}}}'"
        }

        input message: "Should I deploy to prod?"
        stage 'Deploy to kubernetes cluster prod'
        withCredentials([[$class: 'FileBinding', credentialsId: 'f6924377-3f1f-49ce-a796-ec3435437e1a', variable: 'KUBECTL_CONFIG']]) {
            sh "kubectl --kubeconfig=\$KUBECTL_CONFIG --namespace=blog patch deployment blog-prod -p '{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"blog\",\"image\":\"${imageName}:${imageTag}\"}]}}}}'"
        }
    }
    utils.jenkinsSlack('finish')
    step([$class: 'Mailer', recipients: 'christian@jetstack.io', notifyEveryUnstableBuild: true])
}
