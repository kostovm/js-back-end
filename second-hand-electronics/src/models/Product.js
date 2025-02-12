const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minLength: [10, "The name is too short!"]
    },
    type: {
        type: String,
        required: [true, "Type is required!"],
        minLength: [2, "Type description is too short!"]
    },
    production : {
        type: Number,
        required: [true, "Production year is required!"],
        validate: {
            validator: function(v) {
                return v >= 1900 && v <= 2023;
            },
            message: "Invalid production year!"
        }
    },
    exploitation: {
        type: Number,
        required: [true, "Exploitation is required!"],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: "Exploitation must be a positive number!"
        }
    },
    damages: {
        type: String,
        required: [true, "Damages is required!"],
        minLength: [10, "Damage description is too short!"]
    },
    image: {
        type: String,
        required: [true, "Image is required!"],
        match: [/^https?:\/\/.+/, "Provide valid image link!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: "Price must be a positive number!"
        }
    },
    description: {
        type: String,
        required: [true, "Product description is required!"],
        minLength: [10, "Product description is too short!"],
        maxLength: [200, "Product description is too long!"]
    },
    buyingList : [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;