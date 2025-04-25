describe('ZIP Code Query API', () => {

    const httpMethodGet = 'GET'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const unexpectedHttpMethod = 'POST'
        const failOnStatusCode = false
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = '09691000'
        const allUrl = `cep/${zipCode}`
        const httpStatusNotAllowed = 405
        cy.api_returnZipCodeData(unexpectedHttpMethod, allUrl, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
            })
    })

    it('Return ZIP code data without sending ZIP code parameter', () => {
        const failOnStatusCode = false
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = null
        const allUrl = `cep/${zipCode}`
        const httpStatusUnprocessableEntity = 422
        cy.api_returnZipCodeData(httpMethodGet, allUrl, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
            })
    })

    it('Returns ZIP code data without authentication', () => {
        const failOnStatusCode = false
        const zipCode = '09691000'
        const allUrl = `cep/${zipCode}`
        const httpStatusUnauthorized = 401
        cy.api_returnZipCodeDataWithoutAuthentication(httpMethodGet, allUrl, failOnStatusCode)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
            })
    })

    it('Returns zip code data with an invalid token', () => {
        const failOnStatusCode = false
        const invalidApiToken = Cypress.env('INVALID_TOKEN')
        const authorization = `Bearer ${invalidApiToken}`
        const zipCode = '09691000'
        const allUrl = `cep/${zipCode}`
        const httpStatusUnauthorized = 401
        cy.api_returnZipCodeData(httpMethodGet, allUrl, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
            })
    })

})