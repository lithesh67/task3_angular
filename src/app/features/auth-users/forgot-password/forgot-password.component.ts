import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotService } from '../services/forgot.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private forgotService:ForgotService) { }

  ngOnInit(): void {
  }
  
  forgotForm=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email])
  })

  onSubmit(){
    this.forgotService.forgotPassword(this.forgotForm.value.email!).subscribe({
      next:()=>{
        alert("Reset link is sent to registered email");
      },
      error(err) {
        console.log(err);
        alert("Email is not registered");    
      }
    })
  }

}
