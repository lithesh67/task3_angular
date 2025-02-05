import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { allUsersModel } from 'src/app/core/models/chat';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getAllUSers():Observable<any>{
    return this.http.get<{result:Array<allUsersModel>}>(`${this.apiUrl}/allUsers`);
  }

  createChat(user_id:number):Observable<any>{
    return this.http.post(`${this.apiUrl}/createChat`,{receiver_id:user_id});
  }

  fetchExistingChats():Observable<any>{
    return this.http.get(`${this.apiUrl}/existingChats`);
  }
}
