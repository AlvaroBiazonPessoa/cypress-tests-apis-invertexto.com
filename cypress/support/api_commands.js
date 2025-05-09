Cypress.Commands.add('api_returnZipCodeData', (method, url, failOnStatusCode, authorization) => {
    cy.api({
        method: method,
        url: url,
        failOnStatusCode: failOnStatusCode,
        headers: {
            Authorization: authorization
        }
    })
})

Cypress.Commands.add('api_makeRequestWithoutAuthentication', (method, url, failOnStatusCode) => {
    cy.api({
        method: method,
        url: url,
        failOnStatusCode: failOnStatusCode
    })
})