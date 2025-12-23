module.exports = {
  apps: [
    {
      name: "planetbeauty-app",
      script: "npm",
      args: "start",
      cwd: "/path/to/your/app", // Update this path
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
