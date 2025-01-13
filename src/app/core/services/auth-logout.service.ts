import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthLogoutService {

  constructor(private router:Router) { }

  onLogout(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['auth/login']);
  }
}
