import { HttpMethod, HttpStatus, HttpStatusText } from '../../constants/http'

describe('Number to Words API', { env: { hideCredentials: true } }, () => {

    const endpointNumberToWords = 'number-to-words' 
    const url = endpointNumberToWords
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
        cy.api_makeRequestWithQueryParameter(HttpMethod.PATCH, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_ALLOWED)
                expect(response.statusText).to.eq(HttpStatusText.NOT_ALLOWED)
            }
        )
    })

    it('Return the number in full without authentication', () => {
        cy.api_makeRequestWithoutAuthentication(HttpMethod.GET, url, allowsErrorStatusCode)
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
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, invalidAuthorization, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

})