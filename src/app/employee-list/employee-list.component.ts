import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from "../shared.service";


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  resList: any = [];

  constructor(private sharedService: SharedService, private router: Router) { }

  addEmployee(newEmployee){                                             // insert new user in DB
      this.sharedService.submitEmployee(newEmployee);
      this.sharedService.getEmployees().subscribe(data => {
        this.resList = data;
      });
  }

  editEmployee(editEmployee){                                           // edit user details in DB
    this.sharedService.editEmployee(editEmployee);
    this.sharedService.getEmployees().subscribe(data => {
      this.resList = data;
    })
  }

  removeEmployee(index){                                                // delete a user from DB
    this.sharedService.deleteEmployee(index);
    this.sharedService.getEmployees().subscribe(data => {
      this.resList = data;
    });
  }

  logOut() {                                                           // logout and destroy session
    this.router.navigateByUrl('/logout');
  }

  ngOnInit(): void {                                                   // fetch all users from DB
    this.sharedService.getEmployees().subscribe(data => {
      this.resList = data;
    })
  }
}
