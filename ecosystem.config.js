module.exports = {
  apps: [{
    name: 'lst',
    script: 'yarn',
    args: 'start'
  }],

  deploy: {
    production: {
      user: 'lst',
      host: 'philippec.me',
      ref: 'origin/master',
      repo: 'git@github.com:Pckool/lst.git',
      path: '/var/web',
      'pre-deploy-local': '',
      'post-deploy': 'yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': 'mkdir lst && cd lst/'
    }
  }
};
