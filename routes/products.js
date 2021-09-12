const router = require("express").Router()
const mongoose = require("mongoose")
const User = require("../models/User.model")
const Product = require("../models/Product.model")
const isLoggedOut = require("../middleware/isLoggedOut")
const isLoggedIn = require("../middleware/isLoggedIn")
const Api = require("../services/APIHandler")
const ProductsAPI = new Api()

router.get("/search-products", (req, res) => {
	res.render("products/search-products")
})

router.post("/search-products", (req, res) => {
	const textSearch = req.body.product
	// console.log(textSearch)
	ProductsAPI.findProductsByText(textSearch)
		.then((productsFound) => {
			// console.log(productsFound)
			res.render("products/products-list", { products: productsFound.data.results })
		})
		.catch((error) => {
			console.log(error)
		})
})

module.exports = router
