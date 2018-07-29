const Product = require('../models/productModel');
const multer =require('multer');
//multer image store
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file : ', file);
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    file.originalname  = Math.random().toString(36).substring(2);
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage }).array('file', 1);
let moreImagesUpload = multer({ storage: storage }).array('uploads[]', 12);

module.exports = (router) => {

  router.post('/imageUpload',function(req, res) {
    upload(req, res, function(err) {
      if (err) {
        return res.send({status:'error', message:"Something went wrong!",error:err});
      }
      return res.send({status:'success', message:"File uploaded successfully!.", fileName:req.files[0].originalname});
    });

  });

  router.post('/moreImagesUpload',function(req, res) {
    moreImagesUpload(req, res, function(err) {
      if (err) {
        return res.send({status:'error', message:"Something went wrong!",error:err});
      }
      return res.send({status:'success', message:"File uploaded successfully!.", files:req.files});
    });

  });

    router.get('/getProducts', function (req, res) {

        Product.find({}, function (err, products) {
            if (err) throw err;

            res.send(products);
        });
    });

    router.get('/singleProduct/:id', function (req, res) {
        var id = req.params.id;

        Product.find({_id: id}, function (err, product) {
            if (err) throw err;

            res.send(product[0]);
        });
    });

    router.delete('/singleProduct', function (req, res) {
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
    });

    router.post('/addProduct',function (req, res) {
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
    });

    router.put('/updateProduct', function (req, res) {
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
    });

    return router;
};
