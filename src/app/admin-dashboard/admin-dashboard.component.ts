import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from "../shared.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  employeeList: any = [];
  fullList: any = [];
  dropdown: boolean = false;
  workingEmployees: any = [];
  availableEmployees: any = [];
  date: any;
  ids: any;
  shiftTime: number;
  shiftsArray: any = [];
  employeeData;
  getServerData;
  deteleShift;
  editShiftDetails;
  dateArray: any = [];

  gridSize = 50;

  grids = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

  constructor(private sharedService: SharedService, private router: Router) {}

  getSelectedDate(date) {                                                     // get currently selected date from Date Picker
    return this.date = date;
  }

  getInitialServerData() {                                                    // fetch initial data for the next 7 days from DB
    this.getServerData = {
      date: { $in: this.dateArray }
    };
    this.sharedService.getShiftEmployees(this.getServerData).subscribe(data => {
      this.workingEmployees = data;
    });
  }

  getPosition(i: number) {                                                    // set up shift slider position depending on shift start time record
    let time = this.workingEmployees[i].shiftStart;
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

  remove(index: number, i: number) {                                          // delete work shift from DB
    this.deteleShift = {
      "index": index
    };
    this.sharedService.deleteShiftEmployee(this.deteleShift);
    this.router.navigateByUrl('/admin-dashboard/delete');
    setTimeout(() => {
      alert(`Employee ${this.workingEmployees[i].name} has been removed from the schedule for ${this.workingEmployees[i].date}.`);
      this.router.navigateByUrl('/admin-dashboard');
      this.getInitialServerData();
    }, 500);
  }

  toggleDropdown() {                                                          // fetch users with user permission and display only those that are not yet scheduled for the particular date
    this.dropdown = !this.dropdown;
    if (this.dropdown) {
      this.router.navigateByUrl('/admin-dashboard/new');
    } else {
      this.router.navigateByUrl('/admin-dashboard');
    }
    this.availableEmployees = this.workingEmployees.filter(employee => {
      if (employee.date === this.date) {
        return employee;
      }
    })
    console.log(this.availableEmployees)
    this.ids = new Set(this.availableEmployees.map(({ name }) => name))
    this.employeeList = this.fullList.filter(({ name }) => !this.ids.has(name));
  }

  changeDate(date) {                                                          // get new date on change from Date Picker
    this.date = date;
    this.getInitialServerData();

    this.shiftsArray = [];
    setTimeout(() => {
      this.workingEmployees.map(shift => {
          this.shiftsArray.push({'index': shift.index, 'shiftStart': shift.shiftStart});
      });
    }, 500);
  }

  onMoveEnd(event, i: number) {                                               // track slide movement and record new start time of shift
    switch(event.x) {
      case 0:
        this.shiftTime = this.workingEmployees[i].shiftStart;
        break;
      case 50:
        this.shiftTime = this.workingEmployees[i].shiftStart + 1;
        break;
      case 100:
        this.shiftTime = this.workingEmployees[i].shiftStart + 2;
        break;
      case 150:
        this.shiftTime = this.workingEmployees[i].shiftStart + 3;
        break;
      case 200:
        this.shiftTime = this.workingEmployees[i].shiftStart + 4;
        break;
      case 250:
        this.shiftTime = this.workingEmployees[i].shiftStart + 5;
        break;
      case -50:
        this.shiftTime = this.workingEmployees[i].shiftStart - 1;
        break;
      case -100:
        this.shiftTime = this.workingEmployees[i].shiftStart - 2;
        break;
      case -150:
        this.shiftTime = this.workingEmployees[i].shiftStart - 3;
        break;
      case -200:
        this.shiftTime = this.workingEmployees[i].shiftStart - 4;
        break;
      case -250:
        this.shiftTime = this.workingEmployees[i].shiftStart - 5;
        break;
      default:
        this.shiftTime = this.workingEmployees[i].shiftStart;
    }
  }

  onEdit(i: number) {                                                          // change work shift status and display edit mode
    this.workingEmployees[i].status = false;
    this.shiftTime = this.workingEmployees[i].shiftStart;
    this.router.navigateByUrl('/admin-dashboard/edit');
  }

  onSave(index: number, i: number) {                                           // save shift start time and send out email notification to the affected user if it was a change request
    this.workingEmployees[i].status = true;
    if (this.workingEmployees[i].pending) {
      this.editShiftDetails = {
        "date": this.workingEmployees[i].date,
        "index": index,
        "shiftStart": this.shiftTime,
        "pending": false,
        "userEmail": this.workingEmployees[i].email
      };
    } else {
      this.editShiftDetails = {
        "date": this.workingEmployees[i].date,
        "index": index,
        "shiftStart": this.shiftTime,
        "pending": false
      };
    }
    this.sharedService.editShiftEmployee(this.editShiftDetails);
    alert(`The shift start time for ${this.workingEmployees[i].name} on the ${this.workingEmployees[i].date} has been changed to ${this.shiftTime}.`);
    this.router.navigateByUrl('/admin-dashboard');
    this.getInitialServerData();
  }


  onSelect(i: number) {                                                        // select a particular user from dropdwon to add to work schedule
    this.dropdown = false;
    if (this.dropdown) {
      this.router.navigateByUrl('/admin-dashboard/new');
    } else {
      this.router.navigateByUrl('/admin-dashboard');
    }
    this.employeeData = {
      date: this.date,
      index: this.employeeList[i].index,
      email: this.employeeList[i].email,
      name: this.employeeList[i].name,
      hours: this.employeeList[i].hours,
      shiftStart: 10,
      status: true,
      pending: false
    };

    this.sharedService.addShiftEmployee(this.employeeData);

    setTimeout(() => {
      this.router.navigateByUrl('/admin-dashboard');
      this.getInitialServerData();
    }, 500);
  }

  exportSchedule() {                                                          // trigger CSV export of DB work schedule records
    this.router.navigateByUrl('/admin-dashboard/export');
    alert('Your file has been saved in the exports folder.');
    this.sharedService.getCSVExport().subscribe();
    setTimeout(() => {
      this.router.navigateByUrl('/admin-dashboard');
    }, 500);
  }

  logOut() {                                                                  // logout and destroy session
    this.router.navigateByUrl('/logout');
  }

  getDateRange(dateRange) {                                                   // get date range for next 7 days from DateRange Component
    this.dateArray = dateRange;
  }

  ngOnInit() {                                                                // fetch list of users with user permission and fetch initial work schedule list for next 7 days
    this.sharedService.getEmployeeList(this.date).subscribe(data => {
      this.fullList = data;
    });
    this.shiftsArray = [];
    setTimeout(() => {
      this.getInitialServerData();
      this.workingEmployees.map(shift => {
          this.shiftsArray.push({'index': shift.index, 'shiftStart': shift.shiftStart});
      });
    }, 500);
  }
}
