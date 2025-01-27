import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetService } from '../services/reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token:string="";
  constructor(private resetService:ResetService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param)=>{
      this.token=param['token'];
    })
  }
  
  resetForm=new FormGroup({
    password:new FormControl('',[Validators.required,Validators.minLength(8)]),
    confirmPass:new FormControl('',[Validators.required])
  });

  reset(){
    this.resetService.resetPassword(this.resetForm.value.password!,this.token).subscribe({
      next:()=>{
        alert("Password reset successfully");
        this.router.navigate(['/auth/login']);
      },
      error:()=>{
        alert("Some error occoured,try again");
      }
    })
  }
}
