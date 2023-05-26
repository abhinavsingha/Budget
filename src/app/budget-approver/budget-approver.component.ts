import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
// import { DialogComponent } from '../dialog/dialog.component';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared/shared.service';
import { MultiCdaParking } from '../model/multi-cda-parking';
import * as Papa from 'papaparse';
class TableData{
  Financial_Year:any;
  To_Unit:any;
  From_Unit:any;
  Subhead:any;
  Type:any;
  Allocated_Fund:any;
}
@Component({
  selector: 'app-budget-approver',
  templateUrl: './budget-approver.component.html',
  styleUrls: ['./budget-approver.component.scss'],
})
export class BudgetApproverComponent implements OnInit {
  multipleCdaParking: any[] = [];

  budgetDataList: any[] = [];

  type: any = '';

  p: number = 1;

  formdata = new FormGroup({
    remarks: new FormControl(),
  });

  isInboxAndOutbox: any;
  private amountUnitData: any;

  ngOnInit(): void {
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

      if (this.type == 'Budget Reciept') {
        debugger;
        this.getAllGroupIdAndUnitId(this.sharedService.sharedValue);
      } else {
        this.getAlGroupId(localStorage.getItem('group_id'));
      }
    }

    this.getCdaUnitList();
    this.multipleCdaParking.push(new MultiCdaParking());
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }

  constructor(
    // private matDialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    public sharedService: SharedService
  ) {}

  getAllGroupIdAndUnitId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllGroupIdAndUnitId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          for (let i = 0; i < this.budgetDataList.length; i++) {
            if (this.budgetDataList[i].balanceAmount != undefined) {
              this.budgetDataList[i].balanceAmount = parseFloat(
                this.budgetDataList[i].balanceAmount
              ).toFixed(4);
            }
          }
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  cdaUnitList: any[] = [];
  getCdaUnitList() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCdaUnitList).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.cdaUnitList = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  approverConfirmationModel(data: any) {}

  returnConfirmationModel(data: any) {}

  approveForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveFormFinally(formDataValue);
      }
    });
  }

  returnForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Return it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnFormFinally(formDataValue);
      }
    });
  }

  approveFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let cdapark:any[]=[];
    for(let list of this.budgetDataList){
      for(let cda of list.cdaData){
        const entry={
          cdacrDrId:cda.cdaCrdrId,
          allocatedAmount:cda.amount,
          allocatedAmountType:cda.amountTypeMain.amountTypeId
        }
        cdapark.push(entry);
      }
    }
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Approved',
      remarks: formDataValue.remarks,
      cdaParkingId:cdapark
    };
    this.apiService
      .postApi(this.cons.api.approveBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.formdata.reset();
            this.updateInbox();
            this.router.navigateByUrl('/inbox');
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

  returnFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let cdapark:any[]=[];
    for(let list of this.budgetDataList){
      for(let cda of list.cdaData){
        const entry={
          cdacrDrId:cda.cdaCrdrId,
          allocatedAmount:cda.amount,
          allocatedAmountType:cda.amountTypeMain.amountTypeId
        }
        cdapark.push(entry);
      }
    }
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Rejected',
      remarks: formDataValue.remarks,
      cdaParkingId:cdapark
    };
    this.apiService
      .postApi(this.cons.api.approveBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.updateInbox();
            this.formdata.reset();
            this.router.navigateByUrl('/inbox');
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

  totalAmountToAllocateCDAParking: any;
  getCurrentSubHeadData: any;
  showSubmit: boolean = false;
  amountUnit: any;
  showSubHeadDataInNextPage: any;
  addCDAParking(data: any) {
    debugger;
    this.getCurrentSubHeadData = data;
    this.showSubHeadDataInNextPage = data.subHead.subHeadDescr;
    this.amountUnit = data.amountUnit.amountType;
    this.amountUnitData=data.amountUnit;
    this.multipleCdaParking = [];
    this.multipleCdaParking.push(new MultiCdaParking());
    this.totalAmountToAllocateCDAParking = data.allocationAmount;
    this.balancedRemaingCdaParkingAmount = this.totalAmountToAllocateCDAParking;
    this.isdisableSubmitButton = true;
    this.isdisableUpdateButton = true;
    this.showUpdate = false;
    this.showSubmit = true;
  }

  deleteFromMultipleCdaParking(index: any) {
    this.multipleCdaParking.splice(index, 1);
    var amount = 0;
    var unitIndex = this.multipleCdaParking.filter(
      (data) => data.amount != null
    );
    for (var i = 0; i < unitIndex.length; i++) {
      if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
        amount = amount + parseFloat(unitIndex[i].amount);
      }
    }
    this.balancedRemaingCdaParkingAmount = (
      this.totalAmountToAllocateCDAParking - amount
    ).toFixed(4);
    if (
      this.balancedRemaingCdaParkingAmount == '0' ||
      this.balancedRemaingCdaParkingAmount == '0.0000'
    ) {
      this.isdisableSubmitButton = false;
      this.isdisableUpdateButton = false;
    } else {
      this.isdisableSubmitButton = true;
      this.isdisableUpdateButton = true;
    }
  }

  addNewRow() {
    this.multipleCdaParking.push(new MultiCdaParking());
  }

  cdaParkingListResponseData: any[] = [];

  saveCdaParkingData() {
    this.getCurrentSubHeadData;
    this.multipleCdaParking;
    this.cdaParkingListResponseData = [];
    for (var i = 0; i < this.multipleCdaParking.length; i++) {
      this.cdaParkingListResponseData.push({
        amountTypeId:this.amountUnitData.amountTypeId,
        budgetFinancialYearId: this.getCurrentSubHeadData.finYear.serialNo,
        allocationTypeID: this.getCurrentSubHeadData.allocTypeId.allocTypeId,
        ginNo: this.multipleCdaParking[i].cdaParkingUnit.ginNo,
        budgetHeadId: this.getCurrentSubHeadData.subHead.budgetCodeId,
        currentParkingAmount: this.multipleCdaParking[i].cdaParkingUnit.amount,
        availableParkingAmount: this.multipleCdaParking[i].amount,
        authGroupId: this.getCurrentSubHeadData.authGroupId,
        transactionId: this.getCurrentSubHeadData.allocationId,
      });
    }
    this.saveCDAParking(this.cdaParkingListResponseData);
  }

  saveCDAParking(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = {
      cdaRequest: data,
    };

    this.apiService
      .postApi(this.cons.api.saveCdaParkingData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.router.navigate(['/budget-approval']);
            window.location.reload();
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
            this.userRole = result['response'].userDetails.role[0].roleName;

            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
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

  authGroupIdFromBackend: any;
  showUpdate: boolean = false;
  viewCDAParking(budgetData: any) {
    this.amountUnitData=budgetData.amountUnit;
    this.showUpdate = true;
    this.showSubmit = false;
    this.showSubHeadDataInNextPage = budgetData.subHead.subHeadDescr;
    this.getCurrentSubHeadData = budgetData;
    this.amountUnit = budgetData.amountUnit.amountType;
    this.multipleCdaParking = [];
    this.multipleCdaParking.push(new MultiCdaParking());
    this.totalAmountToAllocateCDAParking = budgetData.allocationAmount;
    this.balancedRemaingCdaParkingAmount = '0.0000';
    this.isdisableSubmitButton = true;
    this.isdisableUpdateButton = true;

    this.SpinnerService.show();
    let submitJson = {
      financialYearId: budgetData.finYear.serialNo,
      budgetHeadId: budgetData.subHead.budgetCodeId,
      allocationTypeId: budgetData.allocTypeId.allocTypeId,
    };
    this.apiService
      .postApi(this.cons.api.getCdaDataList, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // multipleCdaParking

            var cdaParkingList = result['response'].cdaParking;
            this.multipleCdaParking = [];

            this.authGroupIdFromBackend = cdaParkingList[0].authGroupId;
            for (var i = 0; i < cdaParkingList.length; i++) {
              var dummyMultipleCdaParkingData = new MultiCdaParking();
              dummyMultipleCdaParkingData.cdaParkingUnit =
                cdaParkingList[i].ginNo;
              dummyMultipleCdaParkingData.amount =
                cdaParkingList[i].totalParkingAmount;
              this.multipleCdaParking.push(dummyMultipleCdaParkingData);
            }

            var amount = 0;
            var unitIndex = this.multipleCdaParking.filter(
              (data) => data.amount != null
            );
            for (var i = 0; i < unitIndex.length; i++) {
              if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
                amount = amount + parseFloat(unitIndex[i].amount);
              }
            }
            this.balancedRemaingCdaParkingAmount = (
              this.totalAmountToAllocateCDAParking - amount
            ).toFixed(4);
            if (
              this.balancedRemaingCdaParkingAmount == '0' ||
              this.balancedRemaingCdaParkingAmount == '0.0000'
            ) {
              this.isdisableSubmitButton = false;
              this.isdisableUpdateButton = false;
            } else {
              this.isdisableSubmitButton = true;
              this.isdisableUpdateButton = true;
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

  balancedRemaingCdaParkingAmount: any;
  isdisableSubmitButton: boolean = true;
  isdisableUpdateButton: boolean = true;
  getCDAParkingAllocatedAmount() {
    var amount = 0;
    var unitIndex = this.multipleCdaParking.filter(
      (data) => data.amount != null
    );
    for (var i = 0; i < unitIndex.length; i++) {
      if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
        amount = amount + parseFloat(unitIndex[i].amount);
      }
    }
    debugger;
    this.balancedRemaingCdaParkingAmount = (
      this.totalAmountToAllocateCDAParking - amount
    ).toFixed(4);
    if (
      this.balancedRemaingCdaParkingAmount == '0' ||
      this.balancedRemaingCdaParkingAmount == '0.0000'
    ) {
      this.isdisableSubmitButton = false;
      this.isdisableUpdateButton = false;
    } else {
      this.isdisableSubmitButton = true;
      this.isdisableUpdateButton = true;
    }
  }

  updateCdaParkingDataApi() {
    this.getCurrentSubHeadData;
    this.multipleCdaParking;
    this.cdaParkingListResponseData = [];
    for (var i = 0; i < this.multipleCdaParking.length; i++) {
      this.cdaParkingListResponseData.push({
        budgetFinancialYearId: this.getCurrentSubHeadData.finYear.serialNo,
        allocationTypeID: this.getCurrentSubHeadData.allocTypeId.allocTypeId,
        ginNo: this.multipleCdaParking[i].cdaParkingUnit.ginNo,
        budgetHeadId: this.getCurrentSubHeadData.subHead.budgetCodeId,
        currentParkingAmount: this.multipleCdaParking[i].cdaParkingUnit.amount,
        availableParkingAmount: this.multipleCdaParking[i].amount,
        authGroupId: this.getCurrentSubHeadData.authGroupId,
      });
    }
    this.updateCdaParkingData(this.cdaParkingListResponseData);
  }

  updateCdaParkingData(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = {
      cdaRequest: data,
      authGroupId: this.authGroupIdFromBackend,
    };

    this.apiService
      .postApi(this.cons.api.updateCdaParkingData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.router.navigate(['/budget-approval']);
            window.location.reload();
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
  updateInbox() {
    this.apiService.getApi(this.cons.api.updateInboxOutBox).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
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
  // generateCsvData(tableData: any[]): string {
  //   // Extract headers
  //   const headers = Object.keys(tableData[0]);
  //
  //   // Extract data rows
  //   const rows = tableData.map(row => {
  //     return headers.map(header => {
  //       return row[header];
  //     });
  //   });
  //
  //   // Combine headers and rows into a CSV string
  //   const csvContent = headers.join(',') + '\n' +
  //     rows.map(row => row.join(',')).join('\n');
  //
  //   return csvContent;
  // }
  //
  // downloadCsv() {
  //   let tableData=[];
  //   let totalR=0.0;
  //   let totalA=0.0;
  //   for(let i=0;i<this.budgetDataList.length;i++){
  //     totalA=totalA+(parseFloat(this.budgetDataList[i].allocationAmount)*this.budgetDataList[i].amountUnit.amount);
  //     totalR=totalR+(parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount);
  //     let table:TableData= {
  //       Financial_Year: this.budgetDataList[i].finYear.finYear.replaceAll(',',' '),
  //       To_Unit: this.budgetDataList[i].toUnit.descr.replaceAll(',',' '),
  //       From_Unit: this.budgetDataList[i].fromUnit.descr.replaceAll(',',' '),
  //       Subhead: this.budgetDataList[i].subHead.subHeadDescr.replaceAll(',',' '),
  //       Type: this.budgetDataList[i].allocTypeId.allocType.replaceAll(',',' '),
  //       Remaining_Amount: this.budgetDataList[i].balanceAmount.replaceAll(',',' ')+' ' +this.budgetDataList[i].remeningBalanceUnit.amountType,
  //       Allocated_Fund: this.budgetDataList[i].allocationAmount.replaceAll(',',' ')+' ' +this.budgetDataList[i].amountUnit.amountType
  //     }
  //     tableData.push(table);
  //   }
  //   let table:TableData= {
  //     Financial_Year: '',
  //     To_Unit: '',
  //     From_Unit: '',
  //     Subhead: '',
  //     Type: 'TOTAL',
  //     Remaining_Amount: (parseFloat(totalR.toFixed(4))/parseFloat(this.budgetDataList[0].amountUnit.amount)).toString()+' ' + this.budgetDataList[0].amountUnit.amountType,
  //     Allocated_Fund: (parseFloat(totalA.toFixed(4))/parseFloat(this.budgetDataList[0].amountUnit.amount)).toString() +' '+ this.budgetDataList[0].amountUnit.amountType
  //   }
  //   tableData.push(table);
  //
  //   // Generate CSV content
  //   const csvContent = this.generateCsvData(tableData);
  //
  //   // Create Blob object from CSV content
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //
  //   // Create download link and click it programmatically
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //
  //   link.download = this.type+'.csv';
  //   link.click();
  //
  //   // Clean up
  //   window.URL.revokeObjectURL(link.href);
  //   document.removeChild(link);
  // }



  generateCSV(data: any[], columns: string[], filename: string,column: string[]) {
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
      let tableData=[];
      let totalR=0.0;
      let totalA=0.0;
      for(let i=0;i<this.budgetDataList.length;i++){
        totalA=totalA+(parseFloat(this.budgetDataList[i].allocationAmount)*this.budgetDataList[i].amountUnit.amount);
        // totalR=totalR+(parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount);
        let table:any= {
          Financial_Year: this.budgetDataList[i].finYear.finYear.replaceAll(',',' '),
          To_Unit: this.budgetDataList[i].toUnit.descr.replaceAll(',',' '),
          From_Unit: this.budgetDataList[i].fromUnit.descr.replaceAll(',',' '),
          Subhead: this.budgetDataList[i].subHead.subHeadDescr.replaceAll(',',' '),
          Type: this.budgetDataList[i].allocTypeId.allocType.replaceAll(',',' '),
          // Remaining_Amount: (parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount/this.budgetDataList[i].amountUnit.amount).toString(),
          Allocated_Fund: (this.budgetDataList[i].allocationAmount.replaceAll(',',' ')).toString()
        }
        tableData.push(table);
      }
      let table:TableData= {
        Financial_Year: '',
        To_Unit: '',
        From_Unit: '',
        Subhead: '',
        Type: 'TOTAL',
        Allocated_Fund: (parseFloat(totalA.toFixed(4))/parseFloat(this.budgetDataList[0].amountUnit.amount)).toString()
      }
      tableData.push(table);
    // const data = [
    //   { name: 'John', age: 30, city: 'New York' },
    //   { name: 'Jane', age: 25, city: 'San Francisco' },
    //   { name: 'Bob', age: 35, city: 'Chicago' },
    // ];
    const columns = ['Financial_Year', 'To_Unit', 'From_Unit','Subhead','Type','Allocated_Fund'+' in '+this.budgetDataList[0].amountUnit.amountType];
    const column = ['Financial_Year', 'To_Unit', 'From_Unit','Subhead','Type','Allocated_Fund'];
    const filename = this.type+'.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
  }
  cdaData:any[]=[]
  cdaDataList(cdaData: any) {

    this.cdaData=cdaData;
    debugger;
  }

  resetCdaList() {
    this.cdaData=[];
  }
}
