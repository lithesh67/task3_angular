import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewService } from '../services/view.service';
import { MainService } from '../services/main.service';
import { FilesService } from '../services/files.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  moveCartData:any=[];
  tempCart:any={};
  toggle:string="view";
  categories:any=[];
  vendors:any=[];
  file:any;

  constructor(private viewService:ViewService,private mainService:MainService,private fileService:FilesService) { }
 
  getCategories_vendors(){
    this.mainService.getCategories_vendors().subscribe((resp:any)=>{
      this.categories=resp.categories;
      this.vendors=resp.vendors;
    });
  }
   
  ngOnInit(): void {
    this.getCategories_vendors();
  }

  productForm=new FormGroup({
     productName : new FormControl('',[Validators.required]),
     category    : new FormControl('',[Validators.required]),
     vendor      : new FormControl('',[Validators.required]),
     quantity    : new FormControl('',[Validators.required]),
     measure     : new FormControl('',[Validators.required]),
     price       : new FormControl('',[Validators.required]),
    //  status      : new FormControl('',[Validators.required]),
     uploadImg   : new FormControl('')
  });


  onFileSelected(event:Event){
    const input=event.target as HTMLInputElement;
    if(input.files){
       this.file=input.files[0];
    }
  }


  onAddingProduct(){
    const obj={productName:this.productForm.controls.productName.value,
               category_id: this.productForm.controls.category.value,
               vendor_id:this.productForm.controls.vendor.value,
               quantity:this.productForm.controls.quantity.value,
               measure:this.productForm.controls.measure.value,
               price:this.productForm.controls.price.value
    }
    this.mainService.onAddingProduct(obj).subscribe((resp:any)=>{
      if(resp.bool===true && this.file){
         this.mainService.addImageForProduct(resp.product_id,this.file);
       }
    });

        
  }

  onClickingMove(){
    this.moveCartData=[];
    for (let [key,value] of Object.entries(this.viewService.viewSelected)) {
      if(!this.viewService.cartProductIds[key]){
         this.moveCartData.push(value);
         this.moveCartData.at(-1).selectedQuantity=1;    
      }
    }
  }

  onCheckChange(event:Event,index:number,product_id:number){
    const checked=(event.target as HTMLInputElement).checked;
    if(checked){
      this.tempCart[product_id]=this.moveCartData[index];
    }
    else{
      delete this.tempCart[product_id];
    }
    console.log(this.tempCart);
    
  }

  onSavingChanges(){
    for (let [key,value] of Object.entries(this.tempCart)){
      this.viewService.mainCart.push(value);
      this.viewService.cartProductIds[key]=true;
    }
    console.log(this.viewService.mainCart);
    this.tempCart=[];
}

increase(index:number){
  this.moveCartData[index].selectedQuantity+=1;
}

decrease(index:number){
  this.moveCartData[index].selectedQuantity+=-1;
}

}
