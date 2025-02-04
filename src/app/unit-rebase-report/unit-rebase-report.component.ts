import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../services/shared/shared.service';
import * as Papa from "papaparse";
import {DatePipe} from "@angular/common";
import {defined} from "chart.js/helpers";

@Component({
  selector: 'app-unit-rebase-report',
  templateUrl: './unit-rebase-report.component.html',
  styleUrls: ['./unit-rebase-report.component.scss'],
})
export class UnitRebaseReportComponent {
  formdata!: FormGroup;
  allunits: any[]=[];

  constructor(
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private common: CommonService
  ) {
    this.formdata = formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reprtType:new FormControl('Select Report Type'),
      toUnit:new FormControl()
    });
  }

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
  }

  async downloadRebaseReport(formdata: any) {
    if(formdata.toUnit==undefined||formdata.toDate==undefined||formdata.fromDate==undefined){
      this.common.faliureAlert('Missing Required Values','Please select all required values','')
      return;
    }
    debugger;
    // var fromDateInMilliseconds = new Date(formdata.fromDate).getTime();
    this.SpinnerService.show();
    debugger;
    let url=this.cons.api.getUnitRebaseReport;
    if(formdata.reprtType=='02')
      url=url+'Doc';
    else if(formdata.reprtType=='03')
      url=url+'Excel';

    (await this.apiService
      .getApi(
        url +
        '/' +
        formdata.fromDate +
        '/' +
        formdata.toDate +
        '/' +
        formdata.toUnit.cbUnit
      ))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          this.formdata.reset();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            if(formdata.reprtType=='03'){
              this.generateReportCsv(result['response']);
            }
            else{ this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
            }
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.info('complete'),
      });
  }

  downloadPdf(pdfUrl: string, fileName: any): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, fileName);
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }
  unit:any;
  fromStation:any;
  rebaseDate:any;
  toStation:any;
  generateReportCsv(response:any) {
    this.unit=response[0].unitName;
    this.fromStation=response[0].fromStation;
    this.rebaseDate=this.datePipe.transform(
      new Date(response[0].dateOfRebase),
      'yyyy-MM-dd'
    );
    this.toStation=response[0].toStation;
    // Example data and column names
    let tableData = [];
    let rebaseList = response[0].list;

    let allocTotal:any=0.0;
    let expTotal:any=0.0;
    let balTotal:any=0.0;

    for(let i=0;i<rebaseList.length;i++){
        debugger;
        if(rebaseList[i].lastCbDate==null){
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':rebaseList[i].finYear+' '+rebaseList[i].allocationType,
            'REVENUE OBJECT HEAD':rebaseList[i].subHead,
            'ALLOCATION IN:(':rebaseList[i].allocationAmount,
            'EXPENDITURE IN:(':rebaseList[i].expenditureAmount,
            'BALANCE IN : (':rebaseList[i].balAmount,
            'LAST CB DATE':'',
          });
        }
        else{
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':rebaseList[i].finYear+' '+rebaseList[i].allocationType,
            'REVENUE OBJECT HEAD':rebaseList[i].subHead,
            'ALLOCATION IN:(':rebaseList[i].allocationAmount,
            'EXPENDITURE IN:(':rebaseList[i].expenditureAmount,
            'BALANCE IN : (':rebaseList[i].balAmount,
            'LAST CB DATE':this.datePipe.transform(new Date(rebaseList[i].lastCbDate),'yyyy-MM-dd'),
          });
        }

        allocTotal=parseFloat(allocTotal)+parseFloat(rebaseList[i].allocationAmount);
        expTotal=parseFloat(expTotal)+parseFloat(rebaseList[i].expenditureAmount);
        balTotal=parseFloat(balTotal)+parseFloat(rebaseList[i].balAmount);
        if(i==rebaseList.length-1){
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':'',
            'REVENUE OBJECT HEAD':'Grand Total',
            'ALLOCATION IN:(':allocTotal,
            'EXPENDITURE IN:(':expTotal,
            'BALANCE IN : (':balTotal,
            'LAST CB DATE':'',
          });
        }
      }
    const columns = [
      'FINANCIAL YEAR & ALLOCATION TYPE',
      'REVENUE OBJECT HEAD',
      'ALLOCATION IN:( '+response[0].list[0].amountType+' )',
      'EXPENDITURE IN:( '+response[0].list[0].amountType+' )' ,
      'BALANCE IN : ( '+response[0].list[0].amountType+' )',
      'LAST CB DATE',
    ];
    const column = [
      'FINANCIAL YEAR & ALLOCATION TYPE',
      'REVENUE OBJECT HEAD',
      'ALLOCATION IN:(',
      'EXPENDITURE IN:(',
      'BALANCE IN : (',
      'LAST CB DATE',
    ];
    const filename = 'UnitRebaseReport.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
    // this.generateCSV([], columns, filename, column);
  }
  generateCSV(data: any[], columns:string[], filename: string, column: string[]) {
    const csvData: any[][] = [];
    // Add column names as the first row
    const headingRow: string[] = [];

      headingRow.push('Unit Name');
      headingRow.push(this.unit);
      headingRow.push('');
      headingRow.push('From Station:');
      headingRow.push(this.fromStation);
      csvData.push(headingRow);
      const headingRow2: string[] = [];
      headingRow2.push('Date of Rebase');
      headingRow2.push(this.rebaseDate);
      headingRow2.push('');
      headingRow2.push('To Station:');
      headingRow2.push(this.toStation);
      csvData.push(headingRow2);
    csvData.push(columns);

    // Add data rows
    data.forEach((item) => {
      const row: string[] = [];
      column.forEach((colmn) => {
        row.push(item[colmn]);
      });
      csvData.push(row);
    });

    // Convert the array to CSV using PapaParse
    const csv = Papa.unparse(csvData);

    // Create a CSV file download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for unsupported browsers
      alert('CSV download is not supported in this browser.');
    }
  }
  checkDate(formdata:any,field:string) {
    debugger;
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let cbDate:string|null;
    if(field=='fromDate'){
      cbDate = this.datePipe.transform(
        new Date(formdata.fromDate),
        'yyyy-MM-dd'
      );
    }
    else{
      cbDate = this.datePipe.transform(
        new Date(formdata.toDate),
        'yyyy-MM-dd'
      );
    }
    if (cbDate != null && date != null) {
      if (cbDate > date) {
        Swal.fire('Date cannot be a future date');
        this.formdata.get(field)?.reset();
        // console.log('date= ' + this.formdata.get('cbDate')?.value);
      }
    }
    let flag:boolean=this.common.checkDate(this.formdata.get(field)?.value);
    if(!flag){
      this.common.warningAlert('Invalid Date','Enter date of this fiscal year only','');
      this.formdata.get(field)?.reset();
    }
    debugger;
    if(this.formdata.get('fromDate')?.value!=undefined&&this.formdata.get('toDate')?.value!=undefined&&this.formdata.get('toDate')?.value!=""&&this.formdata.get('fromDate')?.value!=""){
      debugger;
      this.getRebasedUnits();
    }
  }

  private async getRebasedUnits() {
    this.allunits=[];
    let toDate=(this.formdata.get('toDate')?.value);
    let fromDate=(this.formdata.get('fromDate')?.value);

    debugger;
      this.SpinnerService.show();
      (await this.apiService.getApi(this.cons.api.rebasedUnits + '/' + fromDate + '/' + toDate)).subscribe({
        next: (v: object) => {
          debugger;
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.allunits = result['response'];
            this.SpinnerService.hide();
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.info('complete'),
      });
  }

    protected readonly localStorage = localStorage;
}
