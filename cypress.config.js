const { defineConfig } = require("cypress")
const fs = require("fs")

function getEnvConfig(envName) {
  const path = `./cypress.env.${envName}.json`
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf8"))
  } else {
    console.warn(`Arquivo de ambiente '${path}' não encontrado. Usando config padrão.`)
    return {}
  }
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config)
      const envName = config.env.configFile || "prod"
      const customEnv = getEnvConfig(envName)
      config.env = { ...config.env, ...customEnv }
      return config
    },
  },
})