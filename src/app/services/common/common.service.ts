import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {DatePipe} from "@angular/common";
import Decimal from "decimal.js";

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
  // addDecimals(num1: string, num2: string): Promise<string> {
  //   return new Promise((resolve) => {
  //     const [intPart1, decPart1] = num1.split('.').concat('');
  //     const [intPart2, decPart2] = num2.split('.').concat('');
  //
  //     const integerSum = parseInt(intPart1) + parseInt(intPart2);
  //     const decimalSum = parseFloat(`0.${decPart1 || '0'}`) + parseFloat(`0.${decPart2 || '0'}`);
  //
  //     const [decimalIntPart, decimalFractionPart] = decimalSum.toString().split('.').concat('0');
  //
  //     const totalIntegerSum = integerSum + parseInt(decimalIntPart);
  //
  //     const result = `${totalIntegerSum}.${decimalFractionPart}`;
  //     resolve(result);
  //   });
  // }
  // subtractDecimals(num1: string, num2: string): Promise<string> {
  //   return new Promise((resolve) => {
  //     const [intPart1, decPart1] = num1.split('.').concat('');
  //     const [intPart2, decPart2] = num2.split('.').concat('');
  //
  //     let integerDiff = parseInt(intPart1) - parseInt(intPart2);
  //     let decimalDiff = parseFloat(`0.${decPart1 || '0'}`) - parseFloat(`0.${decPart2 || '0'}`);
  //
  //     if (decimalDiff < 0) {
  //       decimalDiff += 1;
  //       integerDiff -= 1;
  //     }
  //
  //     const [decimalIntPart, decimalFractionPart] = decimalDiff.toString().split('.').concat('0');
  //
  //     const result = `${integerDiff}.${decimalFractionPart}`;
  //     resolve(result);
  //   });
  // }
  addDecimals(num1: string, num2: string): Promise<string> {
    return new Promise((resolve) => {
      const decimal1 = new Decimal(num1);
      const decimal2 = new Decimal(num2);
      const result = decimal1.add(decimal2).toString();
      resolve(result);
    });
  }
  subtractDecimals(num1: string, num2: string): Promise<string> {
    return new Promise((resolve) => {
      const decimal1 = new Decimal(num1);
      const decimal2 = new Decimal(num2);
      const result = decimal1.minus(decimal2).toString();
      resolve(result);
    });
  }
  multiplyDecimals(num1: string, num2: string): Promise<string> {
    return new Promise((resolve) => {
      const decimal1 = new Decimal(num1);
      const decimal2 = new Decimal(num2);
      const result = decimal1.times(decimal2).toString();
      resolve(result);
    });
  }
  divideDecimals(num1: string, num2: string): Promise<string> {
    return new Promise((resolve) => {
      const decimal1 = new Decimal(num1);
      const decimal2 = new Decimal(num2);
      const result = decimal1.dividedBy(decimal2).toString();
      resolve(result);
    });
  }
}
