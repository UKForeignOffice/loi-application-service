// Install pm2:
//   ```
// npm install pm2@latest -g
// ```
//
// Start all the services (they will take a few seconds to start up):
//   ```
// pm2 start
// ```
//
// Then hit https://localhost:4000/my-account/bookings/upcoming
//
//   Not working? You can see logs for all of the services with:
//
// ```
// pm2 logs
// ```
//
// or any individual service with:
//
// ```
// pm2 logs <id>
// ```
//
// Where <id> is the id of the service (run `pm2 ls` to list all services).

module.exports = {
    apps: [
        {
            name: 'loi-application-service',
            script: 'npm',
            args: 'run start',
        },
        {
            name: 'loi-user-service',
            script: 'npm',
            args: 'run start',
            cwd: '../loi-user-service',
        },
        {
            name: 'loi-submission-service',
            script: 'npm',
            args: 'run start dev-server',
            cwd: '../loi-submission-service',
        },
        {
            name: 'loi-notification-service',
            script: 'node',
            args: 'server.js 1234',
            cwd: '../loi-notification-service',
        },
        {
            name: 'loi-address-service',
            script: 'node',
            args: 'server.js 7878',
            cwd: '../loi-address-service',
        },
        {
            name: 'loi-payment-service',
            script: 'npm',
            args: 'run start',
            cwd: '../loi-payment-service',
        },
    ],
};
