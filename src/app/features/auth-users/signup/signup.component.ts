import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fieldRequired:string="This field is required"
  constructor(private signupService:SignupService) { }

  ngOnInit(): void {
  }

  signupForm=new FormGroup({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)])
  })
  
  onSubmit(){
    this.signupService.onSignup(this.signupForm.value).subscribe((resp:any)=>{
      if(resp.bool==true){
        alert("user registered successfully");
      }
      else{
        alert(resp.message);
      }
    });
  }
}
