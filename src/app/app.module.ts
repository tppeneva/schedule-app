import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AngularDraggableModule } from 'angular2-draggable';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from './auth.guard';
import { AuthUserGuard } from './auth-user.guard';
import { SharedService } from './shared.service';
import { LogoutComponent } from './logout/logout.component';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmployeeListComponent,
    AddEmployeeComponent,
    LoginComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    LogoutComponent,
    DateRangePickerComponent,
    DatePickerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularDraggableModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [SharedService, AuthGuard, AuthUserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
