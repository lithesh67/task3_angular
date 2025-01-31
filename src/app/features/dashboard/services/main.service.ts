import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilesService } from './files.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {
   apiUrl:string=environment.apiUrl;
   public categories:any=[];
   public vendors:any=[];
   constructor(private http:HttpClient,private fileService:FilesService) { }

   getCategories_vendors(){
     return this.http.get(`${this.apiUrl}/getCategories_vendors`);
   }

   onAddingProduct(obj:any){
     return this.http.post(`${this.apiUrl}/addProduct`,obj);
   }

   addImageForProduct(product_id:number,file:File){
    const fileName=file.name.replace(/\s+/g,'');
    const fileType=file.type;
    this.fileService.getPresignedUrl(fileName,fileType).subscribe((resp:any)=>{
      const url=resp.url;
      this.fileService.uploadToServer(url,file).subscribe({
        next:(resp:any)=>{
          console.log("Uploaded successfully");
          this.storeTheUrlOfImage(url,product_id).subscribe((resp:any)=>{
            console.log("saved in database");
            console.log(resp);
            
          });
        },
      })
    });
   }

  storeTheUrlOfImage(longUrl:string,product_id:number){
    const url=longUrl.split('?')[0];
    return this.http.post(`${this.apiUrl}/uploadProductImage`,{url,product_id});
  }

  updateSelectedQuantity(tempCart:any){
     const tempCartArray=[];
     for(let value of Object.values(tempCart)){
       tempCartArray.push(value);
     }
     return this.http.patch(`${this.apiUrl}/updateQuantity`,{tempCartArray});
  }

  fetchAll(){
     return this.http.get(`${this.apiUrl}/fetchAll`);
  }

  storeTheUrlOfFileImport(url:string,file:File){
    url=url.split('?')[0];
    const obj={url,fileName:file.name,fileType:file.type,fileSize:(file.size).toString(),purpose:'1'};
    return this.http.post(`${this.apiUrl}/UploadFile`,obj);
  }



}
