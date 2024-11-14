const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  compatibility: [{
    make: String,
    model: String,
    year: Number,
  }],
  stockQuantity: {
    type: Number,
    required: true,
  },
  images: [String],
  partNumber: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Product', productSchema); 