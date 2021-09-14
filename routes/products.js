const router = require("express").Router()
const mongoose = require("mongoose")
const User = require("../models/User.model")
const Product = require("../models/Product.model")
const isLoggedOut = require("../middleware/isLoggedOut")
const isLoggedIn = require("../middleware/isLoggedIn")
const Api = require("../services/APIHandler")
const ProductsAPI = new Api()

router.get("/search-products", (req, res) => {
	res.render("products/search-products", { userSession: req.session.user })
})

router.post("/search-products", (req, res) => {
	const textSearch = req.body.product
	// console.log(textSearch)
	ProductsAPI.findProductsByText(textSearch)
		.then((productsFound) => {
			// console.log(productsFound)
			res.render("products/products-list", { products: productsFound.data.results, textSearch, userSession: req.session.user })
		})
		.catch((error) => {
			console.log(error)
		})
})

router.get("/my-products", isLoggedIn, (req, res) => {
	User.findById(req.user._id)
		.populate("myProducts")
		.then((result) => {
			if (result.myProducts.length === 0) {
				//message:req is only to get the message
				res.render("products/my-products", { message: req, userSession: req.session.user })
			} else {
				res.render("products/my-products", { result: result.myProducts, userId: req.user._id, userSession: req.session.user })
			}
		})
		.catch((error) => {
			console.log(error)
		})
})

router.post("/my-products", isLoggedIn, (req, res) => {
	const info = ({ image, title, price } = req.body)
	// console.log(req.body)

	Product.create(info).then((result) => {
		User.findByIdAndUpdate(req.user._id, { $push: { myProducts: result._id } }, { new: true })

			.then(() => {
				res.redirect("/my-products")
			})
			.catch((error) => {
				console.log(error)
			})
	})
})

router.post("/remove-product", isLoggedIn, (req, res) => {
	const id = req.body.userId

	User.findByIdAndUpdate(id, { $pull: { myProducts: req.body.id } })
		.then(() => {
			res.redirect("/my-products")
		})
		.catch((err) => console.log(err))
})

router.post("/item-detail", (req, res) => {
	const itemId = req.body.itemId
	ProductsAPI.findProductById(itemId)
		.then((itemFound) => {
			res.render("products/item-detail", { item: itemFound.data, userSession: req.session.user })
		})
		.catch((error) => {
			console.log(error)
		})
})
module.exports = router
