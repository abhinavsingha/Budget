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
import * as Papa from "papaparse";

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
      else if(formdata.reprtType=='03')
        url=url+'Excel';
      if (formdata.reprtType=='03'){
        this.apiService.getApi(url +'/'+formdata.finYear.serialNo +'/'+formdata.allocationType.allocTypeId+'/' +formdata.amountType.amountTypeId+'/'+formdata.toDate+'/'+formdata.fromDate)
          .subscribe({
            next: (v: object) => {
              this.SpinnerService.hide();
              let result: { [key: string]: any } = v;
              if (result['message'] == 'success'){
                this.generateFERCsv(result['response'])
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
      else{
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
  prevSub='';
  currentSub='';
  generateFERCsv(response:any) {
    // Example data and column names
    let tableData = [];
    let ferDetails = response[0].ferDetails;
    let allocTotal=0.0;
    let billTotal=0.0;
    let percentBillTotal=0.0;

      for(let i=0;i<ferDetails.length;i++){
        if(i>0){
          if(this.prevSub!=ferDetails[i].subHead.replaceAll(',', ' ')){
            tableData.push({
              'REVENUE OBJECT HEAD':'',
              'Allocation to ICG':'',
              'Unit':'Total:',
              'Allocation':allocTotal,
              'Bill Submission':billTotal,
              '% BillSubmission w.r.t.':percentBillTotal,
              'CGDA Booking':'',
              '% Bill Clearance w.r.t.':'',
            });
            allocTotal=0.0;
            billTotal=0.0;
            percentBillTotal=0.0;
          }
          else{
            allocTotal=allocTotal+parseFloat(ferDetails[i].allocAmount);
            billTotal=billTotal+parseFloat(ferDetails[i].billSubmission);
            percentBillTotal=percentBillTotal+parseFloat(ferDetails[i].percentageBill);
          }
        }
      tableData.push({
        'REVENUE OBJECT HEAD':ferDetails[i].subHead.replaceAll(',', ' '),
        'Allocation to ICG':ferDetails[i].icgAllocAmount.replaceAll(',', ' '),
        'Unit':ferDetails[i].unitName.replaceAll(',', ' '),
        'Allocation':ferDetails[i].allocAmount.replaceAll(',', ''),
        'Bill Submission':ferDetails[i].billSubmission.replaceAll(',', ''),
        '% BillSubmission w.r.t.':ferDetails[i].percentageBill.replaceAll(',', ''),
        'CGDA Booking':ferDetails[i].cgdaBooking.replaceAll(',', ' '),
        '% Bill Clearance w.r.t.':ferDetails[i].percentageBillClearnce.replaceAll(',', ' '),
      });
        this.prevSub=ferDetails[i].subHead.replaceAll(',', ' ');
        allocTotal=allocTotal+parseFloat(ferDetails[i].allocAmount.replaceAll(',', ''));
        billTotal=billTotal+parseFloat(ferDetails[i].billSubmission.replaceAll(',', ''));
        percentBillTotal=percentBillTotal+parseFloat(ferDetails[i].percentageBill.replaceAll(',', ''));
    }
    const columns = [
      'REVENUE OBJECT HEAD',
      response[0].allocationType.replaceAll(',', ' ')+' '+response[0].finYear.replaceAll(',', ' ')+' Allocation to ICG (in'+response[0].amountIn+')',
      'Unit',
      response[0].allocationType.replaceAll(',', ' ')+' '+response[0].finYear.replaceAll(',', ' ')+' Allocation (in'+response[0].amountIn+')',
      'Bill Submission Upto '+response[0].upToDate.replaceAll(',', ' '),
      '% BillSubmission w.r.t. '+response[0].allocationType.replaceAll(',', ' ')+' '+response[0].finYear.replaceAll(',', ' '),
      'CGDA Booking Upto '+response[0].upToDate.replaceAll(',', ' '),
      '% Bill Clearance w.r.t. '+response[0].allocationType.replaceAll(',', ' ')+' '+response[0].finYear.replaceAll(',', ' '),
    ];
    const column = [
      'REVENUE OBJECT HEAD',
      'Allocation to ICG',
      'Unit',
      'Allocation',
      'Bill Submission',
      '% BillSubmission w.r.t.',
      'CGDA Booking',
      '% Bill Clearance w.r.t.',
    ];
    const filename = 'ReportFER.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
    // this.generateCSV([], columns, filename, column);
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
}
