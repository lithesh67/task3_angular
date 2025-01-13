import { Component, OnInit } from '@angular/core';
import { AuthLogoutService } from 'src/app/core/services/auth-logout.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username=localStorage.getItem("username");
  email=localStorage.getItem("email");
  id=localStorage.getItem("id");
  profile_pic:string="";

  constructor(private auth_logout:AuthLogoutService) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.auth_logout.onLogout();
  }

}
