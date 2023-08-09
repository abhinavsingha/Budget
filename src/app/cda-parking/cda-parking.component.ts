import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { bootstrapApplication } from '@angular/platform-browser';
import {SharedService} from "../services/shared/shared.service";
import {DatePipe} from "@angular/common";
import {MultiCdaParking} from "../model/multi-cda-parking";
class CdaSubRequest {
  allocationTypeID: any;
  ginNo: any;
  budgetHeadId: any;
  currentParkingAmount: any;
  availableParkingAmount: any;
  remark: any;
  budgetFinancialYearId: any;
}
class AuthRequest {
  authority: any;
  authDate: any;
  remark: any;
  authUnitId: any;
  authDocId: any;
}
class CdaRequest {
  cdaRequest: CdaSubRequest[] | undefined;
  authRequests: AuthRequest[] | undefined;
}
class cdaTableData {
  majorHead: any;
  minorHead: any;
  allocationTypeId: any;
  allocationType: any;
  financialYear: any;
  cda: any;
  subHead: any;
  existing: number | undefined;
  current: number | undefined;
  total: number | undefined;
  remarks: any;
  checked: boolean = false;
  ginNo: any;
}
@Component({
  selector: 'app-cda-parking',
  templateUrl: './cda-parking.component.html',
  styleUrls: ['./cda-parking.component.scss'],
})
export class CdaParkingComponent implements OnInit {
  // cdaTableData: cdaTableData[] = [];
  // unitData: any;
  // finYearData: any;
  // majorHeadData: any;
  // minorHeadData: any;
  // subHeadData: any;
  // majorHead: any;
  // formdata = new FormGroup({
  //   currentParking: new FormControl(),
  //   BalanceAvailable: new FormControl(),
  //   budgetType: new FormControl(),
  //   minorHead: new FormControl(), //
  //   unit: new FormControl(), //
  //   finYearName: new FormControl(),
  //   majorHead: new FormControl(),
  //   subHead: new FormControl(),
  //   remarks: new FormControl('', Validators.required),
  //   amountType:new FormControl()
  // });
  // budgetType: any;
  // budgetAllotted: any;
  // cdaData: any;
  // cdaAmountTotal: number = 0.0;
  // cdaCurrentTotal: number = 0.0;
  // cdaTotalTotal: number = 0;
  // authorityUnit: any;
  // authority: any;
  // authorityFile: any;
  // authorityDate: any;
  // @ViewChild('authFileInput') authFileInput: any;
  // authFile: any;

  p: number = 1;
  subHeadList: any[]=[];
  cdaList: any;
  cdaUnitList: any[]=[];
  currentIndex: number=0;
  currentEntry: any;
  totalParking: any;
  isdisableUpdateButton: boolean=true;
  private cdaParkingListResponseData: any[]=[];

  constructor(
    private datePipe: DatePipe,
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    // this.SpinnerService.show();
    // const postdata={
    //   "unitId": "000467",
    //   "budgetFinancialYearId": "01",
    //   "budgetHeadId": ""
    // };
    // this.apiService.postApi(this.cons.api.getDashboardData,postdata).subscribe((results) => {
    //     this.SpinnerService.hide();
    //     $.getScript('assets/js/adminlte.js');
    //     // this.dummydata();
    //     let result: { [key: string]: any } = results;
    //     console.log(result['response']);
    //
    //
    //   },error => {
    //     console.error(error);
    //     this.SpinnerService.hide();
    //   }
    // );
    //   this.getAmountType();
    //   this.getMajorHead();
    //   this.getFinancialYear();
    //   this.getCgUnitData();
    //   this.getBudgetType();
    //   this.getCdaData();
    // }
    // getFinancialYear() {
    //   const tokenValueHeader = localStorage.getItem('newToken');
    //   this.SpinnerService.show();
    //   this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe(
    //     (results) => {
    //       this.SpinnerService.hide();
    //       let result: { [key: string]: any } = results;
    //       this.finYearData = result['response'];
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // }
    // getCgUnitData() {
    //   this.SpinnerService.show();
    //   var comboJson = null;
    //   this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
    //     (res) => {
    //       this.SpinnerService.hide();
    //       let result: { [key: string]: any } = res;
    //       this.unitData = result['response'];
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // }
    // private getMajorHead() {
    //   // const userJson = {userRoleId: "ICGS Delhi", userName: "kya hai ye", userUnitId: "000015"}
    //   this.apiService.getApi(this.cons.api.getMajorData).subscribe({
    //     next: (v: object) => {
    //       let result: { [key: string]: any } = v;
    //       if (result['message'] == 'success') {
    //         localStorage.setItem('newToken', result['response']['token']);
    //         this.majorHeadData = result['response'].subHead;
    //         this.minorHeadData = result['response'].subHead;
    //         this.SpinnerService.hide();
    //       } else {
    //         this.common.faliureAlert('Please try later', result['message'], '');
    //       }
    //     },
    //     error: (e) => {
    //       this.SpinnerService.hide();
    //       console.error('error');
    //     },
    //     complete: () => console.info('complete'),
    //   });
    // }
    // setSubHead() {
    //   this.SpinnerService.show();
    //   let url =
    //     this.cons.api.getAllSubHeadByMajorHead + '/' + this.majorHead.majorHead;
    //   this.apiService.getApi(url).subscribe(
    //     (results) => {
    //       let result: { [key: string]: any } = results;
    //       this.subHeadData = result['response'];
    //       this.SpinnerService.hide();
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // }
    // private getBudgetType() {
    //   this.apiService.getApi(this.cons.api.getAllocationTypeData).subscribe({
    //     next: (v: object) => {
    //       let result: { [key: string]: any } = v;
    //       if (result['message'] == 'success') {
    //         this.budgetType = result['response'];
    //         this.SpinnerService.hide();
    //       } else {
    //         this.common.faliureAlert('Please try later', result['message'], '');
    //       }
    //     },
    //     error: (e) => {
    //       this.SpinnerService.hide();
    //       console.error('error');
    //     },
    //     complete: () => console.info('complete'),
    //   });
    // }
    // invoiceUpload() {
    //   const file: File = this.authFileInput.nativeElement.files[0];
    //   // console.log(file);
    //   const formData = new FormData();
    //   // console.log(this.authorityFile);
    //   formData.append('file', file);
    //   this.SpinnerService.show();
    //   this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
    //     next: (v: object) => {
    //       let result: { [key: string]: any } = v;
    //       if (result['message'] == 'success') {
    //         // console.log('mid' + result['response'].uploadDocId);
    //         // console.info('FILE UPLOADED');
    //         this.authFile = result['response'].uploadDocId;
    //         this.SpinnerService.hide();
    //         this.common.successAlert(
    //           'Success',
    //           result['response']['msg'],
    //           'success'
    //         );
    //       } else {
    //         this.common.faliureAlert('Please try later', result['message'], '');
    //         this.SpinnerService.hide();
    //       }
    //     },
    //   });
    // }
    // viewFile(file: string) {
    //   this.apiService.getApi(this.cons.api.fileDownload + file).subscribe(
    //     (res) => {
    //       let result: { [key: string]: any } = res;
    //       this.openPdfUrlInNewTab(result['response'].pathURL);
    //       // console.log(result['response'].pathURL);
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // }
    // openPdfUrlInNewTab(pdfUrl: string): void {
    //   window.open(pdfUrl, '_blank');
    // }
    // getCdaData() {
    //   this.SpinnerService.show();
    //   // let url=this.cons.api.getCdaData+'/'+this.formdata.get('unit')?.value.unit;
    //   this.apiService.getApi(this.cons.api.getCdaUnitList).subscribe(
    //     (res) => {
    //       this.SpinnerService.hide();
    //       let result: { [key: string]: any } = res;
    //       this.cdaData = result['response'];
    //       if (this.cdaData != undefined) {
    //         for (let i = 0; i < this.cdaData.length; i++) {
    //           this.cdaData[i].current = undefined;
    //           this.cdaData[i].total = this.cdaData[i].amount;
    //           this.cdaData[i].checked = false;
    //           this.cdaAmountTotal = this.cdaAmountTotal + this.cdaData[i].amount;
    //         }
    //       }
    //
    //       this.SpinnerService.hide();
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // }
    // updateCda(cda: any) {
    //   {
    //
    //     if(cda.current==null)
    //       cda.current=0;
    //     cda.current=Number(cda.current).toFixed(4);
    //     this.cdaCurrentTotal = 0;
    //     this.cdaTotalTotal = 0;
    //     for (let i = 0; i < this.cdaData.length; i++) {
    //       if (cda.ginNo == this.cdaData[i].ginNo) {
    //         this.cdaData[i].total =
    //           parseFloat(this.cdaData[i].amount) +
    //           parseFloat(this.cdaData[i].current);
    //       }
    //       if (this.cdaData[i].current != undefined)
    //         this.cdaCurrentTotal =
    //           parseFloat(String(this.cdaCurrentTotal)) +
    //           parseFloat(this.cdaData[i].current);
    //       this.cdaTotalTotal = this.cdaTotalTotal + this.cdaData[i].total;
    //     }
    //     // console.log(this.cdaData);
    //   }
    // }
    // checkFieldsAddCda() {
    //   let flag = false;
    //   let nan = false;
    //   for (let i = 0; i < this.cdaData.length; i++) {
    //     if (this.cdaData[i].checked) {
    //       flag = true;
    //       if (this.cdaData[i].current == null) nan = true;
    //     }
    //   }
    //   if (
    //     this.formdata.get('budgetType')?.value == undefined ||
    //     this.formdata.get('budgetType')?.value == null ||
    //     this.formdata.get('subHead')?.value == undefined ||
    //     this.formdata.get('subHead')?.value == null ||
    //     this.formdata.get('finYearName')?.value == undefined ||
    //     this.formdata.get('finYearName')?.value == null ||
    //     this.formdata.get('majorHead')?.value == undefined ||
    //     this.formdata.get('minorHead')?.value == undefined ||
    //     this.formdata.get('minorHead')?.value == null
    //   ) {
    //     Swal.fire('Enter missing data');
    //   } else if (!flag) {
    //     this.common.faliureAlert('Please select at-least one unit data', '', '');
    //   } else if (nan) {
    //     this.common.faliureAlert('Please enter valid data', '', '');
    //   } else {
    //     this.addCdaData();
    //   }
    // }
    // addCdaData() {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, Add it!',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       for (let i = 0; i < this.cdaData.length; i++) {
    //         if (this.cdaData[i].checked) {
    //           let cdaTableEntry: cdaTableData = {
    //             allocationType: this.formdata.get('budgetType')?.value.allocType,
    //             allocationTypeId: this.formdata.get('budgetType')?.value.allocTypeId,
    //             financialYear: this.formdata.get('finYearName')?.value.finYear,
    //             majorHead: this.formdata.get('majorHead')?.value.majorHead,
    //             minorHead: this.formdata.get('minorHead')?.value.minorHead,
    //             cda: this.cdaData[i].cdaName,
    //             ginNo: this.cdaData[i].ginNo,
    //             subHead: this.formdata.get('subHead')?.value.subHeadDescr,
    //             existing: this.cdaData[i].amount,
    //             current:
    //               this.cdaData[i].current != undefined ? this.cdaData[i].current : 0,
    //             total: this.cdaData[i].total,
    //             remarks:
    //               this.formdata.get('remarks')?.value != null
    //                 ? this.formdata.get('remarks')?.value
    //                 : '',
    //             checked: false,
    //           };
    //           let flag = false;
    //           for (let j = 0; j < this.cdaTableData.length; j++) {
    //             if (
    //               this.cdaTableData[j].ginNo == cdaTableEntry.ginNo &&
    //               this.cdaTableData[j].allocationType ==
    //               cdaTableEntry.allocationType &&
    //               this.cdaTableData[j].financialYear == cdaTableEntry.financialYear &&
    //               this.cdaTableData[j].majorHead == cdaTableEntry.majorHead &&
    //               this.cdaTableData[j].minorHead == cdaTableEntry.minorHead &&
    //               this.cdaTableData[j].subHead == cdaTableEntry.subHead &&
    //               this.cdaTableData[j].remarks == cdaTableEntry.remarks
    //             )
    //               flag = true;
    //           }
    //           if (!flag) this.cdaTableData.push(cdaTableEntry);
    //         }
    //       }
    //     }
    //   });
    //   // console.log(this.cdaTableData);
    // }
    // deleteFromCdaTable() {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, Delete it!',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       for (let i = this.cdaTableData.length-1 ; i >=0 ; i--) {
    //         if (this.cdaTableData[i].checked) {
    //           this.cdaTableData.splice(i, 1);
    //         }
    //       }
    //     }
    //   });
    //
    // }
    // checkSubmitTableData() {
    //   if (
    //     // this.formdata.get('finYearName')?.value==undefined ||
    //     // this.formdata.get('finYearName')?.value==null ||
    //     // this.formdata.get('majorHead')?.value==undefined||
    //     this.authorityUnit == undefined ||
    //     this.authority == undefined ||
    //     this.authorityDate == undefined ||
    //     this.authFile == undefined
    //   ) {
    //     Swal.fire('Enter missing data');
    //   } else if (this.cdaTableData.length == 0) {
    //     Swal.fire('Add data to table before Submit');
    //   } else {
    //     this.confirmModel();
    //   }
    // }
    // submitCdaTableData() {
    //   // for(let j=0;j<this.majorHeadData.length;j++){
    //   //   if(this.majorHeadData[j].majorHead==this.formdata.get('majorHead')?.value.majorHead)
    //   //     budgetId=this.majorHeadData[j].budgetCodeId;
    //   // }
    //   const authArray: AuthRequest[] = [];
    //   const cdaArray: CdaSubRequest[] = [];
    //   for (let i = 0; i < this.cdaTableData.length; i++) {
    //     let budgetId = '';
    //     let finYearId = '';
    //     for (let j = 0; j < this.majorHeadData.length; j++) {
    //       if (
    //         this.majorHeadData[j].majorHead ==
    //         this.cdaTableData[i].majorHead.majorHead
    //       )
    //         budgetId = this.majorHeadData[j].budgetCodeId;
    //     }
    //     for (let j = 0; j < this.finYearData.length; j++) {
    //       if (this.cdaTableData[i].financialYear == this.finYearData[j].finYear)
    //         finYearId = this.finYearData[j].serialNo;
    //     }
    //
    //     let cdaReq: CdaSubRequest = {
    //       allocationTypeID: this.cdaTableData[i].allocationTypeId,
    //       ginNo: this.cdaTableData[i].ginNo,
    //       budgetHeadId: budgetId,
    //       currentParkingAmount: this.cdaTableData[i].current,
    //       availableParkingAmount: this.cdaTableData[i].total,
    //       remark: this.cdaTableData[i].remarks,
    //       budgetFinancialYearId: finYearId,
    //       // this.formdata.get('finYearName')?.value.serialNo
    //     };
    //     cdaArray.push(cdaReq);
    //     let authReq: AuthRequest = {
    //       authority: this.authority,
    //       authDate: this.authorityDate,
    //       remark: this.cdaTableData[i].remarks,
    //       authUnitId: this.authorityUnit.unit,
    //       authDocId: this.authFile,
    //     };
    //     authArray.push(authReq);
    //   }
    //   const cdaReq: CdaRequest = {
    //     cdaRequest: cdaArray,
    //     authRequests: authArray,
    //   };
    //   // console.log(cdaReq);
    //
    //   this.SpinnerService.show();
    //   this.apiService
    //     .postApi(this.cons.api.saveCdaParkingData, cdaReq)
    //     .subscribe({
    //       next: (v: object) => {
    //         let result: { [key: string]: any } = v;
    //         if (result['message'] == 'success') {
    //           // console.log(result['response']);
    //
    //           this.SpinnerService.hide();
    //           this.common.successAlert(
    //             'Success',
    //             result['response']['msg'],
    //             'success'
    //           );
    //         } else {
    //           this.SpinnerService.hide();
    //           this.common.faliureAlert('Please try later', result['message'], '');
    //         }
    //       },
    //       error: (e) => {
    //         this.SpinnerService.hide();
    //         console.error(e);
    //         this.common.faliureAlert('Error', e['error']['message'], 'error');
    //       },
    //     });
    // }
    // amountType: any;
    // getAmountType(){
    //   this.apiService
    //     .getApi(this.cons.api.showAllAmountUnit)
    //     .subscribe({
    //       next: (v: object) => {
    //         this.SpinnerService.hide();
    //         let result: { [key: string]: any } = v;
    //         if (result['message'] == 'success') {
    //           this.amountType = result['response'];
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
    // confirmModel() {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, submit it!',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.submitCdaTableData();
    //     }
    //   });
    // }
    // checkDate(formdata:any) {
    //   const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //   const cbDate = this.datePipe.transform(
    //     new Date(this.authorityDate),
    //     'yyyy-MM-dd'
    //   );
    //   if (cbDate != null && date != null) {
    //     if (cbDate > date) {
    //       Swal.fire('Date cannot be a future date');
    //       this.authorityDate=undefined;
    //       // console.log('date= ' + this.formdata.get('cbDate')?.value);
    //     }
    //   }
    //
    //   let flag:boolean=this.common.checkDate(this.authorityDate);
    //   if(!flag){
    //     this.common.warningAlert('Invalid Date','Enter date of this fiscal year only','');
    //     this.authorityDate=undefined;
    //   }
    //
    // }
    this.getSubheadData();
    this.getCdaUnitList();

  }


  getSubheadData() {
      this.SpinnerService.show();
      this.apiService.getApi(this.cons.api.getAllSubHeadList).subscribe(
        (results) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = results;

          this.subHeadList = result['response'].budgetResponseist;
        debugger;
          },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );

    }

  populateCda(li: any,index:number) {
    this.cdaList=[];
    this.currentIndex=index;
    this.currentEntry=li;
    let sum:number=0;
    for(let cda of li.cdaData){
      sum=sum+Number(cda.remainingAmount);
      let entry:MultiCdaParking={
        id: undefined,
        cdaParkingUnit: cda.ginNo,
        amount: undefined,
        balance: cda.remainingAmount,
        oldData: undefined
      };
      this.cdaList.push(entry);
      this.totalParking=sum;

    }

    debugger;
  }

  private getCdaUnitList() {
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
  deleteFromMultipleCdaParking(index: any) {
    this.cdaList.splice(index, 1);
  }
  addNewRow() {
    this.cdaList.push(new MultiCdaParking());
  }

  checkTotalParking() {

    debugger;
    let sum=0;
    let sum1=0;
    for(let cda of this.cdaList){
      debugger;
      if(cda.amount!=undefined)
        sum=Number(sum)+Number(cda.amount);
      if(cda.balance!=undefined)
        sum1=Number(sum1)+Number(cda.balance);
    }
    this.totalParking=sum1;
    this.totalParking=Number(Number(this.totalParking)-Number(sum)).toFixed(4);
    if(this.totalParking==0){
      this.isdisableUpdateButton=false;
    }
    else{
      this.isdisableUpdateButton=true;
    }
  }

  updateCdaParkingDataApi() {
    this.cdaParkingListResponseData = [];
    debugger;
    for (var i = 0; i < this.cdaList.length; i++) {
      this.cdaParkingListResponseData.push({
        amountTypeId: this.currentEntry.amountUnit.amountTypeId,
        budgetFinancialYearId: this.currentEntry.finYear.serialNo,
        allocationTypeID: this.currentEntry.allocTypeId.allocTypeId,
        ginNo: this.cdaList[i].cdaParkingUnit.ginNo,
        budgetHeadId: this.currentEntry.subHead.budgetCodeId,
        availableParkingAmount: this.cdaList[i].amount,
        authGroupId: this.currentEntry.authGroupId,
        transactionId: this.currentEntry.allocationId,
      });
    }
    debugger;
    this.updateCdaParkingData(this.cdaParkingListResponseData);
  }
  updateCdaParkingData(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = {
      cdaRequest: data,
      authGroupId: this.currentEntry.authGroupId,
    };

    this.apiService
      .postApi(this.cons.api.updateCdaParkingData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.router.navigate(['/budget-approval']);
            // window.location.reload();
            this.common.successAlert('Updated','CDA updated Successfully','')
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.ngOnInit(),
      });
  }
}
