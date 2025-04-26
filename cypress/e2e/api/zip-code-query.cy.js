describe('ZIP Code Query API', () => {

    const endpointCep = 'cep/' 
    const httpMethodGet = 'GET'
    let failOnStatusCode = false
    const httpStatusUnauthorized = 401
    const statusTextUnauthorized = 'Unauthorized'
    const messageObject = 'message'
    const massageUnauthenticated = 'Unauthenticated.'
    const httpStatusUnprocessableEntity = 422
    const statusTextUnprocessableEntity = 'Unprocessable Entity'
    const messageUnprocessableEntity = 'O campo cep é obrigatório.'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const unexpectedHttpMethod = 'POST'
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = '09691000'
        const url = endpointCep + zipCode
        const httpStatusNotAllowed = 405
        const statusTextNotAllowed = 'Method Not Allowed'
        cy.api_returnZipCodeData(unexpectedHttpMethod, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
                expect(response.statusText).to.eq(statusTextNotAllowed)
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
        const statusTextForbidden = 'Forbidden'
        const messageForbidden = 'Este token não pode chamar a API cep.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusForbidden)
                expect(response.statusText).to.eq(statusTextForbidden)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(messageForbidden)
            })
    })

    /**
     * Observation: Check if the HTTP status code should be 400 instead of 422
     */
    it('Return ZIP code data without sending ZIP code parameter', () => {
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = null
        const url = endpointCep + zipCode
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(messageUnprocessableEntity)
            })
    })

})