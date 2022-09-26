module.exports = {
  apps: [
    {
      name: 'express-test',
      script: 'yarn start',
      instances: 1, // 0 means making process the number of core.
    },
  ],
};
