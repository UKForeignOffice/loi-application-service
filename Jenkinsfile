  node {
       stage 'Step 1: Test'
           build job: 'Service Testing/Unit testing/Application Service Test', parameters: [[$class: 'StringParameterValue', name: 'Branch', value: '*/AddressMapping']]
        stage 'Step 2: Deploy to Integration'
             build job: 'Service Deployment/Deploy to Integration', parameters: [[$class: 'StringParameterValue', name: 'Repo', value: 'https://github.com/UKForeignOffice/loi-application-service.git/'], [$class: 'StringParameterValue', name: 'Branch', value: 'AddressMapping'], [$class: 'StringParameterValue', name: 'Tag', value: 'application-service-int'], [$class: 'StringParameterValue', name: 'Container', value: 'application-service']]
}