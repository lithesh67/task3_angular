import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewService } from '../services/view.service';
import { MainService } from '../services/main.service';
import { FilesService } from '../services/files.service';
import { downloadExcel } from 'src/app/core/utils/excel';
import { importFile } from 'src/app/core/utils/import';

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
  fileImport:any;
  filterCols:any[]=['product_name','category','vendor_name','quantity_in_stock','measure'];
  text:string="";
  newTable:any=[];
  checkedBoxes:any={};
  addFile_name:string='';
  import_name:string='';
  valid_import_file:boolean=false;
  constructor(private viewService:ViewService,private mainService:MainService,private fileService:FilesService) { }
 
  getCategories_vendors(){
    this.mainService.getCategories_vendors().subscribe((resp:any)=>{
      this.categories=resp.categories;
      this.vendors=resp.vendors;
      this.viewService.vendors=resp.vendors;
      this.viewService.categories=resp.categories;
      this.viewService.selectedCols=this.filterCols;
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
       this.addFile_name=this.file.name;
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
         this.moveCartData.push(value);
         this.moveCartData.at(-1).selectedQuantity=-1;   
         this.moveCartData.at(-1).selectedVendor=""; 
    }
  }

  onCheckChange(event:Event,index:number,product_id:number){
    const checked=(event.target as HTMLInputElement).checked;
    let tempVendor=this.moveCartData[index].selectedVendor;
    if(checked){
      this.checkedBoxes[index]=true;
    }
    else{
      delete this.checkedBoxes[index];
    }
    
  }

  onSavingChanges(){
    this.viewService.mainCart=this.viewService.getCart();
    for(let index of Object.keys(this.checkedBoxes)){
      let tempVendor=this.moveCartData[index].selectedVendor;
      let tempProduct_id=this.moveCartData[index].product_id;
      if(tempVendor){
        this.tempCart[tempProduct_id+tempVendor]=this.moveCartData[index];
        console.log(this.tempCart[tempProduct_id+tempVendor]);
        // this.viewService.viewSelected[this.moveCartData[index].product_id].quantity_in_stock+=this.moveCartData[index].selectedQuantity;
      }
      console.log(this.tempCart);
      
    }
    this.mainService.updateSelectedQuantity(this.tempCart).subscribe({
      next:(resp)=>{
        console.log(resp);
        console.log(this.tempCart);
        for (let [key,value] of Object.entries(this.tempCart)){
          if(this.viewService.mainCart[key]){
            this.viewService.mainCart[key].quantity_in_stock+=this.tempCart[key].selectedQuantity;
            this.viewService.mainCart[key].selectedQuantity+=this.tempCart[key].selectedQuantity;
          }
          else{
            this.viewService.mainCart[key]=this.tempCart[key];
            this.viewService.mainCart[key].quantity_in_stock+=this.tempCart[key].selectedQuantity;
          }
          let depthProduct_id=this.viewService.mainCart[key].product_id;
          for(let [uniqueKey,val] of Object.entries(this.viewService.mainCart)){
            if(this.viewService.mainCart[uniqueKey].product_id==depthProduct_id){
              this.viewService.mainCart[uniqueKey].quantity_in_stock=this.viewService.mainCart[key].quantity_in_stock;
            }
          }
          this.viewService.cartProductIds[key]=true;      
        } 
        this.viewService.setCart(this.viewService.mainCart);
        console.log(this.viewService.mainCart);
        this.tempCart={};
        this.checkedBoxes={};
        this.moveCartData=[];
      },
      error:(err)=>{
        console.log(err);
        alert("Some error occured while updating,try again");        
      }

    })
  }

   increase(index:number,product_id:number){
     this.moveCartData[index].selectedQuantity+=-1;
   }

   decrease(index:number,product_id:number){
     this.moveCartData[index].selectedQuantity+=1;
   }

   selectingVendor(event:Event,product_id:number,index:number){
     const input=event.target as HTMLInputElement;
     this.moveCartData[index].selectedVendor=input.value;    
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
  
  importFileSelected(event:Event){
    const input=event.target as HTMLInputElement;
    if(input.files){
       this.fileImport=input.files[0];
       this.import_name=input.files[0].name;
       const type=this.fileImport.type;
       if(type.includes('vnd.ms-excel') || type.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
         this.valid_import_file=true; 
       }
    }
  }

  // async importFileAsData(){
  //   this.newTable=await importFile(this.fileImport);
  //   console.log(this.newTable);
    
  // }

  uploadExcelFile(){
    const fileName=this.fileImport.name.replace(/\s+/g,'');
    const fileType=this.fileImport.type;
    this.fileService.getPresignedUrl(fileName,fileType).subscribe((resp:any)=>{
      const url=resp.url;
      console.log(url);
      this.fileService.uploadToServer(url,this.fileImport).subscribe((resp:any)=>{
        console.log("Uploaded successfully");
        this.mainService.storeTheUrlOfFileImport(url,this.fileImport).subscribe({
          next:(resp:any)=>{
            console.log("saved in database");
            alert("Uploaded the file,you may close now");
            console.log(resp);
            this.import_name='';
            this.valid_import_file=false;
          },
          error:(err)=>{
            console.log(err);
            alert("Upload failed,try again");
          }
        });
      })
    })
  }

}
