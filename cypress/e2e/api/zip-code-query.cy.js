import { HttpMethod, HttpStatus, HttpStatusText } from '../../constants/http'
const ZipCode = require('../../fixtures/ZipCode')

describe('ZIP Code Query API', { env: { hideCredentials: true } }, () => {

    const endpointCep = 'cep/' 
    const allowsErrorStatusCode = false
    const doesNotAllowErrorStatusCode = true
    const zipCodeQueryApiToken = Cypress.env('ZIP_CODE_QUERY_API_TOKEN')
    const authorizationForTheZipCodeQueryApi = `Bearer ${zipCodeQueryApiToken}`
    const massageUnauthenticated = 'Unauthenticated.'
    const missingCharacterFieldMessage = 'O campo cep deve conter 8 caracteres.'
    const noResultsFoundMessage = 'Nenhum resultado encontrado.'
    const keyMessage = 'message'
    const keyCep = 'cep'
    const keyState = 'state'
    const keyCity = 'city'
    const keyNeighborhood = 'neighborhood'
    const keyStreet = 'street'
    const keyComplement = 'complement'
    const keyIbge = 'ibge'

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const zipCodeWithoutHyphen = '01001000'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.POST, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_ALLOWED)
                expect(response.statusText).to.eq(HttpStatusText.NOT_ALLOWED)
            })
    })

    it('Returns ZIP code data without authentication', () => {
        const zipCodeWithoutHyphen = '30130010'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeDataWithoutAuthentication(HttpMethod.GET, url, allowsErrorStatusCode)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            })
    })

    it('Returns ZIP code data with an invalid token', () => {
        const invalidToken = Cypress.env('INVALID_TOKEN')
        const invalidAuthorization = `Bearer ${invalidToken}`
        const zipCodeWithoutHyphen = '70040010'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, invalidAuthorization)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            })
    })

    it('Returns ZIP code data without authorization', () => {
        const qrCodeGenerationApiToken = Cypress.env('QR_CODE_GENERATOR_API_TOKEN')
        const authorizationForTheQrCodeGenerationApi = `Bearer ${qrCodeGenerationApiToken}`
        const zipCodeWithoutHyphen = '80010000'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        const messageForbidden = 'Este token não pode chamar a API cep.'
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheQrCodeGenerationApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.FORBIDDEN)
                expect(response.statusText).to.eq(HttpStatusText.FORBIDDEN)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(messageForbidden)
            })
    })

    it('Return ZIP code data without sending ZIP code parameter', () => {
        const zipCode = new ZipCode(null)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        const mandatoryFieldMessage = 'O campo cep é obrigatório.'
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryFieldMessage)
            })
    })

    it('Return ZIP code data by sending a ZIP code with less than eight digits', () => {
        const zipCodeWithLessThanEightDigits = '4002000'
        const zipCode = new ZipCode(zipCodeWithLessThanEightDigits)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            })
    })

    it('Returns ZIP code data by sending a ZIP code with more than eight digits', () => {
        const zipCodeWithMoreThanEightDigits = '590202000'
        const zipCode = new ZipCode(zipCodeWithMoreThanEightDigits)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            })
    })

    it('Return ZIP code data by sending a ZIP code that does not exist', () => {
        const zipCodeThatDoesNotExist = '12345678'
        const zipCode = new ZipCode(zipCodeThatDoesNotExist)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(noResultsFoundMessage)
            })
    })

    it('Return ZIP code data by sending a ZIP code with a special character', () => {
        const zipCodeWithSpecialCharacter = '@-64000020'
        const zipCode = new ZipCode(zipCodeWithSpecialCharacter)
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(noResultsFoundMessage)
            })
    })

    it('Return ZIP code data by sending a ZIP code with a hyphen', () => {
        const zipCode = new ZipCode('66010030', '66010-030', 'PA', 'Belém', 'Campina', 'Praça Dom Macedo Costa', '', '1501402')
        const url = endpointCep + zipCode.zipCodeWithHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.OK)
                expect(response.statusText).to.eq(HttpStatusText.OK)
                expect(response.body).to.have.property(keyCep)
                expect(response.body.cep).to.eq(zipCode.zipCodeWithoutHyphen)
                expect(response.body).to.have.property(keyState)
                expect(response.body.state).to.eq(zipCode.state)
                expect(response.body).to.have.property(keyCity)
                expect(response.body.city).to.eq(zipCode.city)
                expect(response.body).to.have.property(keyNeighborhood)
                expect(response.body.neighborhood).to.eq(zipCode.neighborhood)
                expect(response.body).to.have.property(keyStreet)
                expect(response.body.street).to.eq(zipCode.street)
                expect(response.body).to.have.property(keyComplement)
                expect(response.body.complement).to.eq(zipCode.complement)
                expect(response.body).to.have.property(keyIbge)
                expect(response.body.ibge).to.eq(zipCode.ibge)
            })
    })

    it('Return ZIP code data by sending a ZIP code without a hyphen', () => {
        const zipCode = new ZipCode('64000020', '64000-020', 'PI', 'Teresina', 'Centro', 'Avenida Frei Serafim', '', '2211001')
        const url = endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.OK)
                expect(response.statusText).to.eq(HttpStatusText.OK)
                expect(response.body).to.have.property(keyCep)
                expect(response.body.cep).to.eq(zipCode.zipCodeWithoutHyphen)
                expect(response.body).to.have.property(keyState)
                expect(response.body.state).to.eq(zipCode.state)
                expect(response.body).to.have.property(keyCity)
                expect(response.body.city).to.eq(zipCode.city)
                expect(response.body).to.have.property(keyNeighborhood)
                expect(response.body.neighborhood).to.eq(zipCode.neighborhood)
                expect(response.body).to.have.property(keyStreet)
                expect(response.body.street).to.eq(zipCode.street)
                expect(response.body).to.have.property(keyComplement)
                expect(response.body.complement).to.eq(zipCode.complement)
                expect(response.body).to.have.property(keyIbge)
                expect(response.body.ibge).to.eq(zipCode.ibge)
            })
    })

    it('Return ZIP code data by sending incorrect base URL', () => {
        const zipCodeWithoutHyphen = '64000020'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const ivalidBaseUrl = 'https://api.invertexto.com.br/v5/'
        const url = ivalidBaseUrl + endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_returnZipCodeData(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_FOUND)
                expect(response.statusText).to.eq(HttpStatusText.NOT_FOUND)
            })
    })

})