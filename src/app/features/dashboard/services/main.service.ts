import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilesService } from './files.service';
import { FormGroup } from '@angular/forms';

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
          this.storeTheUrlOfImage(url).subscribe((resp:any)=>{
            console.log("saved in database");
            console.log(resp);
            return resp;
          });
        },
      })
    });
   }


storeTheUrlOfImage(longUrl:string){
   const url=longUrl.split('?')[0];
   return this.http.post(`${this.apiUrl}/uploadProductImage`,{url});
}

}
