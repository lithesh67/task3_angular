import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { ZipService } from 'src/app/core/services/zip.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  file:any;
  fileData:any;
  tick:any=false;
  selectedFiles:any={};
  constructor(private fileService:FilesService,private zipService:ZipService) { }
  
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

  tickAll(event:Event){
    const checked=(event.target as HTMLInputElement).checked;
    if(checked){
      this.tick=true;
    }
    else{
      this.tick=false;
    }
  }

  onCheckChange(event:Event,index:number){
    const checked=(event.target as HTMLInputElement);
    if(checked){
      this.selectedFiles[index]=true;
    }
    else{
      delete this.selectedFiles[index];
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

  downloadZipFiles(){
    const files=[];
    if(this.tick){
      for(let file of this.fileData){
        files.push(file.file_path);
      }
    }
    else{
      for(let index of Object.keys(this.selectedFiles)){
        files.push(this.fileData[index].file_path);
      }
    }
    if(files.length!=0){
      this.zipService.downloadZip(files); 
    }
  }



}
