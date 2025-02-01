import { Component, OnInit } from '@angular/core';
import { ImportedFilesService } from '../services/imported-files.service';
import {  importFilesModel } from 'src/app/core/models/importFiles';
import { SafeResourceUrl,DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.css']
})
export class ImportedFilesComponent implements OnInit {
  importedFiles:Array<importFilesModel>=[];
  previewUrl:SafeResourceUrl | undefined;
  downloadUrl:string="";
  constructor(private importService:ImportedFilesService,private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.getImportedFiles();
  }

  getImportedFiles(){
    this.importService.getImportedFiles().subscribe({
      next:(resp)=>{
         this.importedFiles=resp.result;
         for(let file of this.importedFiles){
           if(file.status=='0'){
            file.status='pending';
           }
           else if(file.status=='1'){
            file.status='processing';
           }
           else{
            file.status='processed';
           }
         }
         console.log(resp);
      }
    });
  }

  onPreview(error_file:string){
    this.previewUrl=this.sanitizer.bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=`+error_file);
    this.downloadUrl=error_file;
  }

}
