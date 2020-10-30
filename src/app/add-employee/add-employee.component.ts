import { Component, TemplateRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  @ViewChild("f") form: NgForm;
  @Input()  employeeList: any[];
  employeeName: string;
  workingHours: string[] = ["4", "6", "8"];
  contractType: string[] = ["permanent", "temporary"];
  permissionType: string[] = ["user", "admin"];
  permissions: string = "user";
  email: string = "";
  password: string = "";
  hours: number = 4;
  contract: string = "permanent";
  address: string = "";
  telephone: string = "";
  start: string = "";
  modalRef: BsModalRef;
  newEmployee;
  index;

  @Output() public addEmployee:EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private router: Router) { }

  openModal(addNewTemplate: TemplateRef<any>) {                         // trigger open form popup to add new user record
    this.router.navigateByUrl('/employee-list/new');
    this.modalRef = this.modalService.show(addNewTemplate);
  }

  onSubmit(form: NgForm) {                                              // insert new user record into DB
    this.newEmployee = {
      index: Math.floor(Date.now() / 1000),
      email: this.email,
      password: this.password,
      permissions: this.permissions,
      name: this.employeeName,
      hours: this.hours,
      contract: this.contract,
      address: this.address,
      telephone: this.telephone,
      start: this.start
    };

    this.addEmployee.emit(this.newEmployee);

    form.resetForm();
    this.router.navigateByUrl('/employee-list');
  }

  onClose() {                                                          // navigate back to base route and refresh page view
    this.router.navigateByUrl('/employee-list');
  }

}
