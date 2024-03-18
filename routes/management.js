const express = require('express');
// const uuid = require('uuid');

const router = express.Router();
const productsDal = require('../services/pg.products.dal.js')

router.get('/', async (req, res) => {
//   const theProducts = [
//       {product_id: '1', product_name: 'example', quantity_on_hand: 'example', wholesale_price: 'example', retail_price: 'example', profit: 'example'},
//       {product_id: '2', product_name: 'example', quantity_on_hand: 'example', wholesale_price: 'example', retail_price: 'example', profit: 'example'},
//       {product_id: '3', product_name: 'example', quantity_on_hand: 'example', wholesale_price: 'example', retail_price: 'example', profit: 'example'},
//       {product_id: '4', product_name: 'example', quantity_on_hand: 'example', wholesale_price: 'example', retail_price: 'example', profit: 'example'},
//   ];
  try {
        const success = req.query.success;
        let theProducts = await productsDal.getProducts(); 
        if(DEBUG) console.log(theProducts);
        res.render('management.ejs', {theProducts, success: success});
  } catch {
        res.render('503');
  }
});

router.get('/new-product', async (req, res) => {
      try { 
            if(DEBUG) console.log("add-new-product-page");
            res.render('new-product.ejs');
      } catch {
            res.render('503');
      }
    });

router.post('/new-product', async (req, res) => {
    if(DEBUG) console.log("posting-new-product");
    try {
        await productsDal.addProduct(req.body.product_id, req.body.product_name, req.body.quantity_on_hand, req.body.wholesale_price, req.body.retail_price);
        res.redirect('/management?success=Product added successfully!')
    } catch (err){
        if(DEBUG) console.log(err);
        // log this error to an error log file.
        res.render('error', { error: err.detail});
    } 
  });

router.get('/delete/:product_id', async (req, res) => {
    const productId = req.params.product_id;
    const productByID = await productsDal.getProductByProductId(productId);
    if (DEBUG) console.log(productByID);

    const productName = productByID[0].product_name;
    const quantityOnHand = productByID[0].quantity_on_hand;
    const wholesalePrice = productByID[0].wholesale_price;
    const retailPrice = productByID[0].retail_price;
    const profit = productByID[0].profit;

    if (DEBUG) console.log('product.Delete : ' + productName + " " + productId);
    res.render('delete-product.ejs', {product_id: productId, product_name: productName, quantity_on_hand: quantityOnHand, wholesale_price: wholesalePrice, retail_price: retailPrice, profit: profit});
});


router.delete('/delete/:product_id', async (req, res) => {
    const productByID = await productsDal.getProductByProductId(req.params.product_id);
    const productName = productByID[0].product_name;
    if(DEBUG) console.log('product.DELETE: ' + productName + " " + req.params.product_id);
    try {
        await productsDal.deleteProduct(req.params.product_id);
        res.redirect('/management?success=Product deleted successfully!')
    } catch (err){
        if (DEBUG) console.log(err);
        res.render('error', { error: err});
        // log this error to an error log file. 
    }
  });

module.exports = router