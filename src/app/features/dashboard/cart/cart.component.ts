import { Component, OnInit } from '@angular/core';
import { ViewService } from '../services/view.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private viewService:ViewService) { }
  cart:any=[]
  ngOnInit(): void {
    this.cart=this.viewService.moveToCart;
  }

}
