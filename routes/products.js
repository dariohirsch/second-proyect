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
			// res.send(productsFound.data)
			res.render("products/products-list", { products: productsFound.data.results, textSearch, userSession: req.session.user })
		})
		.catch((error) => {
			console.log(error)
		})
})

router.get("/my-products", isLoggedIn, (req, res) => {
	const username = req.user.username
	User.findById(req.user._id)
		.populate("myProducts")
		.then((result) => {
			if (result.myProducts.length === 0) {
				//message:req is only to get the message
				res.render("products/my-products", { message: req, userSession: req.session.user, username })
			} else {
				res.render("products/my-products", { result: result.myProducts, userId: req.user._id, userSession: req.session.user, username })
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
			res.render("products/item-detail", { item: itemFound.data, userSession: req.session.user, image: itemFound.data.pictures[0].url })
		})
		.catch((error) => {
			console.log(error)
		})
})

router.get("/search-by-category", (req, res) => {
	ProductsAPI.getCategories()
		.then((categories) => {
			res.render("products/search-by-category", { categories: categories.data, userSession: req.session.user })
			// console.log(categories.data)
		})
		.catch((error) => {
			console.log(error)
		})
})

router.get("/category-products-search", (req, res) => {
	const categoryId = req.query.id
	let page = 1
	if (req.query.page) {
		page = req.query.page
	}
	let nextPage = parseInt(page) + 1
	let prevPage = parseInt(page) - 1
	let pageGreaterThanOne = parseInt(page) > 1

	const limit = 50
	const offset = (parseInt(page) - 1) * limit

	ProductsAPI.getItemsByCategory(categoryId, limit, offset)
		.then((category) => {
			// let totalResults = category.data.paging.total
			// console.log(totalResults)
			// let totalPages = totalResults / 50
			res.render("products/items-by-category", { catResult: category.data.results, userSession: req.session.user, categoryId, page, nextPage, prevPage, pageGreaterThanOne })
		})
		.catch((error) => {
			console.log(error)
		})
})

module.exports = router
