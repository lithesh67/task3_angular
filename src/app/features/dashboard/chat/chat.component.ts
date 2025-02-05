import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  existingChats:any=[];
  currentChat:Array<any>=[]
  currentChatId:number| null=null;
  currentReceiver:number| null=null;
  constructor(private chatService:ChatService,private socketService:SocketService,
              private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchExistingChats();
    this.socketService.receiveMessage().subscribe((receivedMessage)=>{
      console.log(receivedMessage);
      if(receivedMessage.sender_id==this.currentReceiver){
        console.log(receivedMessage.sender_id,this.currentReceiver);
        
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
      this.existingChats=resp.result;
    })
  }

  onClickingSend(){
    if(this.currentChatId){
      const tempMessage=this.messageForm.controls.message.value?.trim()!;
      this.socketService.sendMessge(tempMessage,this.currentReceiver!,this.currentChatId);
   }
  }

  openChatOfUser(chat_id:number,user_id:number){
     this.chatService.getUserChat(chat_id).subscribe({
      next:(resp)=>{
        console.log(resp.result);
        this.currentReceiver=user_id;
        this.currentChatId=chat_id;
        this.currentChat=resp.result;
      }
     })
  }


  createChat(userid:number,username:string){
    this.chatService.createChat(userid).subscribe({
      next:(resp)=>{
        this.existingChats.push({'chat_id':resp.chat_id,'user_id':userid,'username':username})
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
