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
    subHead: new FormControl(),
    reportType: new FormControl('--Select Report Type--'),
  });
  entry: any;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.majorDataNew();
    this.getSubHeadsData();
    this.getAllocationType();
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
      debugger;
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
              ) {
                this.allocationRepoList.pop();
              }
            }
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

  draw() {
    throw new Error('Method not implemented.');
  }

  downloadReport(formdata: any) {
    if (formdata.finYear == null || formdata.finYear == undefined) {
      this.common.warningAlert(
        'Please try later',
        'Please Select all mandatory data.',
        ''
      );
    }
    if (formdata.reportType == '03') {
      // It is for Unit Wise
      let submitJson = {
        finYearId: formdata.finYear.serialNo,
        unitId: formdata.toUnit.unit,
      };

      this.apiService
        .postApi(this.cons.api.getUnitWiseAllocationReport, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(result['response'][0].path);
            } else {
              this.common.faliureAlert(
                'Please try later',
                result['message'],
                ''
              );
            }
          },
          error: (e) => {
            this.SpinnerService.hide();
            console.error(e);
            this.common.faliureAlert('Error', e['error']['message'], 'error');
          },
          complete: () => console.info('complete'),
        });
    } else if (formdata.reportType == '04') {
      // It is for Subhead Wise
      let submitJson = {
        finYearId: formdata.finYear.serialNo,
        subHeadId: formdata.subHead.budgetCodeId,
      };
      debugger;
      this.apiService
        .postApi(this.cons.api.getSubHeadWiseAllocationReport, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(result['response'][0].path);
            } else {
              this.common.faliureAlert(
                'Please try later',
                result['message'],
                ''
              );
            }
          },
          error: (e) => {
            this.SpinnerService.hide();
            console.error(e);
            this.common.faliureAlert('Error', e['error']['message'], 'error');
          },
          complete: () => console.info('complete'),
        });
    } else if (formdata.reportType == '01') {
      //It is for BE report

      this.apiService
        .getApi(
          this.cons.api.getBEAllocationReport +
            '/' +
            formdata.finYear.serialNo +
            '/BE'
        )
        .subscribe((res) => {
          let result: { [key: string]: any } = res;
          if (result['message'] == 'success') {
            this.downloadPdf(result['response'][0].path);
            this.SpinnerService.hide();
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        });
    } else if (formdata.reportType == '02') {
      //It is for RE report

      this.apiService
        .getApi(
          this.cons.api.getBEAllocationReport +
            '/' +
            formdata.finYear.serialNo +
            '/RE'
        )
        .subscribe((res) => {
          let result: { [key: string]: any } = res;
          if (result['message'] == 'success') {
            this.downloadPdf(result['response'][0].path);
            this.SpinnerService.hide();
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        });
    }
    debugger;
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

  showUnit: boolean = false;
  showSubHead: boolean = false;
  selectReportType(data: any) {
    if (data.reportType == '03') {
      this.showUnit = true;
      this.showSubHead = false;
    } else if (data.reportType == '04') {
      this.showSubHead = true;
      this.showUnit = false;
    } else {
      this.showSubHead = false;
      this.showUnit = false;
    }
  }
}
