import { HttpMethod, HttpStatus, HttpStatusText } from '../../support/constants/http'
const Number = require('../../support/entities/Number')

describe('Number to Words API', { env: { hideCredentials: true } }, () => {

    const baseUrl = Cypress.env('BASE_URL')
    const endpointNumberToWords = 'number-to-words'  
    const url = baseUrl + endpointNumberToWords
    const allowsErrorStatusCode = false
    const doesNotAllowErrorStatusCode = true
    const numberToWordsApiToken = Cypress.env('NUMBER_TO_WORDS_API_TOKEN')
    const authorizationForTheNumberToWordsApi = `Bearer ${numberToWordsApiToken}`
    const keyMessage = 'message'
    const massageUnauthenticated = 'Unauthenticated.'
    const keyText = 'text'
    const incorrectNumberFieldPrimitiveTypeMessage = 'O campo number deve ser do tipo string.'

    it('Return the number in full with an unexpected HTTP method', { tags: ['@ID-01', '@verbs'] }, () => {
        const number = new Number('250', 'duzentos e cinquenta', 'pt', '')
        const queryParameter = {
            number: number.number,
            language: number.language,
            currency: number.currency
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.PATCH, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.NOT_ALLOWED)
                expect(response.statusText).to.eq(HttpStatusText.NOT_ALLOWED)
            }
        )
    })

    it('Return the number in full without authentication', { tags: ['@ID-02', '@authentication'] }, () => {
        cy.api_makeRequestWithoutAuthentication(HttpMethod.GET, url, allowsErrorStatusCode)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNAUTHORIZED)
                expect(response.statusText).to.eq(HttpStatusText.UNAUTHORIZED)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(massageUnauthenticated)
            }
        )
    })

    it('Return the number in full with an invalid token', { tags: ['@ID-03', '@authentication'] }, () => {
        const invalidToken = Cypress.env('INVALID_TOKEN')
        const invalidAuthorization = `Bearer ${invalidToken}`
        const number = new Number('250', 'duzentos e cinquenta', 'pt', '')
        const queryParameter = {
            number: number.number,
            language: number.language,
            currency: number.currency
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

    it('Return the number in full without authorization', { tags: ['@ID-04', '@authorization'] }, () => {
        const zipCodeQueryApiToken = Cypress.env('ZIP_CODE_QUERY_API_TOKEN')
        const authorizationForTheZipCodeQueryApi = `Bearer ${zipCodeQueryApiToken}`
        const number = new Number('250', 'duzentos e cinquenta', 'pt', '')
        const queryParameter = {
            number: number.number,
            language: number.language,
            currency: number.currency
        }
        const messageForbidden = 'Este token não pode chamar a API number-to-words.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheZipCodeQueryApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.FORBIDDEN)
                expect(response.statusText).to.eq(HttpStatusText.FORBIDDEN)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(messageForbidden)
            }
        )
    })

    it('Return the number in full without sending the mandatory parameters', { tags: ['@ID-05', '@data'] }, () => {
        const queryParameter = null
        const mandatoryParametersMessage = 'Os campos number e language são obrigatórios.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryParametersMessage)
            }
        )
    })

    it('Return the number in full without sending the number parameter', { tags: ['@ID-06', '@data'] }, () => {
        const number = new Number(null, null, 'pt', '')
        const queryParameter = {
            language: number.language,
            currency: number.currency
        }
        const mandatoryNameParameterMessage = 'O campo number é obrigatório.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryNameParameterMessage)
            }
        )
    })

    it('Return the number in full without sending the language parameter', { tags: ['@ID-07', '@data'] }, () => {
        const number = new Number('250', 'duzentos e cinquenta', null, '')
        const queryParameter = {
            number: number.number,
            currency: number.currency
        }
        const mandatoryLanguageParameterMessage = 'O campo language é obrigatório.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(mandatoryLanguageParameterMessage)
            }
        )
    })

    it('Return the number in full without sending the currency parameter', { tags: ['@ID-08', '@data'] }, () => {
        const number = new Number('250', 'duzentos e cinquenta', 'pt')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.OK)
                expect(response.statusText).to.eq(HttpStatusText.OK)
                expect(response.body).to.have.property(keyText)
                expect(response.body.text).to.eq(number.numberInFull)
            }
        )
    })

    it('Return the number in full by sending the parameter number with the primitive type number', { tags: ['@ID-09', '@data'] }, () => {
        const number = new Number(1000, 'um mil', 'pt')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(incorrectNumberFieldPrimitiveTypeMessage)
            }
        )
    })

    it('Return the number in full by sending the parameter number with the primitive type negative number', { tags: ['@ID-10', '@data'] }, () => {
        const number = new Number(-1, 'um mil negativo', 'pt')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(incorrectNumberFieldPrimitiveTypeMessage)
            }
        )
    })

    it('Return the number in full by sending the number parameter written in words', { tags: ['@ID-11', '@data'] }, () => {
        const number = new Number('zero', 'zero', 'pt')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        const numberFieldMustBeNumericMessage = 'O campo number deve conter um valor numérico.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(numberFieldMustBeNumericMessage)
            }
        )
    })

    it('Return the number in full by sending a non-existent language', { tags: ['@ID-12', '@data'] }, () => {
        const number = new Number('22', 'vinte e dois', 'ba')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        const invalidLanguageMessage = 'Valor inválido para o campo language.'
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, allowsErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.UNPROCESSABLE_ENTIYY)
                expect(response.statusText).to.eq(HttpStatusText.UNPROCESSABLE_ENTIYY)
                expect(response.body).to.have.property(keyMessage)
                expect(response.body.message).to.eq(invalidLanguageMessage)
            }
        )
    })

    it('Return the number in full by sending the Albanian language', { tags: ['@ID-13', '@data'] }, () => {
        const number = new Number('10', 'dhjetë', 'al')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.OK)
                expect(response.statusText).to.eq(HttpStatusText.OK)
                expect(response.body).to.have.property(keyText)
                expect(response.body.text).to.eq(number.numberInFull)
            }
        )
    })

    it('Return the number in full by sending the Arabic language', { tags: ['@ID-14', '@data'] }, () => {
        const number = new Number('11', 'احدى عشر', 'ar')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
            .then((response) => {
                expect(response.status).to.eq(HttpStatus.OK)
                expect(response.statusText).to.eq(HttpStatusText.OK)
                expect(response.body).to.have.property(keyText)
                expect(response.body.text).to.eq(number.numberInFull)
            }
        )
    })

})