const Product = require('../models/product.model');
const services = require('../services/products.service');    
const productValidation = require('../validation/product.validator');

const {getCategoryByName} = require('../services/category.service');

const getAllProducts = async (req, res) => res.send(await services.getAllProductsService());

const getProductById = async (req, res) => {
    const product = await services.getProductByIdService(req.params.id);

    if (product) res.send(product);
    else res.status(404).send("The product with id: " + req.params.id + " not exists");
}

const createProduct = async (req, res) => {
    const { error, value } = productValidation(req.body);

    if (error) {
        res.status(400).send({ message: "Error happened while creating a new product" });
        console.log(error);
        return;
    }

    res.send(await services.createNewProductService(value));
}

const updateProduct = async (req, res) => {
    const product = await services.getProductByIdService(req.params.id);

    if (!product) {
        res.status(404).send("The product with id: " + req.params.id + " not exists");
        return;
    }

    const { error, value } = productValidation(req.body);

    if (error) {
        res.status(400).send({ message: "Please enter valid data" });
        return;
    }

    await services.updateProductService(req.params.id, req.body);

    res.send(await services.getProductByIdService(req.params.id));
}

const deleteProduct = async (req, res) => {
    const product = await services.getProductByIdService(req.params.id);

    if (!product) {
        res.status(404).send("The product with id: " + req.params.id + " not exists");
        return;
    }

    await services.deleteProductService(req.params.id);

    res.send(product);
}

const searchProduct = async (req,res)=>{
    const item = req.params.name;
    const value = req.params.value;

    const itemSearched = await services.searchProductService(item,value);

    if(!itemSearched){
        res.status(404).send("This products wasn't found");
        return;
    }

    res.send(itemSearched);
}

const filteredProducts = async(req,res)=>{
    try{
        //const products = await Product.find(req.query);
        //const products = await Product.find().where('title').equals(req.query.title).where('price').equals(req.query.price);
        //console.log(req);
        let queryStr =JSON.stringify(req.query);
        console.log(queryStr);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        const queryObj = JSON.parse(queryStr);

        const keys = Object.keys(queryObj);
        console.log(keys)

        if(keys.includes("category")){
            const cat = await getCategoryByName(queryObj.category);
            queryObj.category = cat[0]._id;
    
            console.log(cat);
        }

        const products = await services.getFilteredProductsService(queryObj);

        res.status(200).json({
            status:'success',
            length:products.length,
            data:{
                products
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    filteredProducts
}