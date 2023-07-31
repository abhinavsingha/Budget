import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private datePipe: DatePipe) {
  }

  async successAlert(title: string, msg: string, icon: string) {
    // Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
    Swal.fire(title, msg, 'success');
  }

  async faliureAlert(title: string, msg: string, icon: string) {
    Swal.fire(title, msg, 'error');
  }

  async warningAlert(title: string, msg: string, icon: string) {
    Swal.fire(title, msg, 'warning');
  }

  convertDateFormat(date: any) {
    let dateArr = date.split('-');
    return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }
  startDate: Date | undefined;
  checkDate(inputDate:any) {
    if(inputDate==null){
      return true;
    }
    let currentYear = new Date().getFullYear();
    const fiscalYearStartMonth = 3; // 0-indexed, so 3 represents April
    const fiscalYearEndMonth = 2;
    const currentMonth = new Date().getMonth();

    if(currentMonth<fiscalYearStartMonth){
      currentYear=currentYear-1;
    }
    this.startDate = new Date(currentYear, fiscalYearStartMonth, 1);
    console.log(inputDate);
    const date =(new Date(inputDate));
    console.log(date);
    console.log(this.startDate);

    if(date<this.startDate){

      return false;
    }
    else
      return true;
  }
}
