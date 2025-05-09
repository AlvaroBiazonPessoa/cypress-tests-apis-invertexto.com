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

})