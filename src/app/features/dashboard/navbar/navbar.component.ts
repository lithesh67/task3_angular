import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { notifyModel } from 'src/app/core/models/notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  notifications:Array<notifyModel>=[];
  constructor(private navbarSevice:NavbarService) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(){
     this.navbarSevice.getNotifications().subscribe({
      next:(resp)=>{
        this.notifications=resp.result;
        console.log(resp.result);
        }
     })
  }

}
