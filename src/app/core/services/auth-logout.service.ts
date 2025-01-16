import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ViewService } from 'src/app/features/dashboard/services/view.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLogoutService {

  constructor(private router:Router,private viewService:ViewService) { }

  onLogout(){
    localStorage.clear();
    sessionStorage.clear();
    this.viewService.clearData();
    this.router.navigate(['auth/login']);
  }
}
