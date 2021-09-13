const { Schema, model } = require("mongoose")

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		password: String,
		myProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{
		timestamps: true,
	}
)

const User = model("User", userSchema)

module.exports = User
