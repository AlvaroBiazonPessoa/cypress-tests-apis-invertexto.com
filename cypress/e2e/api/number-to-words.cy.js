import { HttpMethod, HttpStatus, HttpStatusText } from '../../support/constants/http'
const Number = require('../../support/entities/Number')
import chaiJsonSchema from 'chai-json-schema'
chai.use(chaiJsonSchema)

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

    it('Return the number in full by sending the Azerbaijani language', { tags: ['@ID-15', '@data'] }, () => {
        const number = new Number('12', 'on iki', 'az')
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

    it('Return the number in full by sending the German language', { tags: ['@ID-16', '@data'] }, () => {
        const number = new Number('13', 'dreizehn', 'de')
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

    it('Return the number in full by sending the Danish language', { tags: ['@ID-17', '@data'] }, () => {
        const number = new Number('14', 'fjorten', 'dk')
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

    it('Return the number in full by sending the English language', { tags: ['@ID-18', '@data'] }, () => {
        const number = new Number('15', 'fifteen', 'en')
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

    it('Return the number in full by sending the Spanish language', { tags: ['@ID-19', '@data'] }, () => {
        const number = new Number('16', 'dieciséis', 'es')
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

    it('Return the number in full by sending the French language', { tags: ['@ID-20', '@data'] }, () => {
        const number = new Number('17', 'dix-sept', 'fr')
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

    it('Return the number in full by sending the Hungarian language', { tags: ['@ID-21', '@data'] }, () => {
        const number = new Number('18', 'tizennyolc', 'hu')
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

    it('Return the number in full by sending the Indonesian language', { tags: ['@ID-22', '@data'] }, () => {
        const number = new Number('19', 'sembilan belas', 'id')
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

    it('Return the number in full by sending the Georgian language', { tags: ['@ID-23', '@data'] }, () => {
        const number = new Number('20', 'ოცი', 'ka')
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

    it('Return the number in full by sending the Lithuanian language', { tags: ['@ID-24', '@data'] }, () => {
        const number = new Number('21', 'dvidešimt vienas', 'lt')
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

    it('Return the number in full by sending the Latvian language', { tags: ['@ID-25', '@data'] }, () => {
        const number = new Number('22', 'divdesmit divi', 'lv')
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

    it('Return the number in full by sending the Malay language', { tags: ['@ID-26', '@data'] }, () => {
        const number = new Number('23', 'dua puluh tiga', 'ms')
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

    it('Return the number in full by sending the Polish language', { tags: ['@ID-27', '@data'] }, () => {
        const number = new Number('24', 'dwadzieścia cztery', 'pl')
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

    it('Return the number in full by sending the Portuguese language', { tags: ['@ID-28', '@data'] }, () => {
        const number = new Number('25', 'vinte e cinco', 'pt')
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

    it('Return the number in full by sending the Romanian language', { tags: ['@ID-29', '@data'] }, () => {
        const number = new Number('26', 'douăzeci și șase', 'ro')
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

    it('Return the number in full by sending the Russian language', { tags: ['@ID-30', '@data'] }, () => {
        const number = new Number('27', 'двадцать семь', 'ru')
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

    it('Return the number in full by sending the Slovak language', { tags: ['@ID-31', '@data'] }, () => {
        const number = new Number('28', 'dvadsaťosem', 'sk')
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

    it('Return the number in full by sending the Turkish language', { tags: ['@ID-32', '@data'] }, () => {
        const number = new Number('30', 'otuz', 'tr')
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

    it('Return the number in full by sending the Ukrainian language', { tags: ['@ID-33', '@data'] }, () => {
        const number = new Number('31', 'тридцять один', 'ua')
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

    it('Return the number in full by sending the Yoruba language', { tags: ['@ID-34', '@data'] }, () => {
        const number = new Number('32', 'ọgbọn méjì', 'yo')
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

    it('Return the number in full by checking JSON Schema', { tags: ['@ID-X', '@data'] }, () => {
        const number = new Number('1', 'um', 'pt')
        const queryParameter = {
            number: number.number,
            language: number.language
        }
        cy.fixture('./schemas/numberInFullSchema.json').then((schema) => {
            cy.api_makeRequestWithQueryParameter(HttpMethod.GET, url, doesNotAllowErrorStatusCode, authorizationForTheNumberToWordsApi, queryParameter)
                .then((response) => {
                    expect(response.status).to.eq(HttpStatus.OK)
                    expect(response.statusText).to.eq(HttpStatusText.OK)
                    expect(response.body).to.be.jsonSchema(schema)
                }
            )
        })
    })

    Cypress._.times(100, () => {
        it('Return the number in full by sending the Portuguese language 100 times', { tags: ['@ID-X', '@data'] }, () => {
            const number = new Number('25', 'vinte e cinco', 'pt')
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

})