'use strict';
const mongoose = require('mongoose');

const productModel = function() {
	const productSchema = mongoose.Schema({
    UserId:String,
    ProductName : String,
    ProductPrice : String,
    ProductImage : String,
    MoreProductImages:Array
  });

	return mongoose.model('Product', productSchema);
};

module.exports = new productModel();
