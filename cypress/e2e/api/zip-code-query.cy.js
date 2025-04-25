describe('ZIP Code Query API', () => {

    const endpointCep = 'cep/' 
    const httpMethodGet = 'GET'
    const httpStatusUnauthorized = 401

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const unexpectedHttpMethod = 'POST'
        const failOnStatusCode = false
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        const httpStatusNotAllowed = 405
        cy.api_returnZipCodeData(unexpectedHttpMethod, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
            })
    })

    it('Return ZIP code data without sending ZIP code parameter', () => {
        const failOnStatusCode = false
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = null
        const url = endpointCep + zipCode
        const httpStatusUnprocessableEntity = 422
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
            })
    })

    it('Returns ZIP code data without authentication', () => {
        const failOnStatusCode = false
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        cy.api_returnZipCodeDataWithoutAuthentication(httpMethodGet, url, failOnStatusCode)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
            })
    })

    it('Returns ZIP code data with an invalid token', () => {
        const failOnStatusCode = false
        const invalidApiToken = Cypress.env('INVALID_TOKEN')
        const authorization = `Bearer ${invalidApiToken}`
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
            })
    })

})