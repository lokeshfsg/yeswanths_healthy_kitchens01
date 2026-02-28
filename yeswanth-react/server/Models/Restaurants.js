const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
});

const restaurantSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    restaurant: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reviews: {
        type: [reviewSchema], // Array of review objects
        default: []
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'Restaurants'); // Collection name: 'Restaurants'

module.exports = Restaurant;
