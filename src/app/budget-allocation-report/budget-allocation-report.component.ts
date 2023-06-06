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
import {SharedService} from "../services/shared/shared.service";

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
    amountType: new FormControl(),
    reportType: new FormControl('--Select Report Type--'),
    toDate: new FormControl(),
    fromDate:new FormControl(),
    allocationType:new FormControl(),
    allocationType2:new FormControl(),
    reprtType:new FormControl('Select Report Type'),
  });
  entry: any;
  unitId: any;
  showDate: boolean=false;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getDashBoardDta();
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.majorDataNew();
    this.getSubHeadsData();
    this.getAllocationType();
    this.getAmountType();
    this.allocationType=this.sharedService.getAllocationTypeData();
    // debugger;
  }

  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private common: CommonService
  ) {}
  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.finYear=result['response'].budgetFinancialYear;
          if(this.sharedService.finYear!=undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

          this.unitId = result['response'].userDetails.unitId;
          if(this.unitId=='001321'){
            this.getAllCgUnitData();
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
  getAllCgUnitData() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.getAllCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      // debugger;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        // this.formdata.patchValue({
        //   finYear: this.budgetFinYears[0],
        // });
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
      // debugger;
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

            // console.log('DATA>>>>>>>' + this.AllocationReportRevised);
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
    this.SpinnerService.show();
    if (
      formdata.finYear == null ||
      formdata.finYear == undefined ||
      formdata.amountType == undefined ||
      formdata.amountType == null ||
      formdata.reportType == '--Select Report Type--' ||
      formdata.reportType == null
    ) {
      this.common.warningAlert(
        'Please try later',
        'Please Select all mandatory data.',
        ''
      );
      this.SpinnerService.hide();
      return;
    }
    if (formdata.reportType == '03') {
      // It is for Unit Wise

      if (formdata.toUnit == null || formdata.toUnit == undefined) {
        this.common.warningAlert(
          'Please try later',
          'Please Select all mandatory data.',
          ''
        );
        this.SpinnerService.hide();
        return;
      }
      let submitJson = {
        finYearId: formdata.finYear.serialNo,
        unitId: formdata.toUnit.unit,
        amountTypeId: formdata.amountType.amountTypeId,
        allocationTypeId:formdata.allocationType.allocTypeId
      };
      let url=this.cons.api.getUnitWiseAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc'
      // debugger;
      this.apiService
        .postApi(url, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
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
      if (formdata.subHead == null || formdata.subHead == undefined) {
        this.common.warningAlert(
          'Please try later',
          'Please Select all mandatory data.',
          ''
        );
        this.SpinnerService.hide();
        return;
      }
      let submitJson = {
        finYearId: formdata.finYear.serialNo,
        subHeadId: formdata.subHead.budgetCodeId,
        amountTypeId: formdata.amountType.amountTypeId,
        allocationTypeId:formdata.allocationType.allocTypeId
      };
      let url=this.cons.api.getSubHeadWiseAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      // debugger;
      this.apiService
        .postApi(url, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
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
      // debugger;
      let url=this.cons.api.getBEAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      this.apiService
        .getApi(
          url +
            '/' +
            formdata.finYear.serialNo +
            '/'+
          formdata.allocationType.allocTypeId +
            '/' +
            formdata.amountType.amountTypeId
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
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
    }
    // else if (formdata.reportType == '02') {
    //   //It is for RE report
    //   debugger;
    //   this.apiService
    //     .getApi(
    //       this.cons.api.getBEAllocationReport +
    //         '/' +
    //         formdata.finYear.serialNo +
    //         '/ALL_102' +
    //         '/' +
    //         formdata.amountType.amountTypeId
    //     )
    //     .subscribe({
    //       next: (v: object) => {
    //         this.SpinnerService.hide();
    //         let result: { [key: string]: any } = v;
    //         if (result['message'] == 'success') {
    //           this.downloadPdf(
    //             result['response'][0].path,
    //             result['response'][0].fileName
    //           );
    //         } else {
    //           this.common.faliureAlert(
    //             'Please try later',
    //             result['message'],
    //             ''
    //           );
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
    else if (formdata.reportType == '05') {
      //It is for Revised BE report
      // debugger;
      let url=this.cons.api.getREAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      this.apiService
        .getApi(
          url +
            '/' +
            formdata.finYear.serialNo +'/'+
          formdata.allocationType.allocTypeId +
            '/' +
            formdata.amountType.amountTypeId
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
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
    }
    else if (formdata.reportType == '07')
    {
      let url=this.cons.api.getBEREAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      //It is for Revised BE & RE report
      // debugger;
      this.apiService
        .getApi(
          url +
            '/' +
            formdata.finYear.serialNo +
            '/' +formdata.allocationType.allocTypeId+
            '/' +formdata.allocationType2.allocTypeId+
          '/'+
            formdata.amountType.amountTypeId
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
              this.SpinnerService.hide();
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
    }else if (formdata.reportType == '08'){

      if(formdata.toDate==undefined||formdata.fromDate==undefined){
        Swal.fire("Please enter to and from date");
        return;
      }

      let url=this.cons.api.getMainBEAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';

      this.apiService
        .getApi(
          url +
          '/' +
          formdata.finYear.serialNo +
          '/' +
          formdata.allocationType.allocTypeId+

          '/' +
          formdata.amountType.amountTypeId+'/'+formdata.toDate+'/'+formdata.fromDate
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
              this.SpinnerService.hide();
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
    }
    else if (formdata.reportType == '09'){
      if(formdata.toDate==undefined||formdata.fromDate==undefined){
        Swal.fire("Please enter to and from date");
        return;
      }
      let url=this.cons.api.getMainBEAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';

      this.apiService
        .getApi(
          url +
          '/' +
          formdata.finYear.serialNo +
          '/ALL_102' +
          '/' +
          formdata.amountType.amountTypeId+'/'+formdata.toDate+'/'+formdata.fromDate
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
              this.SpinnerService.hide();
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
    }
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

  downloadBill(cb: any) {
    // console.log(cb);
    let json = {
      authGroupId: cb.authGroupId,
    };
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.getCbRevisedReport, json).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        this.downloadPdf(
          result['response'][0].path,
          result['response'][0].fileName
        );
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  showUnit: boolean = false;
  showSubHead: boolean = false;
  amountType: any;
  bere: boolean=false;
  getAmountType() {
    this.apiService.getApi(this.cons.api.showAllAmountUnit).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountType = result['response'];
          this.formdata.patchValue({
            amountType: this.amountType[0],
          });
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
  selectReportType(data: any) {
    if (data.reportType == '03') {
      this.showUnit = true;
      this.showSubHead = false;
      this.showDate=false;
      this.bere=false;
    } else if (data.reportType == '04') {
      this.showSubHead = true;
      this.showUnit = false;
      this.showDate=false;
      this.bere=false;
    }else if (data.reportType == '07') {
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=false;
      this.bere=true;
    }
    else if (data.reportType == '08'||data.reportType == '09') {
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=true;
      this.bere=false;
    } else {
      this.bere=false;
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=false;
    }
  }
}
