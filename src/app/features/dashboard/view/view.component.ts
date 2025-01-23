import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewService } from '../services/view.service';
import { generatePDF } from 'src/app/core/utils/pdf';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit,OnChanges {
  pageSize:number=6;
  current_page:number=1;
  totalPages:number=0;
  tableData:any= [];
  checkboxes:any={};
  cartProductIds:any=[];
  deleteId:any;
  vendorId:any;
  tick:any=false;
  vendors:any=[];
  categories:any=[];
  liveEditing:any={};
  editFile:any;
  selectedVendors:any={};
  selectedArray:any=[];
  @Input() text="";
  @Input() newTable=[];
  
  editForm=new FormGroup({
       productName : new FormControl('',[Validators.required]),
       category    : new FormControl('',[Validators.required]),
       vendor      : new FormControl('',[Validators.required]),
       quantity    : new FormControl('',[Validators.required]),
       measure     : new FormControl('',[Validators.required]),
       price       : new FormControl('',[Validators.required]),
       uploadImg   : new FormControl('')
    });

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['text']?.currentValue && this.viewService.selectedCols.length!=0){
      this.viewService.onSearch(changes['text'].currentValue,this.pageSize,this.current_page).subscribe((resp:any)=>{
        this.tableData=resp.tableData;
      })
    }

    if(this.newTable.length>0){
      this.viewService.onImporting(this.newTable).subscribe((resp:any)=>{
        console.log(resp);
        
        this.getItems();
      })
    }
  }
  constructor(private viewService:ViewService,private mainService:MainService) { }

  ngOnInit(): void {
     this.getItems();
  }

  getItems(){
    this.viewService.getTableData(this.current_page,this.pageSize).subscribe((resp:any)=>{
       this.tableData=resp.tableData;
       this.totalPages=Math.ceil(((resp.count)/this.pageSize));
       this.viewService.count=resp.count;
       this.viewService.tableData=this.tableData;
       this.checkboxes=this.viewService.viewcheckboxes;
       this.cartProductIds=this.viewService.cartProductIds;
    });
  }


  pageEvent(current_page:number){
     this.current_page=current_page;
     this.getItems();
  }

  addToCart(event:Event,index:number,product_id:number){
     const checked=(event.target as HTMLInputElement).checked;
      if(checked){
        this.viewService.viewSelected[product_id]=this.tableData[index];
        this.viewService.viewcheckboxes[product_id]=true;
      }
      else{
        delete this.viewService.viewSelected[product_id];
        delete this.viewService.viewcheckboxes[product_id];
      }
      console.log(this.viewService.viewSelected);
      console.log(this.checkboxes);
    }

  onDeleteRequest(product_id:number){
    this.deleteId=product_id;
  }

  onConfirmingDelete(){
     this.viewService.onConfirmingDelete(this.deleteId).subscribe((resp:any)=>{
        if(resp.bool===true){
           this.getItems();
        }
     });
  }

  downloadPDF(index:number){
    generatePDF(this.tableData[index]);
  }

  tickAll(event:Event){
    const checked=(event.target as HTMLInputElement).checked;
    if(checked){
      this.tick=true;
      this.viewService.tick=true;
      
    }
    else{
      this.tick=false;
      this.viewService.tick=false;
      
    }
  }

  onClickingEdit(obj:any){
    this.liveEditing=obj;
    this.selectedVendors={};
    this.selectedArray=[];
    this.categories=this.viewService.categories;
    this.vendors=this.viewService.vendors;
    this.categories=this.viewService.categories;
    this.vendors=this.viewService.vendors;
    let existingVendors=this.liveEditing.vendors.split(',');
    for(let vendor of existingVendors){
       this.selectedVendors[vendor]=true;
    }
    for(let vendor of Object.keys(this.selectedVendors)){
      this.selectedArray.push(vendor);
    }
    
    this.editForm.patchValue({
      productName:this.liveEditing.product_name,
      category:this.liveEditing.category_id,
      quantity:this.liveEditing.quantity_in_stock,
      measure:this.liveEditing.measure,
      price:this.liveEditing.unit_price,
    });
    console.log(this.editForm.value);
    
  }



  onConfirmingEdit(product_id:number){
    const obj={productName:this.editForm.controls.productName.value,
      category_id: this.editForm.controls.category.value,
      quantity:this.editForm.controls.quantity.value,
      measure:this.editForm.controls.measure.value,
      price:this.editForm.controls.price.value
    }
    
    let vendor_id_array=[];
    for(let vendor of this.vendors){
      if(this.selectedVendors[vendor.vendor_name]){
        vendor_id_array.push(vendor.vendor_id);
      }
    }
    this.viewService.confirmEdit(product_id,vendor_id_array,obj).subscribe((resp:any)=>{
      console.log(resp);
      if(this.editFile){
        this.viewService.addImageForProduct(product_id,this.editFile).subscribe((resp:any)=>{
          console.log("Saved in database");
          console.log(resp);
          this.getItems();
      });
      }
      else{
        this.getItems();
      }
    });
  }

  onFileSelected(event:Event){
     const input=(event.target as HTMLInputElement);
     if(input.files){
      this.editFile=input.files[0];
     }
  }

  removeVendors(vendor:string){
    delete this.selectedVendors[vendor];
    this.selectedArray=[];
    for(let vendor of Object.keys(this.selectedVendors)){
      this.selectedArray.push(vendor);
    }
  }

  vendorChange(event:Event){
    const value=(event.target as HTMLSelectElement).value;
    if(value){
      this.selectedArray=[];
      this.selectedVendors[value]=true;
      for(let vendor of Object.keys(this.selectedVendors)){
        this.selectedArray.push(vendor);
      }
    }
  }

}


