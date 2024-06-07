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
    ],
    slowMo: 25 // Retain slowMo for consistent behavior during testing
  },
  browserContext: 'default'
};