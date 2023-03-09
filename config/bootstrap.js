/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */


module.exports.bootstrap = function(cb) {

  processStartUpVars()
  compileSass()
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb()

  function processStartUpVars () {
    if(process.argv[2]){
      var port = parseInt(process.argv[2]);
      if (!isNaN(port)) {
        sails.config.port = port;
      }
    }

    for (let i = 0; i < process.argv.length; i++) {
      if (process.argv[i].startsWith('--hookTimeout=')) {
        let hookTimeout = parseInt(process.argv[i].substring(14));
        if (!isNaN(hookTimeout)) {
          sails.config.hookTimeout = hookTimeout;
        }
      }
    }
  }

  function compileSass () {
    const sass = require('sass');
    const fs = require('fs');
    const srcPath = 'assets/styles/importer.scss';
    const destPath = 'assets/styles/importer.css';

    sass.render({
      file: srcPath,
      outFile: destPath,
      outputStyle: 'compressed',
      quiet: true
    }, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      fs.writeFile(destPath, result.css, (writeError) => {
        if (writeError) {
          console.error(writeError);
          return;
        }
        console.log(`Sass compiled successfully from ${srcPath} to ${destPath}`);
      });
    });
  }

};
