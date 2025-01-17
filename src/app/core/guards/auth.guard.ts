import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private http:HttpClient,private router:Router){}
  apiUrl=environment.apiUrl;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token=sessionStorage.getItem('token');
    const refresh=sessionStorage.getItem('refresh');
    if(!(token && refresh)){
      this.router.navigate(['auth/login']);
      return false;
    }

   return true;
  }
  
}
