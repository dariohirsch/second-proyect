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

	findProductById(itemId) {
		return this.api.get(`/items/${itemId}`)
	}
}

module.exports = ProductsApi
