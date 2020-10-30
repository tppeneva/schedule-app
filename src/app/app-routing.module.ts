import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthUserGuard } from './auth-user.guard';
import { AuthGuard } from './auth.guard';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent,
  canActivate: [AuthGuard],
  children: [
    { path: 'new', component: AdminDashboardComponent },
    { path: 'edit', component: AdminDashboardComponent },
    { path: 'delete', component: AdminDashboardComponent },
    { path: 'export', component: AdminDashboardComponent }
  ]
  },
  { path: 'user-dashboard', component: UserDashboardComponent,
  canActivate: [AuthUserGuard],
  children: [
    { path: 'edit', component: UserDashboardComponent },
  ]
  },
  { path: 'employee-list', component: EmployeeListComponent,
  canActivate: [AuthGuard],
  children: [
    { path: 'new', component: EmployeeListComponent },
    { path: 'edit', component: EmployeeListComponent },
    { path: 'delete', component: EmployeeListComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
