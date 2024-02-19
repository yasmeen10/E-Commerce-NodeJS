const { name } = require('ejs');
const Product = require('../models/product.model');

const getAllProductsService = async () => {
    try {
        return await Product.find();
    } catch (e) {
        console.log(e); 
    } 
};
 
const getProductByIdService = async id => {
    try {
        return await Product.find({_id: id});
    } catch(e) {
        console.log(e);
    }
}


const createNewProductService = async product => {
    try {
        return await Product.create(product);
    } catch (e) {
        console.log(e);
    }
}

const updateProductService = async (id, body) => {
    try {
        return await Product.updateOne({_id: id}, body);
    } catch (e) {
        console.log(e);
    }
}

const deleteProductService = async id =>  {
    try {
        return await Product.deleteOne({_id: id});
    } catch (e) {
        console.log(e);
    }
}

const searchProductService = async (key,value) =>{
    let product;
        if(!key){
            resizeBy.status(404).send("The Product not found");
            return;
        }
        if(key == 'title'){
            product = await Product.find({title:value});
        }
        if(key == 'brand'){
            product = await Product.find({brand:value});
        }
        return product;
}

const getFilteredProductsService = async (params) =>{
    if(!params){
        resizeBy.status(404).send("The Product not found");
        return;
    }
    const products = await Product.find(params);
    return products;
}

module.exports = {
    getAllProductsService,
    getProductByIdService,
    createNewProductService,
    updateProductService,
    deleteProductService,
    searchProductService,
    getFilteredProductsService
}
