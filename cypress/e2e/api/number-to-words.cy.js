import { HttpMethod, HttpStatus, HttpStatusText } from '../../constants/http'

describe('Number to Words API', { env: { hideCredentials: true } }, () => {

    const endpointNumberToWords = 'number-to-words' 
    const allowsErrorStatusCode = false
    const numberToWordsApiToken = Cypress.env('NUMBER_TO_WORDS_API_TOKEN')
    const authorizationForTheNumberToWordsApi = `Bearer ${numberToWordsApiToken}`
    const keyMessage = 'message'
    const massageUnauthenticated = 'Unauthenticated.'

    it('Return the number in full with an unexpected HTTP method', () => {
        const queryParameter = {
            number: '250',
            language: 'pt',
            currency: ''
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.PATCH, endpointNumberToWords, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_ALLOWED)
                expect(response.statusText).to.eq(HttpStatusText.NOT_ALLOWED)
            }
        )
    })

    it('Return the number in full without authentication', () => {
        cy.api_makeRequestWithoutAuthentication(HttpMethod.GET, endpointNumberToWords, allowsErrorStatusCode)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

    it('Return the number in full with an invalid token', () => {
        const invalidToken = Cypress.env('INVALID_TOKEN')
        const invalidAuthorization = `Bearer ${invalidToken}`
        const queryParameter = {
            number: '250',
            language: 'pt',
            currency: ''
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, endpointNumberToWords, allowsErrorStatusCode, invalidAuthorization, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

    it('Return the number in full without authorization', () => {
        const zipCodeQueryApiToken = Cypress.env('ZIP_CODE_QUERY_API_TOKEN')
        const authorizationForTheZipCodeQueryApi = `Bearer ${zipCodeQueryApiToken}`
        const queryParameter = {
            number: '250',
            language: 'pt',
            currency: ''
        }
        const messageForbidden = 'Este token não pode chamar a API number-to-words.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, endpointNumberToWords, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.FORBIDDEN)
                expect(response.statusText).to.eq(HttpStatusText.FORBIDDEN)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(messageForbidden)
            }
        )
    })

    it('Return the number in full without sending the mandatory parameters', () => {
        const queryParameter = null
        const mandatoryParametersMessage = 'Os campos number e language são obrigatórios.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, endpointNumberToWords, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryParametersMessage)
            }
        )
    })

    it('Return the number in full without sending the number parameter', () => {
        const queryParameter = {
            language: 'pt',
            currency: ''
        }
        const mandatoryNnameParameterMessage = 'O campo number é obrigatório.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, endpointNumberToWords, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryNnameParameterMessage)
            }
        )
    })

})