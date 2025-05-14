# **CYPRESS TESTS APIS INVERTETEXTO.COM**
Repository contains tests for [invertexto.com](https://api.invertexto.com/) APIs.

## 🛠 Built with 
* **Cypress** - Testing framework
* **JavaScript** - Programming language

## 📋 Prerequisites
* Node.js
* npm

## ⚙ How to configure
```sh
npm install
```

## ▶ How to run
Test execution environments: **dev, qa, hml,** and **prod**

Interactive mode:
```sh
npm run cy.interactive.<environment>
```

Headless mode:
```sh
npm run cy.headless.<environment>
```

## 👀 Observations
To run the tests, you must create a file for each environment, for example:**`cypress.env.dev.json`**, based on the file **`cypress.env.environment.example.json`**<br>
Also, make sure to generate the API tokens at [⚙ invertexto.com | API](https://api.invertexto.com/)
