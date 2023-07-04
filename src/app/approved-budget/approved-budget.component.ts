import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantsService } from '../services/constants/constants.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { CommonService } from '../services/common/common.service';
import { SharedService } from '../services/shared/shared.service';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
import {HttpClient} from "@angular/common/http";
import * as Papa from "papaparse";
class TableData {
  Financial_Year: any;
  To_Unit: any;
  From_Unit: any;
  Subhead: any;
  Type: any;
  Allocated_Fund: any;
}

@Component({
  selector: 'app-approved-budget',
  templateUrl: './approved-budget.component.html',
  styleUrls: ['./approved-budget.component.scss'],
})
export class ApprovedBudgetComponent implements OnInit {
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  budgetDataList: any[] = [];

  type: any = '';

  p: number = 1;

  formdata = new FormGroup({
    file: new FormControl(),
    date: new FormControl(),
    authority: new FormControl(),
    authUnit: new FormControl(),
    remarks: new FormControl(),
    reportType:new FormControl('Select Report Type')
  });

  isInboxAndOutbox: any;
  unitData: any;
  invoice: any;
  invoicePath: any;
  private userUnitId: any;
  private dashboardData: any;
  private authGroupId: any;
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    public sharedService: SharedService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.sharedService.updateInbox();
    // this.getCgUnitData();
    if (
      localStorage.getItem('isInboxOrOutbox') != null ||
      localStorage.getItem('isInboxOrOutbox') != undefined
    ) {
      this.isInboxAndOutbox = localStorage.getItem('isInboxOrOutbox');
    }
    if (
      localStorage.getItem('type') != null ||
      localStorage.getItem('type') != undefined
    ) {
      this.type = localStorage.getItem('type');
    }
    this.getAlGroupId(localStorage.getItem('group_id'));
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }
  public userRole: any;
  getDashBoardDta() {
    this.SpinnerService.show();
    var newSubmitJson = null;
    this.apiService
      .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // debugger;
            this.dashboardData=result['response'];
            this.userRole = result['response'].userDetails.role[0].roleName;
            this.userUnitId=result['response'].userDetails.unitId;
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.getCgUnitData();
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
  getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.budgetDataList = result['response'].budgetResponseist;
          if (this.budgetDataList.length > 0) {
            this.authGroupId = this.budgetDataList[0].authGroupId;
          }

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }
  path: any;
  currentUnit: any;

  getCgUnitData() {
    this.SpinnerService.show();
    var comboJson = null;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.unitData = result['response'];
        // if(this.userUnitId==undefined){
        //   var newSubmitJson = null;
        //   this.apiService
        //     .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
        //     .subscribe({
        //       next: (v: object) => {
        //         this.SpinnerService.hide();
        //         let result: { [key: string]: any } = v;
        //         if (result['message'] == 'success') {
        //           debugger;
        //           this.userUnitId=result['response'].userDetails.unitId;
        //
        //         } else {
        //           this.common.faliureAlert('Please try later', result['message'], '');
        //         }
        //       },
        //       error: (e) => {
        //         this.SpinnerService.hide();
        //         console.error(e);
        //         this.common.faliureAlert('Error', e['error']['message'], 'error');
        //       },
        //       complete: () => console.info('complete'),
        //     });
        // }
        let flag=false;
        for(let i=0;i<this.unitData.length;i++){
          if(this.userUnitId=='001321'){
            if(this.unitData[i].unit=='000225')
            {
              this.currentUnit=this.unitData[i];
              this.formdata.get('authUnit')?.setValue(this.currentUnit);
              flag=true;
            }
          }
          else{
            if(this.unitData[i].unit==this.userUnitId){
              this.currentUnit=this.unitData[i];
              this.formdata.get('authUnit')?.setValue(this.currentUnit);
              flag=true;
            }
          }
        }
        if(!flag){
          const addedUnit={
            unit:this.dashboardData.userDetails.unitId,
            descr:this.dashboardData.userDetails.unit
          }
          this.unitData.push(addedUnit);
          this.currentUnit=addedUnit;
        }
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }
  viewFile(file: string) {
    this.apiService.getApi(this.cons.api.fileDownload + file).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        this.openPdfUrlInNewTab(result['response'].pathURL);
        // console.log(result['response'].pathURL);
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
  upload() {
    const file: File = this.invoiceFileInput.nativeElement.files[0];
    // console.log(file);
    const formData = new FormData();
    // console.log(this.formdata.get('file')?.value);
    formData.append('file', file);
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        // debugger;
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
          this.invoice = result['response'].uploadDocId;
          this.invoicePath = result['response'].uploadPathUrl;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
          this.SpinnerService.hide();
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => this.SpinnerService.hide(),
    });
  }
  save(formDataValue: any) {
    let newSubmitJson = {
      authDate: formDataValue.date,
      remark: formDataValue.remarks,
      authUnitId: formDataValue.authUnit.unit,
      authDocId: this.invoice,
      authGroupId: localStorage.getItem('group_id'),
    };
    this.apiService
      .postApi(this.cons.api.saveAuthData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.router.navigate(['/dashboard']);
            this.router.navigateByUrl('/inbox');
            this.getDashBoardDta();
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
  previewURL() {
    window.open(this.invoicePath, '_blank');
  }
  cdaData:any;
  cdaDataAmountUnit:string='';
  getCdaData(cdaData: any) {
    this.cdaData=cdaData;
    if(cdaData.length>0)
      this.cdaDataAmountUnit=cdaData[0].amountType.amountType;
    debugger;
    for(let cda of cdaData){
      cda.remainingAmount=((parseFloat(cda.amountTypeMain.amount)*parseFloat(cda.remainingAmount))/parseFloat(cda.amountType.amount)).toFixed(4);
      cda.available=(parseFloat(cda.amount)+parseFloat(cda.remainingAmount)).toFixed(4);
      cda.amountTypeMain=cda.amountType;
    }
  }
  getAllocationReport(authGroupId: any) {
    this.SpinnerService.show();
    // debugger;
    this.apiService
      .getApi(this.cons.api.getAllocationReport + '/' + authGroupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        // debugger;
        if (result['message'] == 'success') {
          if (result['response'].length > 0) {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
          }
          // this.budgetDataList = result['response'].budgetResponseist;

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }getAllocationReportDocx(authGroupId: any) {
    this.SpinnerService.show();
    // debugger;
    this.apiService
      .getApi(this.cons.api.getAllocationReportDoc + '/' + authGroupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        // debugger;
        if (result['message'] == 'success') {
          if (result['response'].length > 0) {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
            this.path = result['response'][0].path;
          }
          // this.budgetDataList = result['response'].budgetResponseist;

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
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
  downloadReport(formdata:any) {
    // debugger;
    if(formdata.reportType=='02')
      this.getAllocationReport(this.authGroupId);
    else if(formdata.reportType=='03')
      this.getAllocationReportDocx(this.authGroupId);
    else if(formdata.reportType=='01')
      this.downloadCsv();
  }
  generateCSV(
    data: any[],
    columns: string[],
    filename: string,
    column: string[]
  ) {
    const csvData: any[][] = [];

    // Add column names as the first row
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

  downloadCsv() {
    // Example data and column names
    let tableData = [];
    let totalR = 0.0;
    let totalA = 0.0;
    for (let i = 0; i < this.budgetDataList.length; i++) {
      totalA =
        totalA +
        parseFloat(this.budgetDataList[i].allocationAmount) *
        this.budgetDataList[i].amountUnit.amount;
      // totalR=totalR+(parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount);
      let table: any = {
        Financial_Year: this.budgetDataList[i].finYear.finYear.replaceAll(
          ',',
          ' '
        ),
        To_Unit: this.budgetDataList[i].toUnit.descr.replaceAll(',', ' '),
        From_Unit: this.budgetDataList[i].fromUnit.descr.replaceAll(',', ' '),
        Subhead: this.budgetDataList[i].subHead.subHeadDescr.replaceAll(
          ',',
          ' '
        ),
        Type: this.budgetDataList[i].allocTypeId.allocType.replaceAll(',', ' '),
        // Remaining_Amount: (parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount/this.budgetDataList[i].amountUnit.amount).toString(),
        Allocated_Fund: this.budgetDataList[i].allocationAmount
          .replaceAll(',', ' ')
          .toString(),
      };
      if(parseFloat(this.budgetDataList[i].allocationAmount)!=0)
        tableData.push(table);
    }
    let table: TableData = {
      Financial_Year: '',
      To_Unit: '',
      From_Unit: '',
      Subhead: '',
      Type: 'TOTAL',
      Allocated_Fund: (
        parseFloat(totalA.toFixed(4)) /
        parseFloat(this.budgetDataList[0].amountUnit.amount)
      ).toString(),
    };
    tableData.push(table);
    // const data = [
    //   { name: 'John', age: 30, city: 'New York' },
    //   { name: 'Jane', age: 25, city: 'San Francisco' },
    //   { name: 'Bob', age: 35, city: 'Chicago' },
    // ];
    const columns = [
      'Financial_Year',
      'To_Unit',
      'From_Unit',
      'Subhead',
      'Type',
      'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
    ];
    const column = [
      'Financial_Year',
      'To_Unit',
      'From_Unit',
      'Subhead',
      'Type',
      'Allocated_Fund',
    ];
    const filename = this.type + '.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
  }
}
