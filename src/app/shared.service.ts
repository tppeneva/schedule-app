import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  readonly ROOT_URL = "http://localhost:4000";
  private loggedInAdmin = false;
  private loggedInUser = false;
  email;

  constructor(private http: HttpClient) {}

  loginService(employeeDetails) {                                             // check user login credentials and start session
    return this.http.post<any>(`${this.ROOT_URL}/login`, employeeDetails);
  }

  setLoggedInAdmin(value: boolean) {                                          // setup admin login credentials if user has admin permissions
    this.loggedInAdmin = value;
  }

  get isLoggedInAdmin() {                                                     // setup admin login credentials for router
    return this.loggedInAdmin
  }

  setLoggedInUser(value: boolean) {                                           // setup user login credentials if user has admin permissions
    this.loggedInUser = value;
  }

  get isLoggedInUser() {                                                      // setup user login credentials for router
    return this.loggedInUser
  }

  setLoginEmail(email: string) {                                              // get user email on login
    this.email = email;
  }

  get loginEmail() {                                                          // setup user email for emailing on login
    return this.email;
  }

  logoutService() {                                                           // logout and destroy session
    return this.http.get(`${this.ROOT_URL}/logout`);
  }

  getEmployees() {                                                            // fetch full lost of employees from DB
   return this.http.get(`${this.ROOT_URL}/employee-list`);
  }

  submitEmployee(userInput) {                                                 // insert new employee profile into DB
    this.http.post<any>(`${this.ROOT_URL}/employee-list/new`, userInput).subscribe();
  }

  editEmployee(index) {                                                       // update employee profile in DB
    this.http.post<any>(`${this.ROOT_URL}/employee-list/edit`, index).subscribe();
  }

  deleteEmployee(index) {                                                     // delete employee profile from DB
    this.http.post<any>(`${this.ROOT_URL}/employee-list/delete`, index).subscribe();
  }

  getEmployeeList(date) {                                                     // fetch list of all users with user permissions
    return this.http.get<any>(`${this.ROOT_URL}/admin-dashboard`, date);
  }

  getShiftEmployees(date) {                                                   // fetch all work shifts for next 7 days from DB
    return this.http.post<any>(`${this.ROOT_URL}/admin-dashboard`, date);
  }

  addShiftEmployee(employeeDetails) {                                         // add new shift in work schedule for next 7 days
    return this.http.post<any>(`${this.ROOT_URL}/admin-dashboard/new`, employeeDetails).subscribe();
  }

  editShiftEmployee(indexData) {                                              // add a particular shift in work schedule for next 7 days
    return this.http.post<any>(`${this.ROOT_URL}/admin-dashboard/edit`, indexData).subscribe();
  }

  deleteShiftEmployee(indexData) {                                            // remove a particular shift in work schedule for next 7 days
    return this.http.post<any>(`${this.ROOT_URL}/admin-dashboard/delete`, indexData).subscribe();
  }

  getCSVExport() {                                                            // export all work shift records in DB
    return this.http.get(`${this.ROOT_URL}/admin-dashboard/export`);
   }

  getUserShifts(userDetails) {                                                // fetch all work shifts for a particular user for next 7 days from DB
    return this.http.post<any>(`${this.ROOT_URL}/user-dashboard`, userDetails);
  }

  editUserShift(indexData) {                                                  // request a particular shift change
    return this.http.post<any>(`${this.ROOT_URL}/user-dashboard/edit`, indexData).subscribe();
  }

  getAdminList() {                                                            // fetch list of all users with admin permissions
    return this.http.get(`${this.ROOT_URL}/user-dashboard/edit`);
  }
}
