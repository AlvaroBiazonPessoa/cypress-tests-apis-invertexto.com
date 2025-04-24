Cypress.Commands.add('api_returnZipCodeData', (method, url, failOnStatusCode, authorization) => {
    cy.request({
        method: method,
        url: url,
        failOnStatusCode: failOnStatusCode,
        headers: {
            Authorization: authorization
        },
    })
})