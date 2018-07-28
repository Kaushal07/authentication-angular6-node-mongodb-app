import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {ProductService} from '../shared/product.service';
import {Product} from '../shared/product.model';


@Component({
  selector: 'add-edit-product',
  templateUrl: './add-edit-product.component.html'
})
export class AddEditProductComponent implements OnInit {
  isEditMode:any;
  ProductObj : Product = new Product
  (  null, null,'');
  noFileSelected:boolean=false;
  editObjData:any;
  filesToUpload: Array<File> = [];
  numberRegex = "^[0-9]*$";
  imageUploaded :boolean=true;



  constructor(private router: Router, private http: Http, private route: ActivatedRoute,
              private productService : ProductService ) {
  }

  ngOnInit() {
    if(this.route.snapshot.data['product']) {
      this.editObjData = this.route.snapshot.data['product'];
      this.ProductObj = this.editObjData;
      this.isEditMode = true;
    }
  }

  checkProductImageSelectedOrNot(){
    if(!this.filesToUpload.length){
      this.noFileSelected = true;
      return false;
    }else{
      this.noFileSelected = false;
      return true;
    }

  }

  getProductImage(fileInput) {
    this.noFileSelected = false;
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.ProductObj.ProductImage = fileInput.target.files[0]['name'];
    this.productService.imageUpload(this.filesToUpload).subscribe((res)=>{
      if(res.status === 'success'){
        this.imageUploaded = true;
        this.ProductObj.ProductImage = res.fileName;
      }else{
        this.imageUploaded = false;
        this.noFileSelected = false;
      }
    },(e)=>{
    })
  }

  addProduct(form) {
    if (this.checkProductImageSelectedOrNot() && this.imageUploaded && form.valid)  {
      this.productService.addProduct(this.ProductObj).subscribe((res)=>{
        this.router.navigate(['/product/list']);
        },(e)=>{

      })
    }
  }

  updateProduct(form){
    if(this.ProductObj.ProductImage && this.imageUploaded &&form.valid){
      this.productService.updateProduct( this.ProductObj).subscribe((res) => {
        this.router.navigate(['/product/list']);
      }, (e)=>{
        })
    }
  }

}
