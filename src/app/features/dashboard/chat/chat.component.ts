import { Component, OnInit } from '@angular/core';
import { allUsersModel } from 'src/app/core/models/chat';
import { ChatService } from '../services/chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  allUsers:Array<allUsersModel>=[];
  existingChats:any=[{username:'akshay2',id:'2'}];
  currentChat:Array<any>=[]
  currentChatId:number| null=null;
  constructor(private chatService:ChatService,private socketService:SocketService) { }

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchExistingChats();
    this.socketService.receiveMessage().subscribe((receivedMessage)=>{
      console.log(receivedMessage);
      if(receivedMessage.userid==this.currentChatId){
        this.currentChat.push(receivedMessage);
      }
    })
  }

  messageForm=new FormGroup({
    message:new FormControl('',[Validators.required])
  })

  fetchAllUsers(){
    this.chatService.getAllUSers().subscribe({
      next:(resp)=>{
        this.allUsers=resp.result;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  fetchExistingChats(){
    this.chatService.fetchExistingChats().subscribe((resp)=>{
      console.log(resp);
      
    })
  }

  onClickingSend(){
    this.socketService.sendMessge(this.messageForm.controls.message.value?.trim()!,2);
  }

  openChatOfUser(){

  }


  createChat(userid:number){
    this.chatService.createChat(userid).subscribe({
      next:(resp)=>{
        console.log(resp);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
