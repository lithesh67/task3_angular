import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl:string=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getUserDetails(){
    return this.http.get(`${this.apiUrl}/getUserDetails`);
  }

  storeTheUrlOfImage(longUrl:string){
    const url=longUrl.split('?')[0];
    return this.http.post( `${this.apiUrl}/updateProfile`,{url});
  }
}
