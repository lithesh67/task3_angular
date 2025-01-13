import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { WindowComponent } from './window/window.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FilesComponent } from './files/files.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    WindowComponent,
    NavbarComponent,
    FilesComponent,
    ProfileComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
