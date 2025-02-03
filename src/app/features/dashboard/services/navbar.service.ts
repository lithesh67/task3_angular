import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { notifyModel } from 'src/app/core/models/notification';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getNotifications():Observable<any>{
    return this.http.get<{result:Array<notifyModel>}>(`${this.apiUrl}/notifications`);
  }

  markRead(notification_id:number):Observable<any>{
    return this.http.patch<{message:string}>(`${this.apiUrl}/markRead`,{notification_id});
  }
  

}
