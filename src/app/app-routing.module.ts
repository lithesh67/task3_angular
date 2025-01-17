import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
    canActivate: [AuthGuard],
    loadChildren:()=>import('./features/dashboard/dashboard.module').then(module=>module.DashboardModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
