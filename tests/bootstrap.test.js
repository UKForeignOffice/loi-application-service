var Sails = require('sails'),
    sails;
var cp = require('child_process');
var http = require('http');

before(function (done) {
    // Increase the Mocha timeout so that Sails has enough time to lift.
    this.timeout(60000);

    //restore database before each test
    //windows will not set this NODE_ENV variable
    //so those users must manually restore and remove the test database
    //run this manuually before the tests:
    //psql -U postgres -f tests/files/Drop_FCO_LOI_User_Test.sql
    //then
    //psql -U postgres -f tests/files/FCO_LOI_User_Test.sql
    // windows
    // 'C:\Program Files\PostgreSQL\9.4\bin\psql.exe'
    if (process.env.NODE_ENV === 'test') {
        var config = require('../config/environment-variables');
        var psqlRestore =
            'PGPASSWORD=' +
            config.pgpassword +
            ' psql -U postgres -f tests/files/FCO_LOI_Service_Test.sql';
        cp.exec(psqlRestore, function (err, stdout, stderr) {
            if (stderr) {
                console.log(stderr);
            }
        });
    }
    Sails.lift(
        {
            log: {
                level: 'silent',
              },
            // configuration for testing purposes
            hooks: {
                //"sequelize": require('../'),
                // Load the hook
                orm: false,
                pubsub: false,
                session: false,
                // Skip grunt (unless your hook uses it)
                grunt: false,
            },
        },
        function (err, server) {
            sails = server;
            if (err) return done(err);
            // here you can load fixtures, etc.
            done(err, sails);
        }
    );
});

after(function (done) {
    // here you can clear fixtures, etc.
    Sails.lower(done);
});
