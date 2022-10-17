const fs = require('fs');
const path = require('path');

const rootDir = require('../utility/path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
	//Fetch the previous cart
	static addProduct(id, productPrice){
		fs.readFile(p, (err, fileContent) => {
			let cart = {products: [], totalPrice: 0};
			if(!err){
				cart = JSON.parse(fileContent);
			}
			
			//Analyze the cart => find existing products
			const existingProductIndex = cart.products.findIndex(product => product.id === id);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			
			//Add new / Increase quantity
			if(existingProduct){
				updatedProduct = {...existingProduct};
				updatedProduct.qty = updatedProduct.qty + 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			}
			else{
				updatedProduct = {id: id, qty: 1};
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(p, JSON.stringify(cart), err => {
				console.log(err);
			});
		});
	}
	
	static deleteProduct(id, price){
		fs.readFile(p, (err, fileContent) => {
			if(err){
				return;
			}
			let cart = JSON.parse(fileContent);
			const updatedCart = {...cart};
			const product = updatedCart.products.find(prod => prod.id === id);
			if(!product){
				return;
			}
			updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
			
			updatedCart.totalPrice = updatedCart.totalPrice - product.qty*price;
			
			fs.writeFile(p, JSON.stringify(updatedCart), err => {
				console.log(err);
			});
		});
	}
	
	static getCart(cb)
	{
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if(err){
				cb(null);
			}
			else{
				cb(cart);
			}
		});
	}
	
}