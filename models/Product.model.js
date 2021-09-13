const { Schema, model } = require("mongoose")

const productSchema = new Schema(
	{
		image: String,
		title: String,
		price: String,
	},
	{
		timestamps: true,
	}
)

module.exports = model("Product", productSchema)
