module.exports = {
  apps: [
    {
      name: 'app',
      script: 'yarn start',
      instances: 0, // 0 means making process the number of core.
      exec_mode: 'cluster',
    },
  ],
};
