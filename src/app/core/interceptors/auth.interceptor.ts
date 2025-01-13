import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable ,tap} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token=sessionStorage.getItem("token");
    const refresh=sessionStorage.getItem("refresh");
    const newReq=req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`,
        Refresh: `${refresh}`
      }
    })
    return next.handle(newReq).pipe(tap({
      next:(event:HttpEvent<any>)=>{
         if(event instanceof HttpResponse){
           const newToken=event.headers.get('Authorization');
           if(newToken){
            sessionStorage.setItem("token",newToken);
           }
         }
      }}));
  }
}
