describe('ZIP Code Query API', () => {

    it('Return ZIP code data with an unexpected HTTP method', () => {
        const unexpectedHttpMethod = 'POST'
        const failOnStatusCode = false
        const apiToken = Cypress.env('TOKEN_FOR_ALL_APIS')
        const authorization = `Bearer ${apiToken}`
        const zipCode = '09691000'
        const allUrl = `cep/${zipCode}`
        const httpStatusNotAllowed = 405
        cy.api_returnZipCodeData(unexpectedHttpMethod, allUrl, failOnStatusCode, authorization)
            .then((response) => {
                expect(response.status).to.eq(httpStatusNotAllowed)
            })
    })

})