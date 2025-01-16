import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpEventType
} from '@angular/common/http';
import { Observable ,tap} from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token=sessionStorage.getItem("token");
    const refresh=sessionStorage.getItem("refresh");
    if (req.url.includes('s3.ap-south-1.amazonaws.com')) {
      return next.handle(req);
    }
    
    const newReq=req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
        Refresh: `${refresh}`
      }
    })
    return next.handle(newReq).pipe(tap({
      next:(event:HttpEvent<any>)=>{
         if(event.type===HttpEventType.Response){
          const newToken=event.headers.get("Authorization") || event.headers.get('authorization'); 
          console.log(newToken);
          
           if(newToken){
            console.log("received new token");
            sessionStorage.setItem("token",newToken);
           }
         }
      }}));
  }
}
