import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  bsValue = new Date();
  colorTheme = 'theme-blue';
  bsConfig;

  @Output() public selectedDate:EventEmitter<any> = new EventEmitter();
  @Output() public changeDate:EventEmitter<any> = new EventEmitter();

  constructor() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  onChange(value: Date): void {                                       // get new date on change and emit to Admin Dashboard parent component
    this.changeDate.emit((value.getDate() + "/" + (value.getMonth() + 1) + "/" + value.getFullYear()).toString());
  }

  ngOnInit(): void {                                                  // get current date and emit to Admin Dashboard parent component
    this.selectedDate.emit((this.bsValue.getDate() + "/" + (this.bsValue.getMonth() + 1) + "/" + this.bsValue.getFullYear()).toString());
  }
}
