describe('ZIP Code Query API', () => {

    const endpointCep = 'cep/' 
    const httpMethodGet = 'GET'
    let failOnStatusCode = false
    const httpStatusUnauthorized = 401
    const statusTextUnauthorized = 'Unauthorized'
    const messageObject = 'message'
    const massageUnauthenticated = 'Unauthenticated.'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const unexpectedHttpMethod = 'POST'
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

    it('Returns ZIP code data without authentication', () => {
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        cy.api_returnZipCodeDataWithoutAuthentication(httpMethodGet, url, failOnStatusCode)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
                expect(response.statusText).to.eq(statusTextUnauthorized)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(massageUnauthenticated)
            })
    })

    it('Returns ZIP code data with an invalid token', () => {
        const invalidApiToken = Cypress.env('INVALID_TOKEN')
        const authorization = `Bearer ${invalidApiToken}`
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
                expect(response.statusText).to.eq(statusTextUnauthorized)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(massageUnauthenticated)
            })
    })

    it('Returns ZIP code data without authorization', () => {
        const apiToken = Cypress.env('TOKEN_ONLY_FOR_THE_QR_CODE_GENERATOR_API')
        const authorization = `Bearer ${apiToken}`
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        const httpStatusForbidden = 403
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusForbidden)
            })
    })

    it('Return ZIP code data without sending ZIP code parameter', () => {
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

})