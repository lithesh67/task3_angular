import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { WindowComponent } from './window/window.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FilesComponent } from './files/files.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';
import { ViewComponent } from './view/view.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { ViewService } from './services/view.service';
import { ImportedFilesComponent } from './imported-files/imported-files.component';


@NgModule({
  declarations: [
    WindowComponent,
    NavbarComponent,
    FilesComponent,
    ProfileComponent,
    MainComponent,
    ViewComponent,
    CartComponent,
    ImportedFilesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
