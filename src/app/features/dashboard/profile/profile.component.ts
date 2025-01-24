import { Component, OnInit } from '@angular/core';
import { AuthLogoutService } from 'src/app/core/services/auth-logout.service';
import { FilesService } from '../services/files.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username=localStorage.getItem("username");
  email=localStorage.getItem("email");
  id=localStorage.getItem("id");
  profile_pic:string="";
  file:any;
  file_name:string="";
  constructor(private auth_logout:AuthLogoutService,private fileService:FilesService,private profileService:ProfileService) { }
  
  ngOnInit(): void {
    this.getUserDetails();
  }

  imageForm=new FormGroup({
    image:new FormControl('',[Validators.required])
  })

  getUserDetails(){
    this.profileService.getUserDetails().subscribe((resp:any)=>{
       this.profile_pic=resp.profile_pic;
    });
  }

  onLogout(){
    this.auth_logout.onLogout();
  }

  onSelectingFile(event:Event){
     const input=event.target as HTMLInputElement;
     if(input.files){
       this.file=input.files[0];
       this.file_name=this.file.name;
     }
  }

  uploadImage(){
    const fileName=this.file.name.replace(/\s+/g,'');
    const fileType=this.file.type;
    this.fileService.getPresignedUrl(fileName,fileType).subscribe((resp:any)=>{
      const url=resp.url;
      this.fileService.uploadToServer(url,this.file).subscribe({
        next:(resp:any)=>{
          console.log("Uploaded successfully");
          this.profileService.storeTheUrlOfImage(url).subscribe((resp:any)=>{
            console.log("saved in database");
            console.log(resp);
            this.getUserDetails();
            this.file_name='';
          });
        },
      })
    });
  }

}
