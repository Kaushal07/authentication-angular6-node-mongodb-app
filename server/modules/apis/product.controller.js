const Product = require('../../models/productModel');

class ProductController{
  constructor(app){
    app.get('/getProducts', this.getAllProducts);
    app.post('/addProduct', this.addProduct);
    app.get('/singleProduct/:id', this.getProduct);
    app.put('/updateProduct', this.updateProduct);
    app.delete('/singleProduct', this.deleteProduct);
    app.post('/imageUpload', this.uploadSingleImage);
    app.post('/moreImagesUpload', this.uploadMultipleImage);
  }

  getAllProducts(req,res){
    Product.find({}, function (err, products) {
      if (err) throw err;
       res.send(products);
    });
  }

  addProduct(req,res){
    let product = new Product({
      ProductName:req.body.ProductName,
      ProductPrice:req.body.ProductPrice,
      ProductImage:req.body.ProductImage,
      MoreProductImages:req.body.MoreProductImages
    });
    product.save(function (err, createdProduct) {
      if (err) {
        res.send({
          success: false,
          message: "Product not added"
        });
      } else {
        res.send({
          success: true,
          message: "Product successfully added",
          product: createdProduct
        });
      }
    });
  }

  getProduct(req,res){
    var id = req.params.id;
    Product.find({_id: id}, function (err, product) {
      if (err) throw err;
      res.send(product[0]);
    });
  }

  updateProduct(req,res){
    const productData = req.body;
    Product.findById(productData._id, function (err, product) {
      if (err) {
        res.send(err);
      } else {
        product.ProductName = productData.ProductName;
        product.ProductPrice = productData.ProductPrice;
        product.ProductImage = productData.ProductImage;
        product.MoreProductImages = req.body.MoreProductImages;
        product.save(function (err, book) {
          if (err) {
            res.send(err);
          } else {
            res.send({
              success: true,
              message: "Product successfully updated"
            });
          }
        });
      }
    });

  }

  deleteProduct(req,res){
    var productId = req.query.productId;
    Product.findByIdAndRemove(productId, function (err, product) {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "The request was not completed. Product with id " + product._id + " is not successfully deleted"
        });
      } else {
        res.send({
          success: true,
          message: "Product successfully deleted",
          id: product._id
        });
      }
    });

  }

  uploadSingleImage(req,res){
    global.upload(req, res, function(err) {
      if (err) {
        return res.send({status:'error', message:"Something went wrong!",error:err});
      }
      return res.send({status:'success', message:"File uploaded successfully!.", fileName:req.files[0].originalname});
    });
  }

  uploadMultipleImage(req,res){
    global.moreImagesUpload(req, res, function(err) {
      if (err) {
        return res.send({status:'error', message:"Something went wrong!",error:err});
      }
      return res.send({status:'success', message:"File uploaded successfully!.", files:req.files});
    });
  }

}

module.exports = ProductController;
