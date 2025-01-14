import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  apiUrl=environment.apiUrl;
  public checkboxes:any={};
  public moveToCart:any={};
  public tableData:any=[];
  constructor(private http:HttpClient) { }

  getTableData(current_page:number,pageSize:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/dashboard?page=${current_page}&limit=${pageSize}`);
  }


}
