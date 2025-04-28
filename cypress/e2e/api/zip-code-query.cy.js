const ZipCode = require('../../fixtures/ZipCode')

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
    const missingCharacterFieldMessage = 'O campo cep deve conter 8 caracteres.'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const httpMethodPost = 'POST'
        const zipCode = new ZipCode('01001000')
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        const httpStatusNotAllowed = 405
        const statusTextNotAllowed = 'Method Not Allowed'
        cy.api_returnZipCodeData(httpMethodPost, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
                expect(response.statusText).to.eq(statusTextNotAllowed)
            })
    })

    it('Returns ZIP code data without authentication', () => {
        const zipCode = new ZipCode('30130010')
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
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
        const zipCode = new ZipCode('70040010')
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
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
        const zipCode = new ZipCode('80010000')
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        const httpStatusForbidden = 403
        const statusTextForbidden = 'Forbidden'
        const messageForbidden = 'Este token não pode chamar a API cep.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheQrCodeGenerationApi)
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
        const zipCode = new ZipCode(null)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
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
        const zipCodeWithLessThanEightDigits = '4002000'
        const zipCode = new ZipCode(zipCodeWithLessThanEightDigits)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            })
    })

    /**
     * Observation: Check if the HTTP status code should be 400 instead of 422
     */
    it('Returns ZIP code data by sending a ZIP code with more than eight digits', () => {
        const zipCodeWithMoreThanEightDigits = '590202000'
        const zipCode = new ZipCode(zipCodeWithMoreThanEightDigits)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            })
    })

    /**
     * Observation: Check if the HTTP status code should be 400 instead of 422
     */
    it('Return ZIP code data by sending an invalid ZIP code', () => {
        const invalidZipCode = '12345678'
        const zipCode = new ZipCode(invalidZipCode)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        const noResultsFoundMessage = 'Nenhum resultado encontrado.'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusUnprocessableEntity)
                expect(response.statusText).to.eq(statusTextUnprocessableEntity)
                expect(response.body).to.have.property(messageObject)
                expect(response.body.message).to.eq(noResultsFoundMessage)
            })
    })

    it('Return ZIP code data by sending a ZIP code with a hyphen', () => {
        const zipCode = new ZipCode('66010030', '66010-030', 'PA', 'Belém', 'Campina', 'Praça Dom Macedo Costa', '', '1501402')
        const url = endpointCep + zipCode.zipCodeWithHyphen
        failOnStatusCode = true
        const httpStatusOk = 200
        const statusTextOk = 'OK'
        cy.api_returnZipCodeData(httpMethodGet, url, failOnStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(httpStatusOk)
                expect(response.statusText).to.eq(statusTextOk)
                expect(response.body).to.have.property('cep')
                expect(response.body.cep).to.eq(zipCode.zipCodeWithoutHyphen)
                expect(response.body).to.have.property('state')
                expect(response.body.state).to.eq(zipCode.state)
                expect(response.body).to.have.property('city')
                expect(response.body.city).to.eq(zipCode.city)
                expect(response.body).to.have.property('neighborhood')
                expect(response.body.neighborhood).to.eq(zipCode.neighborhood)
                expect(response.body).to.have.property('street')
                expect(response.body.street).to.eq(zipCode.street)
                expect(response.body).to.have.property('complement')
                expect(response.body.complement).to.eq(zipCode.complement)
                expect(response.body).to.have.property('ibge')
                expect(response.body.ibge).to.eq(zipCode.ibge)
            })
    })

})