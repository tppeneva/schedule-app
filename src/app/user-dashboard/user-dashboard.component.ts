import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from "../shared.service";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  @ViewChild("f") form: NgForm;
  email: string = '';
  admins: any = [];
  name: string = '';
  editShift: boolean = false;
  workingShifts: any = [];
  shiftTime: number;
  editShiftDetails;
  getUserServerData;
  adminEmail: string = '';
  dateArray: any = [];
  shiftsArray: any = [];

  gridSize = 50;

  grids = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

  constructor(private sharedService: SharedService, private router: Router) {}

  getInitialServerData() {                                             // fetch initial data for the next 7 days from DB
    this.getUserServerData = {
      date: { $in: this.dateArray },
      email: this.email
    };

    this.sharedService.getUserShifts(this.getUserServerData).subscribe(data => {
      return this.workingShifts = data;
    });
  }

  getPosition(i: number) {                                             // set up shift slider position depending on shift start time record
    let time = this.workingShifts[i].shiftStart;
    if (time === 10) {
      return 0;
    }
    if (time === 11) {
      return 50;
    }
    if (time === 12) {
      return 100;
    }
    if (time === 13) {
      return 150;
    }
    if (time === 14) {
      return 200;
    }
    if (time === 15) {
      return 250;
    }
    if (time === 16) {
      return 300;
    }
  }

  onMoveEnd(event, i: number) {                                         // track slide movement and record new start time of shift
    switch(event.x) {
      case 0:
        this.shiftTime = this.workingShifts[i].shiftStart;
        break;
      case 50:
        this.shiftTime = this.workingShifts[i].shiftStart + 1;
        break;
      case 100:
        this.shiftTime = this.workingShifts[i].shiftStart + 2;
        break;
      case 150:
        this.shiftTime = this.workingShifts[i].shiftStart + 3;
        break;
      case 200:
        this.shiftTime = this.workingShifts[i].shiftStart + 4;
        break;
      case 250:
        this.shiftTime = this.workingShifts[i].shiftStart + 5;
        break;
      case -50:
        this.shiftTime = this.workingShifts[i].shiftStart - 1;
        break;
      case -100:
        this.shiftTime = this.workingShifts[i].shiftStart - 2;
        break;
      case -150:
        this.shiftTime = this.workingShifts[i].shiftStart - 3;
        break;
      case -200:
        this.shiftTime = this.workingShifts[i].shiftStart - 4;
        break;
      case -250:
        this.shiftTime = this.workingShifts[i].shiftStart - 5;
        break;
      default:
        this.shiftTime = this.workingShifts[i].shiftStart;
    }
  }

  onEdit(i: number) {                                                     // get admin users list for notifications
    this.workingShifts[i].status = false;
    this.router.navigateByUrl('/user-dashboard/edit');

    setTimeout(() => {
      this.sharedService.getAdminList().subscribe(data => {
        this.admins = data;
      })
      this.editShift = true;
    }, 500);
  }

  onSave(index: number, i: number) {                                      // save shift start time change request and send out email notification to selected admin
    this.editShift = false;
    this.editShiftDetails = {
      "name": this.workingShifts[i].name,
      "date": this.workingShifts[i].date,
      "index": index,
      "shiftStart": this.shiftTime,
      "adminEmail": this.adminEmail,
      "pending": true
    };
    this.sharedService.editUserShift(this.editShiftDetails);
    alert(`Your have requested ${this.shiftTime} as new shift start time for the ${this.workingShifts[i].date}.`);
    this.router.navigateByUrl('/user-dashboard');
    this.getInitialServerData();
  }

  logOut() {                                                             // logout and destroy session
    this.router.navigateByUrl('/logout');
  }

  getDateRange(dateRange) {                                              // get date range for next 7 days from DateRange Component
    this.dateArray = dateRange;
    console.log('Test: ', this.dateArray)
  }

  ngOnInit(): void {                                                     // get user email after login and fetch initial data for next 7 days
    this.email = this.sharedService.loginEmail;

    setTimeout(() => {
      this.getInitialServerData();
    }, 500);
  }

}
