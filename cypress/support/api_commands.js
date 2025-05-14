Cypress.Commands.add('api_makeRequestWithPathParameter', (method, url, failOnStatusCode, authorization) => {
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

Cypress.Commands.add('api_makeRequestWithQueryParameter', (method, url, failOnStatusCode, authorization, queryParameter) => {
    cy.api({
        method: method,
        url: url,
        failOnStatusCode: failOnStatusCode,
        headers: {
            Authorization: authorization
        },
        qs: queryParameter
    })
})