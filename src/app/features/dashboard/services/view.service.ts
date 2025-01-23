import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilesService } from './files.service';

@Injectable({
  providedIn:'root'
})

export class ViewService {
  apiUrl=environment.apiUrl;
  public viewcheckboxes:any={};
  public viewSelected:any={};
  public tableData:any=[];
  public mainCart:any={};
  public cartProductIds:any={};
  public count:number=0;
  public tick:any=false;
  public selectedCols:any=[];
  public vendors:any=[];
  public categories:any=[];
  constructor(private http:HttpClient,private fileService:FilesService) { }

  getTableData(current_page:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/dashboard?page=${current_page}&limit=${pageSize}`);
  }
 
  getCart(){
    this.mainCart=localStorage.getItem('cart');
    if(this.mainCart){
       return JSON.parse(this.mainCart);
    }
     return {};
  }

  setCart(cart:any){
    localStorage.setItem('cart',JSON.stringify(cart));
  }

  clearData(){
    this.viewcheckboxes={};
    this.viewSelected={};
    this.tableData=[];
    this.mainCart={};
    this.cartProductIds={};
  }

  onConfirmingDelete(product_id:number){
    return this.http.delete(`${this.apiUrl}/deleteProduct?product_id=${product_id}`);
  }
  
  onSearch(text:string,pageSize:number,current_page:number){
    let queries="";
    console.log(this.selectedCols);
    
    for(let col of this.selectedCols){
      queries+=`&filterCols=${col}`
    }
    return this.http.get(`${this.apiUrl}/search?text=${text}&pageSize=${pageSize}&current_page=${current_page}${queries}`);
  }

  onImporting(newData:any){
    return this.http.post(`${this.apiUrl}/importData`,{newData});
  }

  confirmEdit(product_id:number,vendorArray:any,obj:any){
    return this.http.post(`${this.apiUrl}/editProduct`,{product_id,vendorArray,obj})
  }

  addImageForProduct(product_id:number,file:File):Observable<any>{
    const fileName=file.name.replace(/\s+/g,'');
    const fileType=file.type;
    return this.fileService.getPresignedUrl(fileName,fileType).pipe(switchMap((resp:any)=>{
      const url=resp.url;
      return this.fileService.uploadToServer(url,file).pipe(switchMap((resp:any)=>{
        console.log("Uploaded successfully");
        return this.storeTheUrlOfImage(url,product_id)

      }));
    }));
  }
    

  storeTheUrlOfImage(longUrl:string,product_id:number){
    const url=longUrl.split('?')[0];
    return this.http.post(`${this.apiUrl}/uploadProductImage`,{url,product_id});
  }




}
