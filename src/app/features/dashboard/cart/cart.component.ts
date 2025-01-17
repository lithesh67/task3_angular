import { Component, OnInit } from '@angular/core';
import { ViewService } from '../services/view.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private viewService:ViewService) { }
  cart:any=[];
  ngOnInit(): void {
    this.getCart();
  }

  getCart(){
    this.cart=this.viewService.mainCart;
  }

  increase(i:number){

  }

  decrease(i:number){
    
  }

}
