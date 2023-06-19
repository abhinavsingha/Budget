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

@Component({
  selector: 'app-unit-rebase-report',
  templateUrl: './unit-rebase-report.component.html',
  styleUrls: ['./unit-rebase-report.component.scss'],
})
export class UnitRebaseReportComponent {
  formdata!: FormGroup;

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
      reprtType:new FormControl('Select Report Type')
    });
  }

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
  }

  downloadRebaseReport(formdata: any) {
    // var fromDateInMilliseconds = new Date(formdata.fromDate).getTime();
    this.SpinnerService.show();
    debugger;
    let url=this.cons.api.getUnitRebaseReport;
    if(formdata.reprtType=='02')
      url=url+'Doc';
    else if(formdata.reprtType=='03')
      url=url+'Excel'
    this.apiService
      .getApi(
        url +
          '/' +
          formdata.fromDate +
          '/' +
          formdata.toDate
      )
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
            );}

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

        if(rebaseList[i].lastCbDate==null){
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':rebaseList[i].finYear+' '+rebaseList[i].allocationType,
            'REVENUE OBJECT HEAD':rebaseList[i].subHead,
            'ALLOCATION IN:(':rebaseList[i].allocationAmount,
            'EXPENDITURE IN:(INR)':rebaseList[i].expenditureAmount,
            'BALANCE IN : (':rebaseList[i].balAmount,
            'LAST CB DATE':'',
          });
        }
        else{
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':rebaseList[i].finYear+' '+rebaseList[i].allocationType,
            'REVENUE OBJECT HEAD':rebaseList[i].subHead,
            'ALLOCATION IN:(':rebaseList[i].allocationAmount,
            'EXPENDITURE IN:(INR)':rebaseList[i].expenditureAmount,
            'BALANCE IN : (':rebaseList[i].balAmount,
            'LAST CB DATE':this.datePipe.transform(new Date(rebaseList[i].lastCbDate),'yyyy-MM-dd'),
          });
        }

        allocTotal=parseFloat(allocTotal)+parseFloat(rebaseList[i].allocationAmount);
        expTotal=parseFloat(expTotal)+parseFloat(rebaseList[i].expenditureAmount);
        balTotal=parseFloat(balTotal)+parseFloat(rebaseList[i].balAmount);
        if(i=rebaseList.length-1){
          tableData.push({
            'FINANCIAL YEAR & ALLOCATION TYPE':'',
            'REVENUE OBJECT HEAD':'Grand Total',
            'ALLOCATION IN:(':allocTotal,
            'EXPENDITURE IN:(INR)':expTotal,
            'BALANCE IN : (':balTotal,
            'LAST CB DATE':'',
          });
        }
      }
    const columns = [
      'FINANCIAL YEAR & ALLOCATION TYPE',
      'REVENUE OBJECT HEAD',
      'ALLOCATION IN:( '+response[0].list[0].amountType+' )',
      'EXPENDITURE IN:(INR)',
      'BALANCE IN : ( '+response[0].list[0].amountType+' )',
      'LAST CB DATE',
    ];
    const column = [
      'FINANCIAL YEAR & ALLOCATION TYPE',
      'REVENUE OBJECT HEAD',
      'ALLOCATION IN:(',
      'EXPENDITURE IN:(INR)',
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
}
