import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import Swal from 'sweetalert2';
// import { NgSelectModule } from '@ng-select/ng-select';
// import {Component, OnInit, ViewChild} from '@angular/core';

class CdaParkingReportList {
  financialYear: any;
  unit: any;
  // subhead: any;
  SubHead: any;
  CDA: any;
  total: any;
}

class TableDataList {
  financialYear: any;
  cda: any;
  subhead: any;
  unit: any;
}

interface cpr {
  subHead: any;
  minorHead: any;
  majorHead: any;
  // budgetAllocated:any;
}

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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

@Component({
  selector: 'app-cda-parking-report',
  templateUrl: './cda-parking-report.component.html',
  styleUrls: ['./cda-parking-report.component.scss'],
})
export class CdaParkingReportComponent implements OnInit {
  budgetFinYears: any[] = [];
  allunits: any[] = [];
  subHeads: any[] = [];
  budgetCda: any[] = [];
  budgetType: any[] = [];
  // authorityUnits: any[] = [];
  cdaTableData: cdaTableData[] = [];
  // cdaParkingReportTable: CdaParkRepoTable[] = [];
  tableDataList: TableDataList[] = [];
  majorHeadList: any[] = [];
  cdaParkingReportList: CdaParkingReportList[] = [];
  CdaParkingReport: any;

  majorHeadData: any;
  minorHeadData: any;
  // tableDataList:any
  subHeadData: any;
  // budgetAllotted: any;
  authorityUnit: any;
  authority: any;
  authorityFile: any;
  authorityDate: any;
  finYearData: any;

  submitted = false;

  p: number = 1;
  length: number = 0;

  selectedCb: any;
  cprList: cpr[] = [];
  disabled: boolean = true;

  formdata = new FormGroup({
    finYear: new FormControl(),
    subHead: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    toUnit: new FormControl(),
    cdas: new FormControl(),
  });

  updateBudgetFormData = new FormGroup({
    // transactionId: new FormControl(),
    // majorHead: new FormControl(),
    cdas: new FormControl(),
    subHead: new FormControl(),
  });

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.getSubHeadsData();
    this.getCdaData();
    this.majorDataNew();
  }

  @ViewChild('authFileInput') authFileInput: any;
  private authFile: any;
  constructor(
    private httpService: ApiCallingServiceService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService // private select :NgSelectModule
  ) {}

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  getCgUnitData() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getSubHeadsData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadsData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.subHeads = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  majorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.majorHeadList = result['response'].subHead;
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  majorHeadChange(selectedMajorHead: any, formdataValue: any) {
    this.formdata.patchValue({
      minorHead: selectedMajorHead.minorHead,
    });
  }

  // getCdaData
  getCdaData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCdaData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetCda = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getCdaParkingReport() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getCdaParkingReport, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.CdaParkingReport = result['response'];
          for (
            let i = 0;
            i < this.CdaParkingReport.cdaParkingReportList.length;
            i++
          ) {
            const dataEntry: CdaParkingReportList = {
              financialYear:
                this.CdaParkingReport.cdaParkingReportList[i].financialYearId
                  .finYear,
              unit: this.CdaParkingReport.cdaParkingReportList[i].unit.descr,

              SubHead:
                this.CdaParkingReport.cdaParkingReportList[i].subHead
                  .subHeadDescr,
              CDA: this.CdaParkingReport.cdaParkingReportList[i].type,
              total: 0,
              // subhead: undefined
            };
            this.cdaParkingReportList.push(dataEntry);
          }

          console.log('DATA>>>>>>>' + this.CdaParkingReport);
          this.draw();
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

  viewData(data: any) {
    debugger;
    this.cdaParkingReportList = [];
    this.SpinnerService.show();
    let submitJson = {
      budgetFinancialYearId: data.finYear.serialNo,
      unitId: data.toUnit.unit,
    };
    this.apiService.getApi(this.cons.api.getCdaParkingReport).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.CdaParkingReport = result['response'];
          for (
            let i = 0;
            i < this.CdaParkingReport.cdaParkingReportList.length;
            i++
          ) {
            const dataEntry: CdaParkingReportList = {
              financialYear:
                this.CdaParkingReport.cdaParkingReportList[i].financialYearId
                  .finYear,
              unit: this.CdaParkingReport.cdaParkingReportList[i].unit
                .cgUnitShort,
              SubHead:
                this.CdaParkingReport.cdaParkingReportList[i].subHead
                  .budgetCodeId,
              CDA: this.CdaParkingReport.cdaParkingReportList[i].cda,
              // SubHead: undefined,
              total: 0,
            };

            this.cdaParkingReportList.push(dataEntry);
          }
          debugger;
          for (let i = 0; i < this.cdaParkingReportList.length; i++) {
            if (
              this.formdata.get('finYear')?.value.finYear !=
                this.cdaParkingReportList[i].financialYear ||
              // this.formdata.get('unit')?.value.Tounit !=
              this.cdaParkingReportList[i].unit ||
              this.formdata.get('subHead')?.value.subHeadDescr !=
                this.cdaParkingReportList[i].SubHead
              //   ||
              // this.formdata.get('type')?.value.type !=
              //   this.allocationRepoList[i].type ||
              // this.formdata.get('amount')?.value.amount !=
              //   this.allocationRepoList[i].amount ||
              // this.formdata.get('remarks')?.value.remarks !=
              //   this.allocationRepoList[i].Remarks
            ) {
              this.cdaParkingReportList.pop();
            }
          }
          // console.log('DATA>>>>>>>'+this.dasboardData);
          // this.draw();
          this.SpinnerService.hide(); // debugger;
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

  draw() {
    throw new Error('Method not implemented.');
  }
}

// getCdaData() {
//   this.SpinnerService.show();

//   this.apiService.postApi(this.cons.api.getCdaData,null).subscribe({
//     next: (v: object) => {
//       this.SpinnerService.hide();
//       let result: { [key: string]: any } = v;

//       if (result['message'] == 'success') {
//         this.budgetCda = result['response'];
//         for(let i=0;i<this.budgetCda.cdaParkingReportTable.length;i++){
//           // let unit='';
//           // let finyear='';
//           // for(let j=0;j<this.allunits.length;j++){
//           //   if(this.dasboardData.unitWiseExpenditureList[i].unit==this.allunits[j].unit){
//           //     unit=this.allunits[j].descr;
//           //   }
//           // }
//           // for(let j=0;j<this.budgetFinYears.length;j++){
//           //   if(this.dasboardData.unitWiseExpenditureList[i].financialYearId==this.budgetFinYears[j].serialNo){
//           //     finyear=this.budgetFinYears[j].finYear;
//           //   }
//           // }
//           const dataEntry:CdaParkRepoTable= {
//             financialYear: this.budgetCda.cdaParkingReportTable[i].financialYearId.finYear,
//             subhead: this.budgetCda.cdaParkingReportTable[i].subHead.subHeadDescr,
//             CDA: this.budgetCda.cdaParkingReportTable[i].CDA.descr,
//             SubHead: undefined,
//             total: undefined,
//             unit: undefined
//           }
//           this.cdaParkingReportTable.push(dataEntry);
//         }

//         console.log('DATA>>>>>>>'+this.budgetCda);
//         this.draw();
//         debugger;
//       } else {
//         this.common.faliureAlert('Please try later', result['message'], '');
//       }
//     },
//     error: (e) => {
//       this.SpinnerService.hide();
//       console.error(e);
//       this.common.faliureAlert('Error', e['error']['message'], 'error');
//     },
//     complete: () => console.info('complete'),
//   });
// }
// draw() {
//   throw new Error('Method not implemented.');
// }

// viewData() {
//   this.cdaParkingReportTable=[];
//   this.SpinnerService.show();

//   this.apiService.postApi(this.cons.api.getDashBoardDta,null).subscribe({
//     next: (v: object) => {
//       this.SpinnerService.hide();
//       let result: { [key: string]: any } = v;

//       if (result['message'] == 'success') {
//         this.budgetCda = result['response'];
//         for(let i=0;i<this.budgetCda.cdaParkingReportTable.length;i++){
//           const dataEntry:CdaParkRepoTable= {
//             unit: this.budgetCda.cdaParkingReportTable[i].unit.descr,
//             financialYear: this.budgetCda.cdaParkingReportTable[i].financialYearId.finYear,
//             subhead: this.budgetCda.cdaParkingReportTable[i].subHead.subHeadDescr,
//             CDA: this.budgetCda.cdaParkingReportTable[i].CDA,
//             SubHead: undefined,
//             total: undefined
//           }

//           this.cdaParkingReportTable.push(dataEntry);
//         }
//         for(let i=0;i<this.cdaParkingReportTable.length;i++){

//           if(this.formdata.get('finYear')?.value.finYear!=this.cdaParkingReportTable[i].financialYear||this.formdata.get('unit')?.value.descr!=this.cdaParkingReportTable[i].unit||this.formdata.get('subHead')?.value.subHeadDescr!=this.cdaParkingReportTable[i].subhead){
//             debugger;
//             this.cdaParkingReportTable.pop();
//           }
//         }
//         // console.log('DATA>>>>>>>'+this.dasboardData);
//         // this.draw();
//       this.SpinnerService.hide();  // debugger;
//       } else {
//         this.common.faliureAlert('Please try later', result['message'], '');
//       }
//     },
//     error: (e) => {
//       this.SpinnerService.hide();
//       console.error(e);
//       this.common.faliureAlert('Error', e['error']['message'], 'error');
//     },

//     complete: () => console.info('complete'),
//   });
// }

// invoiceUpload() {
//   const file: File = this.authFileInput.nativeElement.files[0];
//   console.log(file);
//   const formData = new FormData();
//   console.log(this.authorityFile);
//   formData.append('file', file);
//   this.SpinnerService.show();
//   this.httpService.postApi(this.cons.api.fileUpload, formData).subscribe({
//     next: (v: object) => {
//       let result: { [key: string]: any } = v;
//       if (result['message'] == 'success') {
//         console.log('mid' + result['response'].uploadDocId);
//         console.info('FILE UPLOADED');
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

// getCdaParkingReport() {
//   this.SpinnerService.show();

//   this.apiService.postApi(this.cons.api.getCdaParkingReport, null).subscribe({
//     next: (v: object) => {
//       this.SpinnerService.hide();
//       let result: { [key: string]: any } = v;

//       if (result['message'] == 'success') {
//         this.getCdaParkingReport = result['response'];

//         console.log('DATA>>>>>>>' + this.getCdaParkingReport);
//         // this.draw();
//       } else {
//         this.common.faliureAlert('Please try later', result['message'], '');
//       }
//     },
//     error: (e) => {
//       this.SpinnerService.hide();
//       console.error(e);
//       this.common.faliureAlert('Error', e['error']['message'], 'error');
//     },
//     complete: () => console.info('complete'),
//   });
// }

// checkSubmitTableData() {
//   if (
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

// confirmModel() {
//   throw new Error('Method not implemented.');
// }

// submitCdaTableData() {
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
//   console.log(cdaReq);

//   this.SpinnerService.show();
//   this.httpService
//     .postApi(this.cons.api.saveCdaParkingData, cdaReq)
//     .subscribe({
//       next: (v: object) => {
//         let result: { [key: string]: any } = v;
//         if (result['message'] == 'success') {
//           console.log(result['response']);
//           this.SpinnerService.hide();
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
//   this.confirmModel();
//   {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',

//       confirmButtonText: 'Yes, submit it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.submitCdaTableData();
//       }
//     });
//   }
// }

// selectSubHead(selectedSubHeadValue: any) {
//   debugger;
//   this.formdata.patchValue({
//     majorHead: selectedSubHeadValue.subHead.mojorHead.majorHead,
//     minorHead: selectedSubHeadValue.subHead.minorHead.minorHead,
//   });
// }
