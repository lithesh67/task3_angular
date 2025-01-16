import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  file:any;
  fileData:any;
  constructor(private fileService:FilesService) { }
  
  getFiles(){
    this.fileService.getFiles().subscribe((resp:any)=>{
      this.fileData=resp.fileData;
      console.log(this.fileData);
      
    })
  }

  ngOnInit(): void {
    this.getFiles();
  }

  fileUploadForm=new FormGroup({
     file:new FormControl('',[Validators.required])
  })

  onAddingFile(event:Event){
    const input=event.target as HTMLInputElement;
    if(input.files){
      this.file=input.files[0];
    }
  }

  uploadFile(){
    const fileName=this.file.name.replace(/\s+/g,'');
    const fileType=this.file.type;
    this.fileService.getPresignedUrl(fileName,fileType).subscribe((resp:any)=>{
      const url=resp.url;
      console.log(url);
      
      this.fileService.uploadToServer(url,this.file).subscribe((resp:any)=>{
        console.log("Uploaded successfully");
        this.fileService.storeTheUrlOfFile(url,this.file).subscribe((resp:any)=>{
           console.log("Saved in database");
           console.log(resp);
           this.getFiles();
        })
      })
    })
      
  }

}
