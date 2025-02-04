import {  Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { notifyModel } from 'src/app/core/models/notification';
import { SocketService } from 'src/app/core/services/socket.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  notifications:Array<notifyModel>=[];
  unmarked_count:number=0;
  constructor(private navbarSevice:NavbarService,private socketService: SocketService,) { }

  ngOnInit(): void {
    this.socketService.onNotifying().subscribe((notification)=>{
      let temp=[notification]
      for(let note of this.notifications){
        temp.push(note);
      }
      this.notifications=temp;
      console.log(this.notifications);
      
      this.updateCount();
  
    });
    this.getNotifications();

  }

  getNotifications(){
     this.navbarSevice.getNotifications().subscribe({
      next:(resp)=>{
        this.notifications=resp.result;
        console.log(resp.result);
        this.updateCount();
        }
     });
  }

  updateCount(){
    let count=0;
    for(let note of this.notifications){
      if(note.is_read=='0'){
        count+=1
      }
    }
    this.unmarked_count=count;
  }

  markRead(notification_id:number){
    console.log(notification_id);
    
    this.navbarSevice.markRead(notification_id).subscribe({
      next:(resp)=>{
        console.log(resp.result);
        this.notifications=this.notifications.map((note)=>{
          if(note.notification_id==notification_id){
            note.is_read='1';
          }
          return note;
        });
        this.updateCount();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
