module.exports = {
  apps : [
    {
      name      : 'application',
      script    : "app.js",
      arg       : "3000",
      instances : "max",
      exec_mode : "cluster"
    }
  ]
}
