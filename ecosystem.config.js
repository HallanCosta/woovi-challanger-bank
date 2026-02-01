module.exports = {
  apps: [
    {
      name: "bank",
      script: "pnpm",
      args: "start",
      cwd: "./",
      exec_mode: "cluster",
      instances: "1",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
