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
  is_group:Boolean=false;
  logged_in_id:number=parseInt(localStorage.getItem('id')!);
  currentReceiver:number| null=null;
  receiverName:string="";
  unjoinedGroups:any=[];
  constructor(private chatService:ChatService,private socketService:SocketService) { }

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchExistingChats();
    this.fetchUnjoinedGroups();
    this.socketService.receiveMessage().subscribe((receivedMessage)=>{
      console.log(receivedMessage);
      if(receivedMessage.chat_id==this.currentChatId){
        console.log(receivedMessage.sender_id,this.currentReceiver);
        this.currentChat.push(receivedMessage);
      }
    })
  }

  messageForm=new FormGroup({
    message:new FormControl('',[Validators.required])
  });

  groupForm=new FormGroup({
    groupName:new FormControl('',[Validators.required])
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

  fetchUnjoinedGroups(){
    this.chatService.fetchUnjoinedGroups().subscribe((resp:any)=>{
       this.unjoinedGroups=resp.result;
       console.log(this.unjoinedGroups);
       
    })
  }

  fetchExistingChats(){
    this.chatService.fetchExistingChats().subscribe((resp)=>{
      this.existingChats=resp.result;
      console.log(this.existingChats);
    })
  }

  onClickingSend(){
    const tempMessage=this.messageForm.controls.message.value?.trim()!;
    if(this.is_group && this.currentChatId){
       this.currentChat.push({message:tempMessage,sender_id:this.logged_in_id});
       this.sendToGroup(this.receiverName,tempMessage,this.currentChatId); 
       this.messageForm.reset();
       return
    }
    if(this.currentChatId){
      this.currentChat.push({message:tempMessage,sender_id:this.logged_in_id});
      this.socketService.sendMessge(tempMessage,this.currentReceiver!,this.currentChatId);
      this.messageForm.reset();
   }
  }

  openChatOfUser(chat_id:number,user_id:number,chat_name:string,is_group:boolean){
     this.chatService.getUserChat(chat_id).subscribe({
      next:(resp)=>{
        console.log(resp.result);
        this.currentReceiver=user_id;
        this.receiverName=chat_name;
        this.currentChatId=chat_id;
        this.currentChat=resp.result;
        this.is_group=is_group;
      }
     })
  }


  createChat(userid:number,username:string){
    this.chatService.createChat(userid,username).subscribe({
      next:(resp)=>{
        this.existingChats.push({'chat_id':resp.chat_id,'user_id':userid,'username':username});
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  createGroup(){
    // also add userids of participants later in this array
     const participants:Array<number>=[];
     let  groupName=this.groupForm.controls.groupName.value!;
     this.chatService.createGroup(groupName).subscribe({
      next:(resp)=>{
        participants.push(resp.creator_id);
        this.joinGroup(resp.chat_id,groupName,participants);
        alert("Group created");

      },
      error:(err)=>{
        alert(err.message+" try again");
      }
     })
  }

  joinGroup(chat_id:number,groupName:string,participants:Array<number>){
    this.socketService.joinGroup(chat_id,groupName,participants);
  }

  sendToGroup(group_name:string,message:string,currentChatId:number){
    this.socketService.sendToGroup(group_name,message,currentChatId);
  }

  joinGroupPersonally(group_name:string,chat_id:number){
    this.chatService.joinGroupPersonally(group_name,chat_id).subscribe({
      next:(resp)=>{
        this.joinGroup(chat_id,group_name,[this.logged_in_id]);
        alert(`Joined in ${group_name}`);
      }
    })
  }


}
