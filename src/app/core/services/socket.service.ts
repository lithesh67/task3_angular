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

  receiveStatus():Observable<{file_id:number,status:string}>{
    return new Observable((observer)=>{
      this.socket.on('status',(statusUpdate)=>{
        observer.next(statusUpdate);
      })
    })
  }

  sendMessge(message:string,userid:number){
    this.socket.emit('send_message',{message,userid:2});
  }

  receiveMessage():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('receive_message',(receivedMessage)=>{
        observer.next(receivedMessage);
      })
    })
  }

  

}

