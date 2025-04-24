const { defineConfig } = require("cypress");

module.exports = defineConfig({
  baseUrl: 'https://api.invertexto.com/v1/',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
