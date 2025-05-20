class ZipCode {

    constructor(zipCodeWithoutHyphen, zipCodeWithHyphen=null, state=null, city=null, neighborhood=null, street=null, complement=null, ibge=null) {
        this.zipCodeWithoutHyphen = zipCodeWithoutHyphen
        this.zipCodeWithHyphen = zipCodeWithHyphen
        this.state = state
        this.city = city
        this.neighborhood = neighborhood
        this.street = street
        this.complement = complement
        this.ibge = ibge
    }

}

module.exports = ZipCode