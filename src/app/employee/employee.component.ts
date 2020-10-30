import { Component, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  @Input() employeeDetails: any = [];
  @ViewChild("f") form: NgForm;
  workingHours: string[] = ["4", "6", "8"];
  contractType: string[] = ["permanent", "temporary"];
  permissionType: string[] = ["user", "admin"];
  permissions: string = "";
  hours: number;
  contract: string = '';
  address: string = '';
  telephone: string = '';
  start: string = '';
  editInfo: Boolean = false;
  disabled: Boolean = true;
  modalRef: BsModalRef;
  employeeData;
  employeeIndex;

  @Output() public editEmployee:EventEmitter<any> = new EventEmitter();
  @Output() public removeEmployee:EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService, private router: Router) { }

  removeTab(i: number) {                                                    // delete user from from DB
    this.employeeIndex = {
      "index" : i
    };
    this.removeEmployee.emit(this.employeeIndex);
    this.router.navigateByUrl('/employee-list/delete');
    setTimeout(() => {
      alert(`User ${this.employeeDetails.name} has been successfully deleted from the database.`);
      this.router.navigateByUrl('/employee-list');
    }, 500);
  }

  openModal(employeeTemplate: TemplateRef<any>) {                           // trigger open user details popup
    this.modalRef = this.modalService.show(employeeTemplate);
    this.editInfo = false;
    this.disabled = true;
  }

  editEmployeeInfo() {                                                      // setup edit mode to display edit input fields of form
    this.router.navigateByUrl('/employee-list/edit');
    this.editInfo = true;
    this.disabled = false;
  }

  onSubmit(form: NgForm) {                                                  // insert new user record/edit details in DB
    if (this.permissions === '') {
      this.permissions = this.employeeDetails.permissions;
    }
    if (this.contract === '') {
      this.contract = this.employeeDetails.contract;
    }
    if (this.hours === null) {
      this.hours = this.employeeDetails.hours;
    }
    if (this.address === '') {
      this.address = this.employeeDetails.address;
    }
    if (this.telephone === '') {
      this.telephone = this.employeeDetails.telephone;
    }

    this.employeeData = {
      index: this.employeeDetails.index,
      permissions: this.permissions,
      name: this.employeeDetails.name,
      hours: this.hours,
      contract: this.contract,
      address: this.address,
      telephone: this.telephone,
      start: this.employeeDetails.start
    };
    this.editInfo = false;
    this.disabled = true;

    this.editEmployee.emit(this.employeeData);
    setTimeout(() => {
      this.router.navigateByUrl('/employee-list');
    }, 500);
  }

  onClose() {                                                                 // navigate back to base route and refresh page view
      this.router.navigateByUrl('/employee-list');
  }

}
