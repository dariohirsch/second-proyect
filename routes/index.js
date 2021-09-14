const router = require("express").Router()

/* GET home page */
router.get("/", (req, res, next) => {
	if (req.session.user) {
		res.render("index", { userSession: req.session.user })
	} else {
		res.render("index")
	}
})

module.exports = router
