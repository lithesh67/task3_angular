import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewService } from '../services/view.service';
import { MainService } from '../services/main.service';
import { FilesService } from '../services/files.service';
import { downloadExcel } from 'src/app/core/utils/excel';


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
  filterCols:any[]=[];
  text:string="";
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
    console.log(obj);
    
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
         this.moveCartData.at(-1).selectedQuantity=-1;    
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
    this.viewService.mainCart=this.viewService.getCart();
    this.mainService.updateSelectedQuantity(this.tempCart).subscribe({
      next:(resp)=>{
        console.log(resp);
        for (let [key,value] of Object.entries(this.tempCart)){
          if(this.viewService.mainCart[key]){
            this.viewService.mainCart[key].selectedQuantity+=this.tempCart[key].selectedQuantity;
          }
          else{
            this.viewService.mainCart[key]=this.tempCart[key];
          }
          this.viewService.cartProductIds[key]=true;
        } 
        this.viewService.setCart(this.viewService.mainCart);
        console.log(this.viewService.mainCart);
        this.tempCart=[];
      },
      error:(err)=>{
        console.log(err);
        alert("Some error occured while updating,try again");        
      }

    })
  }

   increase(index:number,product_id:number){
     this.moveCartData[index].selectedQuantity+=-1;
     if(this.tempCart[product_id]){
      this.tempCart[product_id]=this.moveCartData[index];
     }
   }

   decrease(index:number,product_id:number){
     this.moveCartData[index].selectedQuantity+=1;
     if(this.tempCart[product_id]){
      this.tempCart[product_id]=this.moveCartData[index];
     }
   }

   absolute(quantity:number){
     return Math.abs(quantity);
   }

   downloadAll(){
     let data=[];
     const selectedCount = Object.keys(this.viewService.viewSelected).length;
     if(this.viewService.tick){
       this.mainService.fetchAll().subscribe((resp:any)=>{
          downloadExcel(resp.result);
       })
     }
     else{
        for(let value of Object.values(this.viewService.viewSelected)){
          data.push(value);
        }
        downloadExcel(data);
     }
   }

  filterChange(event:Event,column:string){
    const checked=(event.target as HTMLInputElement).checked;
    if(checked){
      this.filterCols.push(column);
    }
    else{
      this.filterCols=this.filterCols.filter(col=>col!=column);
    }
    this.viewService.selectedCols=this.filterCols;
  }

  onSearch(event:Event){
    this.text=(event.target as HTMLInputElement).value;
  }
}
