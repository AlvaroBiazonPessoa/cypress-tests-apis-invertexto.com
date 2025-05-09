Cypress.Commands.add('api_makeRequestWithPathParameter', (method, endpointWithPathParameter, failOnStatusCode, authorization) => {
    cy.api({
        method: method,
        url: endpointWithPathParameter,
        failOnStatusCode: failOnStatusCode,
        headers: {
            Authorization: authorization
        }
    })
})

Cypress.Commands.add('api_makeRequestWithoutAuthentication', (method, endpoint, failOnStatusCode) => {
    cy.api({
        method: method,
        url: endpoint,
        failOnStatusCode: failOnStatusCode
    })
})

Cypress.Commands.add('api_makeRequestWithQueryParameter', (method, endpoint, failOnStatusCode, authorization, queryParameter) => {
    cy.api({
        method: method,
        url: endpoint,
        failOnStatusCode: failOnStatusCode,
        headers: {
            Authorization: authorization
        },
        qs: queryParameter
    })
})