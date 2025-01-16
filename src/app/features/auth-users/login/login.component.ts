import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private loginService:LoginService,private router:Router) { }

  ngOnInit(): void {
  }

  loginForm=new FormGroup({
    identifier:new FormControl('',[Validators.required]),
    password:new FormControl('',[Validators.required])
  })
  
  onSubmit(){
      this.loginService.onLogin(this.loginForm.value).subscribe((resp:any)=>{
      if(resp.bool===true){
        sessionStorage.setItem("token",resp.token);
        sessionStorage.setItem("refresh",resp.refresh);
        localStorage.setItem("username",resp.username);
        localStorage.setItem("email",resp.email);
        localStorage.setItem("id",resp.id);
        
        this.router.navigate(['dashboard']);
      }
      else{
        alert(resp.message);
      }
    })
  }

}
