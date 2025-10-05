module.exports = {
  apps: [
    {
      name: 'chemistry-lab',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 1000,
      max_restarts: 5
    }
  ]
}