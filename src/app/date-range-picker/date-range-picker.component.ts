import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  bsValue = new Date();
  // bsRangeValue: Date[];
  maxDate = new Date();
  weekDates: any = [];
  firstWeekDate;
  lastWeekDate;
  weekRange;

  @Output() public dateRange:EventEmitter<any> = new EventEmitter();

  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
    this.firstWeekDate = (this.bsValue.getDate() + "/" + this.bsValue.getMonth() + "/" + this.bsValue.getFullYear()).toString();
    this.lastWeekDate = (this.maxDate.getDate() + "/" + this.maxDate.getMonth() + "/" + this.maxDate.getFullYear()).toString();
    this.weekRange = "Week schedule: " + this.firstWeekDate  + " - " + this.lastWeekDate;
  }

  ngOnInit(): void {                                             // get current date, set up 7 days range for next week and emit to Admin/User Dashboard parent component
    for (let i = 0; i < 7; i++) {
      this.weekDates.push((this.bsValue.getDate() + i) + "/" + (this.bsValue.getMonth() + 1) + "/" + this.bsValue.getFullYear()).toString();
    }
    this.dateRange.emit(this.weekDates);
  }
}
