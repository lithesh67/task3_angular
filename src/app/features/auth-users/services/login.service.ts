import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
   constructor(private http:HttpClient) { }
   apiUrl=environment.apiUrl;
   onLogin(loginData:any):Observable<any>{
     return this.http.post(`${this.apiUrl}/login`,loginData);
   }
}
