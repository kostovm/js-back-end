const Product = require('../models/Product');

exports.create = (productData) => Product.create(productData);

exports.getAll = () => Product.find();

exports.singleProduct = (productId) => Product.findById(productId).populate('buyingList');

exports.update = (productId, productData) => Product.findByIdAndUpdate(productId, productData, { runValidators: true });

exports.delete = (productId) => Product.findByIdAndDelete(productId);

exports.search = async (searchByName, searchByType) => {
    let filterProducts = await Product.find().lean();

    if (searchByName) {
        filterProducts = filterProducts.filter((product) => product.name.toLowerCase().includes(searchByName.toLowerCase()));
    }
    if (searchByType) {
        filterProducts = filterProducts.filter((product) => product.type.toLowerCase() === searchByType.toLowerCase());
    }

    return filterProducts;
};

exports.buyProduct = async (productId, userId) => {
const product = await this.singleProduct(productId);


    product.buyingList.push(userId);
    return product.save();
};