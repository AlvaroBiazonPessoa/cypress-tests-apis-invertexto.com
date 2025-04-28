class ZipCode {

    constructor(cepWithHyphen, zipCodeWithoutHyphen, state, city, neighborhood, street, complement, ibge) {
        this.cepWithHyphen = cepWithHyphen
        this.zipCodeWithoutHyphen = zipCodeWithoutHyphen
        this.state = state
        this.city = city
        this.neighborhood = neighborhood
        this.street = street
        this.complement = complement
        this.ibge = ibge
    }

}

module.exports = ZipCode