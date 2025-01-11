import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthUsersRoutingModule } from './auth-users-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AuthUsersRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthUsersModule { }
