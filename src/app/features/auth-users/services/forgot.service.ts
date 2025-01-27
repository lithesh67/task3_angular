import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  forgotPassword(email:string){
     return this.http.post(`${this.apiUrl}/forgotPassword`,{email});
  }
}
