import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

   apiUrl:string=environment.apiUrl;
  constructor(private http:HttpClient) { }
  
  getPresignedUrl(fileKey:string,fileType:string){
    fileKey=`akv0767/${fileKey}`;
    return this.http.get(`${this.apiUrl}/getUrl?fileKey=${fileKey}&fileType=${fileType}`);
  }

  uploadToServer(url:string,file:File){
    return this.http.put(url,file,{headers:{'Content-Type':file.type}});
  }

  storeTheUrlOfFile(url:string,file:File){
    url=url.split('?')[0];
    const obj={url,fileName:file.name,fileType:file.type,fileSize:file.size};
    return this.http.post(`${this.apiUrl}/UploadFile`,obj);
  }

  getFiles(){
    return this.http.get(`${this.apiUrl}/getFiles`);
  }
  
}
