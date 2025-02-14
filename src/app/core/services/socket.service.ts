import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';
import { notifyModel } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket:Socket;
  constructor() {
    const token=sessionStorage.getItem('token');
    this.socket=io('http://localhost:5000',{
    reconnectionDelayMax: 5000,
    auth:{token}
     });
   }

  onNotifying():Observable<notifyModel>{
    return new Observable((observer)=>{
      this.socket.on('notify',(notification)=>{
        observer.next(notification);
      })
    })
  }

  // receiveOnJoin():Observable<any>{
  //   return new Observable((observer)=>{
  //     this.socket.on('added_to_a_group',(message)=>{
  //       console.log(message);
        
  //       observer.next(message);
  //     })
  //   })
  // }

  receiveStatus():Observable<{file_id:number,status:string}>{
    return new Observable((observer)=>{
      this.socket.on('status',(statusUpdate)=>{
        observer.next(statusUpdate);
      })
    })
  }

  sendMessge(message:string,userid:number,chat_id:number){
    this.socket.emit('send_message',{message,userid,chat_id});
  }

  receiveMessage():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('receive_message',(receivedMessage)=>{
        observer.next(receivedMessage);
      })
    })
  }

  joinGroup(chat_id:number,group_name:string,participants:Array<number>){
    this.socket.emit('join_group',{chat_id,group_name,participants});
  }

    
  sendToGroup( group_name:string,message:string,currentChatId:number){
    this.socket.emit('send_to_group',{group_name,message,chat_id:currentChatId});
  }

  

}

