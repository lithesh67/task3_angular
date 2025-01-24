import { Component, OnInit } from '@angular/core';
import { ViewService } from '../services/view.service';
import { CartService } from '../services/cart.service';
import { log } from 'console';
import { main } from '@popperjs/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private viewService:ViewService,private cartService:CartService) { }
  cart:any=[];
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
