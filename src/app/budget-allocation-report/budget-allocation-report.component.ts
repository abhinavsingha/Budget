import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

class AllocationRepoList {
  financialYear: any;
  unit: any;
  subhead: any;
  type: any;
  amount: any;
  Remarks: any;
  status: any;
  checked: any;
  // view: any;
  // lastCbDate: any;
}

@Component({
  selector: 'app-budget-allocation-report',
  templateUrl: './budget-allocation-report.component.html',
  styleUrls: ['./budget-allocation-report.component.scss'],
})
export class BudgetAllocationReportComponent implements OnInit {
  p: number = 1;
  budgetFinYears: any[] = [];

  allunits: any[] = [];

  budgetListData: any[] = [];

  allStationsList: any[] = [];
  majorHeadList: any[] = [];
  subHeads: any[] = [];
  allocationType: any[] = [];
  allocationRepoList: AllocationRepoList[] = [];
  status: any;

  AllocationReportRevised: any;
  // AllRepoRevData: any;

  formdata = new FormGroup({
    finYear: new FormControl(),
    toUnit: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    subHead: new FormControl(),
    allocationType: new FormControl(),
  });
  entry: any;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.majorDataNew();
    this.getSubHeadsData();
    this.getAllocationType();

    $.getScript('assets/js/adminlte.js');
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private common: CommonService
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
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
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

  getAllocationType() {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllocationTypeData)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  getAllocationReportRevised() {
    this.SpinnerService.show();

    this.apiService
      .postApi(this.cons.api.getAllocationReportRevised, null)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.AllocationReportRevised = result['response'];
            for (
              let i = 0;
              i < this.AllocationReportRevised.allocationRepoList.length;
              i++
            ) {
              const dataEntry: AllocationRepoList = {
                financialYear:
                  this.AllocationReportRevised.allocationRepoList[i]
                    .financialYearId.finYear,
                unit: this.AllocationReportRevised.allocationRepoList[i].unit
                  .descr,

                subhead:
                  this.AllocationReportRevised.allocationRepoList[i].subHead
                    .subHeadDescr,
                type: this.AllocationReportRevised.allocationRepoList[i].type,
                amount: 0,
                Remarks:
                  this.AllocationReportRevised.allocationRepoList[i].remarks,
                status: undefined,
                checked: undefined,
              };
              this.allocationRepoList.push(dataEntry);
            }

            console.log('DATA>>>>>>>' + this.AllocationReportRevised);
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
  searchData(data: any) {
    debugger;
    this.allocationRepoList = [];
    this.SpinnerService.show();
    let submitJson = {
      budgetFinancialYearId: data.finYear.serialNo,
      unitId: data.toUnit.unit,
    };
    this.apiService
      .postApi(this.cons.api.getAllocationReportRevised, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.AllocationReportRevised = result['response'];
            for (
              let i = 0;
              i < this.AllocationReportRevised.allocationRepoList.length;
              i++
            ) {
              const dataEntry: AllocationRepoList = {
                financialYear:
                  this.AllocationReportRevised.allocationRepoList[i]
                    .financialYearId.finYear,
                unit: this.AllocationReportRevised.allocationRepoList[i].unit
                  .cgUnitShort,
                subhead:
                  this.AllocationReportRevised.allocationRepoList[i].subHead
                    .budgetCodeId,

                type: this.AllocationReportRevised.allocationRepoList[i].type
                  .allocDesc,
                amount: 0,
                Remarks:
                  this.AllocationReportRevised.allocationRepoList[i].remarks,
                status: undefined,
                checked: undefined,
              };

              this.allocationRepoList.push(dataEntry);
            }

            for (let i = 0; i < this.allocationRepoList.length; i++) {
              if (
                this.formdata.get('finYear')?.value.finYear !=
                  this.allocationRepoList[i].financialYear ||
                // this.formdata.get('unit')?.value.Tounit !=
                this.allocationRepoList[i].unit ||
                this.formdata.get('subHead')?.value.subHeadDescr !=
                  this.allocationRepoList[i].subhead
                //   ||
                // this.formdata.get('type')?.value.type !=
                //   this.allocationRepoList[i].type ||
                // this.formdata.get('amount')?.value.amount !=
                //   this.allocationRepoList[i].amount ||
                // this.formdata.get('remarks')?.value.remarks !=
                //   this.allocationRepoList[i].Remarks
              ) {
                this.allocationRepoList.pop();
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
  downloadPdf(pdfUrl: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        //   this.http.get('https://icg.net.in/bmsreport/1681376372803.pdf', { responseType: 'blob' }).subscribe((blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, 'document.pdf');
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }

  downloadBill(cb: any) {
    console.log(cb);
    let json = {
      authGroupId: cb.authGroupId,
    };
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.getCbRevisedReport, json).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        this.downloadPdf(result['response'][0].path);
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
}

// searchData(formData: any) {
//   this.SpinnerService.show();

//   let submitJson = {
//     budgetFinancialYearId: formData.finYear.serialNo,
//     unitId: formData.toUnit.unit,
//   };

//   this.apiService
//     .postApi(this.cons.api.getAllocationReportRevised, submitJson)
//     .subscribe({
//       next: (v: object) => {
//         this.SpinnerService.hide();
//         let result: { [key: string]: any } = v;

//         if (result['message'] == 'success') {
//           this.budgetListData = result['response'];
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
