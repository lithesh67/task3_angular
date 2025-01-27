import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthUsersRoutingModule } from './auth-users-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthUsersRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AuthUsersModule { }
 