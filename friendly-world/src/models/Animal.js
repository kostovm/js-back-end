const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minLength: [2, "The name is too short!"]
    },
    age: {
        type: Number,
        required: [true, "Age is required!"],
        validate: {
            validator: function(v) {
                return v >= 1 && v<= 100;
            },
            message: "Invalid age!"
        }
    },
    kind: {
        type: String,
        required: [true, "Kind is required!"],
        minLength: [3, "Kind description is too short!"]
    },
    image: {
        type: String,
        required: [true, "Image is required!"],
        match: [/^https?:\/\/.+/, "Provide valid image URL!"]
    },
    need: {
        type: String,
        required: [true, "Need is required!"],
        minLength: [3, "Need description is too short!"],
        maxLength: [20, "Need description is too long!"]
    },
    location: {
        type: String,
        required: [true, "Location is required!"],
        minLength: [5, "Location description is too short!"],
        maxLength: [15, "Location description is too long"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
        minLength: [5, "Description is too short!"],
        maxLength: [50, "Description is too long!"]
    },
    donations: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    createdAt: 
    { type: Date, 
    default: Date.now }
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;