require("dotenv/config")

require("./db")

const express = require("express")

const hbs = require("hbs")

hbs.registerHelper("sum", function (v1, v2) {
	return v1 + v2
})
const app = express()

require("./config")(app)

const projectName = "MyWishList"
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase()

app.locals.title = `${projectName}`

//routes
const index = require("./routes/index")
app.use("/", index)

const authRoutes = require("./routes/auth")
app.use("/", authRoutes)

const productsRoutes = require("./routes/products")
app.use("/", productsRoutes)

require("./error-handling")(app)

module.exports = app
