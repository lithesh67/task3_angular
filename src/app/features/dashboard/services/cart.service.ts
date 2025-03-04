import {  HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) 
  { }
  updateQuantity(singleProduct:any,num:number){ 
    console.log(singleProduct);
     
    const product_id=singleProduct.product_id;
    const quantity_in_stock=singleProduct.quantity_in_stock;
    const selectedQuantity=num;
    const obj={product_id,quantity_in_stock,selectedQuantity};
    const tempCartArray=[obj];
    return this.http.patch(`${this.apiUrl}/updateQuantity`,{tempCartArray});
  }

  removeFromCart(product_id:number,selectedQuantity:number,stock:number){
    return this.http.patch(`${this.apiUrl}/removeFromCart`,{product_id,selectedQuantity,stock});
  }

}
