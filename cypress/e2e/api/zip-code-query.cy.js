describe('ZIP Code Query API', () => {

    const endpointCep = 'cep/' 
    const httpMethodGet = 'GET'
    let failOnStatusCode = false
    const zipCodeQueryApiToken = Cypress.env('ZIP_CODE_QUERY_API_TOKEN')
    const authorizationForTheZipCodeQueryApi = `Bearer ${zipCodeQueryApiToken}`
    const httpStatusUnauthorized = 401
    const statusTextUnauthorized = 'Unauthorized'
    const messageObject = 'message'
    const massageUnauthenticated = 'Unauthenticated.'
    const httpStatusUnprocessableEntity = 422
    const statusTextUnprocessableEntity = 'Unprocessable Entity'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const HttpMethodPost = 'POST'
        const zipCode = '01001000'
        const url = endpointCep + zipCode
        const httpStatusNotAllowed = 405
        const statusTextNotAllowed = 'Method Not Allowed'
        cy.api_returnZipCodeData(HttpMethodPost, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
                expect(response.statusText).to.eq(statusTextNotAllowed)
            })
    })

    it('Returns ZIP code data without authentication', () => {
        const zipCode = '30130010'
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
        const invalidToken = Cypress.env('INVALID_TOKEN')
        const InvalidAuthorization = `Bearer ${invalidToken}`
        const zipCode = '70040010'
        const url = endpointCep + zipCode
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, InvalidAuthorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnauthorized)
                expect(response.statusText).to.eq(statusTextUnauthorized)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(massageUnauthenticated)
            })
    })

    it('Returns ZIP code data without authorization', () => {
        const qrCodeGenerationApiToken = Cypress.env('QR_CODE_GENERATOR_API_TOKEN')
        const authorizationForTheQrCodeGenerationApi = `Bearer ${qrCodeGenerationApiToken}`
        const zipCode = '80010000'
        const url = endpointCep + zipCode
        const httpStatusForbidden = 403
        const statusTextForbidden = 'Forbidden'
        const messageForbidden = 'Este token não pode chamar a API cep.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheQrCodeGenerationApi   )
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
        const zipCode = null
        const url = endpointCep + zipCode
        const mandatoryFieldMessage = 'O campo cep é obrigatório.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(mandatoryFieldMessage)
            })
    })

    /**
     * Observation: Check if the HTTP status code should be 400 instead of 422
     */
    it('Return ZIP code data by sending a ZIP code with less than eight digits', () => {
        const zipCode = '4002000'
        const url = endpointCep + zipCode
        const missingCharacterFieldMessage = 'O campo cep deve conter 8 caracteres.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            })
    })

})