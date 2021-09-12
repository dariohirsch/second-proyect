const axios = require("axios")

class ProductsApi {
	constructor() {
		this.api = axios.create({
			baseURL: "https://api.mercadolibre.com",
		})
	}

	findProductsByText(findText) {
		return this.api.get(`/sites/MLA/search?q=${findText}`)
	}
}

module.exports = ProductsApi
