import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { importFilesModel } from 'src/app/core/models/importFiles';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportedFilesService {
  apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getImportedFiles():Observable<any>{
    return this.http.get<{result:Array<importFilesModel>}>(`${this.apiUrl}/importedFiles`);
  }
}


