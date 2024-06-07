module.exports = {
  launch: {
    headless: true, // Ensures Puppeteer runs in headless mode
    args: [
      '--no-sandbox', // Bypass the sandbox for new browser processes,
      '--disable-setuid-sandbox', // Disable the setuid sandbox (more secure),
      '--disable-dev-shm-usage', // Overcome limited resource problems
      '--disable-accelerated-2d-canvas', // Disable hardware acceleration
      '--no-first-run',
      '--no-zygote',
      '--single-process', // Run Chromium in a single process mode
      '--disable-gpu' // Disable GPU hardware acceleration
    ]
  },
  browserContext: 'default',
  server: {
    command: 'node server.js', // Assuming you might have a server running for tests
    port: 4444,
    launchTimeout: 10000, // Timeout for launching the server
    debug: true,
  }
};