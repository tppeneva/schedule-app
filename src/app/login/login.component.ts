import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from "../shared.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errors: any = "";
  @ViewChild("f") form: NgForm;
  email: string = "";
  password: string = "";
  successLogin: boolean = false;
  permissionType: string = '';
  employeeDetails;
  showErrors: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  onSubmit(form: NgForm) {                                             // post request validate user credentials, display errors and grant access to routes according to user permissions
    this.employeeDetails = {
      email: this.email,
      password: this.password
    };

    this.sharedService.loginService(this.employeeDetails).subscribe(data => {
      if (data.message != '') {
        this.showErrors = true;
      } else {
        this.showErrors = false;
      }
      this.errors = data.message;
      this.successLogin = data.success;
      this.permissionType = data.permissions;
    });

    if (this.successLogin) {
      this.sharedService.setLoginEmail(this.email);
      if (this.permissionType == 'admin') {
        this.router.navigateByUrl('/admin-dashboard');
        this.sharedService.setLoggedInAdmin(true);
      }
      if (this.permissionType == 'user') {
        this.router.navigateByUrl('/user-dashboard');
        this.sharedService.setLoggedInUser(true);
      }
    }
  }

}
