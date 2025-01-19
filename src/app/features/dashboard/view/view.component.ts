import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewService } from '../services/view.service';
import { generatePDF } from 'src/app/core/utils/pdf';
import { log } from 'console';

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
  @Input() text="";
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['text'].currentValue && this.viewService.selectedCols.length!=0){
      this.viewService.onSearch(changes['text'].currentValue,this.pageSize,this.current_page).subscribe((resp:any)=>{
        this.tableData=resp.tableData;
        
      })
    }
  }
  constructor(private viewService:ViewService) { }

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

}


