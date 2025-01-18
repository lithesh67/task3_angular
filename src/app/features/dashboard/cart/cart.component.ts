import { Component, OnInit } from '@angular/core';
import { ViewService } from '../services/view.service';
import { CartService } from '../services/cart.service';

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
    this.viewService.mainCart=this.viewService.getCart();
    console.log(this.viewService.mainCart);
    
    for(let [key,value] of Object.entries(this.viewService.mainCart)){
       this.cart.push(value);
    }
  } 

  setCart(){
    this.viewService.setCart(this.viewService.mainCart);
  }

  increase(i:number,product_id:number){
    console.log(this.cart[i],"before api call");
    this.cartService.updateQuantity(this.cart[i],-1).subscribe({
      next:(resp)=>{
        console.log(resp);
        this.viewService.mainCart[product_id].selectedQuantity+=-1;
        this.viewService.mainCart[product_id].quantity_in_stock+=-1;
        this.cart[i]=this.viewService.mainCart[product_id];      
        this.viewService.setCart(this.viewService.mainCart);
      },
      error:(err)=>{
        console.log(err);
        alert("Some error has occured,try again");
      }
    })
  }

  decrease(i:number,product_id:number){
    
    this.cartService.updateQuantity(this.cart[i],1).subscribe({
      next:(resp)=>{
        console.log(resp);
        this.viewService.mainCart[product_id].selectedQuantity+=1;
        this.viewService.mainCart[product_id].quantity_in_stock+=1;
        this.cart[i]=this.viewService.mainCart[product_id];
        this.viewService.setCart(this.viewService.mainCart);
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
