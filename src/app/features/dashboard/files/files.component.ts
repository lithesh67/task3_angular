import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { ZipService } from 'src/app/core/services/zip.service';
import { SafeResourceUrl ,DomSanitizer} from '@angular/platform-browser';
import { Files } from 'src/app/core/models/files';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  file:any;
  fileData:Array<Files>=[];
  tick:any=false;
  selectedFiles:any={};
  previewFileType:any;
  previewFilePath:SafeResourceUrl | undefined
  file_name:string="";
  constructor(private fileService:FilesService,private zipService:ZipService,private sanitizer:DomSanitizer) { }

  
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
      this.file_name=this.file.name;
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
    const checked=(event.target as HTMLInputElement).checked;
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
    let files=[];
    if(this.tick){
      for(let file of this.fileData){
        files.push(file.file_path);
      }
    }
    else{
      for(let index of Object.keys(this.selectedFiles)){
        let Index=Number(index);
        files.push(this.fileData[Index].file_path);
      }
    }
    if(files.length!=0){
      this.zipService.downloadZip(files); 
    }
  }

  reqFilePreview(fileRecord:any){
    if(fileRecord.file_type.includes('application') && !fileRecord.file_type.includes('pdf')){
      this.previewFilePath=this.sanitizer.bypassSecurityTrustResourceUrl(`https://view.officeapps.live.com/op/embed.aspx?src=`+fileRecord.file_path);
    }
    else{
    this.previewFilePath=this.sanitizer.bypassSecurityTrustResourceUrl(fileRecord.file_path);
    }
    this.previewFileType=fileRecord.file_type;
  }

  filetype(fileType:string):string{
    if(!this.previewFileType){
      return '';
    }
    if(fileType.includes('image')){
      return 'image';
    }
    else if(fileType.includes('audio')){
      return 'audio';
    }
    else if(fileType.includes('video')){
      return 'video';
    }
    else if(fileType.includes('pdf')){
      return 'pdf';
    }
    else if(fileType.includes('application')){
      return 'application';
    }
    return 'application';
  }

 getNum(file_size:string){
  return Number(file_size);
 }

}
