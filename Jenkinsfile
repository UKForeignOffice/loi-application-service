  node {
       stage 'Step 1: Test'
           build job: 'Service Testing/Unit testing/Application Service Test', parameters: [[$class: 'StringParameterValue', name: 'Branch', value: '*/Pre-Production']]
   stage 'Step 2: Create Production Image'
          build job:  'Service Deployment/Production Deployment/Create Production Images', parameters: [[$class: 'StringParameterValue', name: 'Repo', value: 'git@github-project-application:UKForeignOffice/loi-application-service.git'], [$class: 'StringParameterValue', name: 'Branch', value: 'master'], [$class: 'StringParameterValue', name: 'Tag', value: 'application-service-prod'], [$class: 'StringParameterValue', name: 'Container', value: 'application-service']]
     }
