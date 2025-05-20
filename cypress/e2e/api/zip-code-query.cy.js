import { HttpMethod, HttpStatus, HttpStatusText } from '../../constants/http'
const ZipCode = require('../../support/ZipCode')
import chaiJsonSchema from 'chai-json-schema'
chai.use(chaiJsonSchema)

describe('ZIP Code Query API', { env: { hideCredentials: true } }, () => {

    const baseUrl = Cypress.env('BASE_URL')
    const endpointCep = 'cep/' 
    const baseUrlWithEndpointCep = baseUrl + endpointCep
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

    it('Return ZIP code data with an unexpected HTTP method', { tags: ['@ID-01', '@verbs'] }, () => {
        const zipCodeWithoutHyphen = '01001000'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.POST, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_ALLOWED)
                expect(response.statusText).to.eq(HttpStatusText.NOT_ALLOWED)
            }
        )
    })

    it('Return ZIP code data without authentication', { tags: ['@ID-02', '@authentication'] }, () => {
        const zipCodeWithoutHyphen = '30130010'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithoutAuthentication(HttpMethod.GET, url, allowsErrorStatusCode)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

    it('Return ZIP code data with an invalid token', { tags: ['@ID-03', '@authentication'] }, () => {
        const invalidToken = Cypress.env('INVALID_TOKEN')
        const invalidAuthorization = `Bearer ${invalidToken}`
        const zipCodeWithoutHyphen = '70040010'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, invalidAuthorization)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

    it('Return ZIP code data without authorization', { tags: ['@ID-04', '@authorization'] }, () => {
        const qrCodeGenerationApiToken = Cypress.env('QR_CODE_GENERATOR_API_TOKEN')
        const authorizationForTheQrCodeGenerationApi = `Bearer ${qrCodeGenerationApiToken}`
        const zipCodeWithoutHyphen = '80010000'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        const messageForbidden = 'Este token não pode chamar a API cep.'
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheQrCodeGenerationApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.FORBIDDEN)
                expect(response.statusText).to.eq(HttpStatusText.FORBIDDEN)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(messageForbidden)
            }
        )
    })

    it('Return ZIP code data without sending ZIP code parameter', { tags: ['@ID-05', '@data'] }, () => {
        const zipCode = new ZipCode(null)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        const mandatoryFieldMessage = 'O campo cep é obrigatório.'
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryFieldMessage)
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code with less than eight digits', { tags: ['@ID-06', '@data'] }, () => {
        const zipCodeWithLessThanEightDigits = '4002000'
        const zipCode = new ZipCode(zipCodeWithLessThanEightDigits)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code with more than eight digits', { tags: ['@ID-07', '@data'] }, () => {
        const zipCodeWithMoreThanEightDigits = '590202000'
        const zipCode = new ZipCode(zipCodeWithMoreThanEightDigits)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(missingCharacterFieldMessage)
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code that does not exist', { tags: ['@ID-08', '@data'] }, () => {
        const zipCodeThatDoesNotExist = '12345678'
        const zipCode = new ZipCode(zipCodeThatDoesNotExist)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(noResultsFoundMessage)
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code with a special character', { tags: ['@ID-09', '@data'] }, () => {
        const zipCodeWithSpecialCharacter = '@-64000020'
        const zipCode = new ZipCode(zipCodeWithSpecialCharacter)
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(noResultsFoundMessage)
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code with a hyphen', { tags: ['@ID-10', '@data'] }, () => {
        const zipCode = new ZipCode('66010030', '66010-030', 'PA', 'Belém', 'Campina', 'Praça Dom Macedo Costa', '', '1501402')
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
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
            }
        )
    })

    it('Return ZIP code data by sending a ZIP code without a hyphen', { tags: ['@ID-11', '@data'] }, () => {
        const zipCode = new ZipCode('64000020', '64000-020', 'PI', 'Teresina', 'Centro', 'Avenida Frei Serafim', '', '2211001')
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
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
            }
        )
    })

    it('Return ZIP code data by sending incorrect base URL', { tags: ['@ID-12', '@error'] }, () => {
        const zipCodeWithoutHyphen = '64000020'
        const zipCode = new ZipCode(zipCodeWithoutHyphen)
        const ivalidBaseUrl = 'https://api.invertexto.com.br/v5/'
        const url = ivalidBaseUrl + endpointCep + zipCode.zipCodeWithoutHyphen
        cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_FOUND)
                expect(response.statusText).to.eq(HttpStatusText.NOT_FOUND)
            }
        )
    })

    it('Return ZIP code data by checking JSON Schema', { tags: ['@ID-13', '@data'] }, () => {
        const zipCode = new ZipCode('64000020', '64000-020', 'PI', 'Teresina', 'Centro', 'Avenida Frei Serafim', '', '2211001')
        const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
        cy.fixture('zipCodeDetailsJsonSchema.json').then((schema) => {
            cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
                .then((response) => {
                    expect(response.status).to.eq(HttpStatus.OK)
                    expect(response.statusText).to.eq(HttpStatusText.OK)
                    expect(response.body).to.be.jsonSchema(schema)
                }
            )
        })
    })

    Cypress._.times(20, () => {
        it('Return ZIP code data 20 times', { tags: ['@ID-14', '@responsiveness'] }, () => {
            const zipCode = new ZipCode('64000020', '64000-020', 'PI', 'Teresina', 'Centro', 'Avenida Frei Serafim', '', '2211001')
            const url = baseUrlWithEndpointCep + zipCode.zipCodeWithoutHyphen
            cy.api_makeRequestWithPathParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheZipCodeQueryApi)
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
                }
            )
        })
    })

})