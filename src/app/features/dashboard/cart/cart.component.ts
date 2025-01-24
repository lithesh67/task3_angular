import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewService } from '../services/view.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnChanges {

  constructor(private viewService:ViewService,private cartService:CartService) { }
  cart:any=[];
  @Input() text="";
  @Input() toggle="";

  ngOnChanges(changes: SimpleChanges){
    console.log(changes['text'].currentValue);
    
    if(this.toggle=="cart" && this.viewService.selectedCols.length>1){
      this.getCart();
      let tempFilterCols=this.viewService.selectedCols;
      if(tempFilterCols.includes('vendor_name')){
        tempFilterCols.filter((col:any)=>{return col!='vendor_name'});
        tempFilterCols.push('selectedVendor');
      }
      tempFilterCols.filter((col:any)=>{return col!='measure'});
      this.cart.filter((item:any)=>{
        let check=false;
        for(let col of tempFilterCols){
          if(item[col].toString().toLowerCase().includes(this.text.toLowerCase())){
            check=true;
            break;
          }
        }
        return check;
      });
    }
  }

  ngOnInit(): void {
    this.getCart();
  }

  getCart(){
    this.cart=[];
    this.viewService.mainCart=this.viewService.getCart();
    console.log(this.viewService.mainCart);
    
    for(let [key,value] of Object.entries(this.viewService.mainCart)){
       let temp:any=value;
       temp['product_vendor']=key
       this.cart.push(temp);
    }
  } 

  setCart(){
    this.viewService.setCart(this.viewService.mainCart);
  }

  increase(i:number,product_id:number,product_vendor:string){
    console.log(this.cart[i],"before api call");
    this.cartService.updateQuantity(this.cart[i],-1).subscribe({
      next:(resp)=>{
        console.log(resp);
        this.viewService.mainCart[product_vendor].selectedQuantity+=-1;
        this.viewService.mainCart[product_vendor].quantity_in_stock+=-1;
        for(let [key,value] of Object.entries(this.viewService.mainCart)){
           if(this.viewService.mainCart[key].product_id==product_id){
            this.viewService.mainCart[key].quantity_in_stock=this.viewService.mainCart[product_vendor].quantity_in_stock;
           }
        }      
        console.log(this.viewService.mainCart);
        
        this.viewService.setCart(this.viewService.mainCart);
        this.getCart();
      },
      error:(err)=>{
        console.log(err);
        alert("Some error has occured,try again");
      }
    })
  }

  decrease(i:number,product_id:number,product_vendor:string){
    
    this.cartService.updateQuantity(this.cart[i],1).subscribe({
      next:(resp)=>{
        console.log(resp);
        this.viewService.mainCart[product_vendor].selectedQuantity+=1;
        this.viewService.mainCart[product_vendor].quantity_in_stock+=1;
        for(let [key,value] of Object.entries(this.viewService.mainCart)){
          if(this.viewService.mainCart[key].product_id==product_id){
            this.viewService.mainCart[key].quantity_in_stock=this.viewService.mainCart[product_vendor].quantity_in_stock;
          }
       }
        this.viewService.setCart(this.viewService.mainCart);
        this.getCart();
      },
      error:(err)=>{
        console.log(err);
        alert("Some error has occured,try again");
      }
    })

  }

  getAbsolute(num:number){
    return Math.abs(num);
  }

}
