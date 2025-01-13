import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo:'auth/login',
    pathMatch:'full'
  },
  {
    path:'auth',
    loadChildren:()=>import('./features/auth-users/auth-users.module').then(module=>module.AuthUsersModule),
  },
  {
    path:'dashboard',
    loadChildren:()=>import('./features/dashboard/dashboard.module').then(module=>module.DashboardModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
