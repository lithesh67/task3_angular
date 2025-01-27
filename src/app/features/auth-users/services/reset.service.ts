import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  resetPassword(password:string,token:string){
    return this.http.post(`${this.apiUrl}/reset`,{password,token});
  }
}
