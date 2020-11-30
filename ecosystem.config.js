module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'app.js',
    watch: '.'
  }],

  deploy: {
    production: {
      user: 'portfilio',
      host: 'philippec.me',
      ref: 'origin/master',
      repo: 'git@github.com:Pckool/lst.git',
      path: '/web',
      'pre-deploy-local': '',
      'post-deploy': 'yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
