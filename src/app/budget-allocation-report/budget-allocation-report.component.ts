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
    allocStatus:new FormControl('Select Allocation Status'),
    finYear: new FormControl(),
    toUnit: new FormControl(),
    subHead: new FormControl(),
    amountType: new FormControl(),
    reportType: new FormControl('--Select Report Type--'),
    toDate: new FormControl(),
    fromDate:new FormControl(),
    allocationType:new FormControl(),
    subHeadType:new FormControl(),
    majorHead:new FormControl(),
    allocationType2:new FormControl(),
    allocationType3:new FormControl(),
    reprtType:new FormControl('Select Report Type'),
  });
  entry: any;
  unitId: any;
  showDate: boolean=false;
  showUnit: boolean = false;
  showSubHead: boolean = false;
  amountType: any;
  bere: boolean=false;
  prevSub='';
  currentSub='';
  ma: boolean=false;
  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    this.getDashBoardDta();
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.majorDataNew();
    this.getSubHeadsData();
    this.getSubHeadType();
    // this.getAllocationType();
    this.getAmountType();
    // this.allocationType=this.sharedService.getAllocationTypeData();
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
          this.getAllocationType(this.formdata.value);
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
  getAllocationType(formdata:any) {
    if(formdata.finYear==undefined)
      return;
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllocationByFinYear+'/'+formdata.finYear.serialNo)
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
  getMajorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.majorDataNew = result['response'].subHead;
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
      else if(formdata.reprtType=='03'){
        url=url+'Excel'
      }
      // debugger;
      this.apiService
        .postApi(url, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
            if(formdata.reprtType=='03'){
                this.generateUnitWiseCsv(result['response']);
              }
            else{
              this.downloadPdf(
                result['response'][0].path,
                result['response'][0].fileName
              );
            }

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
    else if(formdata.reportType == '11'){
      // if (formdata.subHeadType == null || formdata.subHeadType == undefined) {
      //   this.common.warningAlert(
      //     'Please try later',
      //     'Please Select all mandatory data.',
      //     ''
      //   );
      //   this.SpinnerService.hide();
      //   return;
      // }
      let submitJson = {
        financialYearId: formdata.finYear.serialNo,
        subHeadType: formdata.subHeadType.subHeadTypeId,
        amountType: formdata.amountType.amountTypeId,
        allocationTypeId:formdata.allocationType.allocTypeId,
        majorHead:formdata.majorHead.majorHead,
        minorHead:formdata.majorHead.minorHead
      };
      let url=this.cons.api.getReservedFund;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      else if(formdata.reprtType=='03'){
        url=url+'Doc';
      }
      // debugger;
      this.apiService
        .postApi(url, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              if(formdata.reprtType=='03'){
                this.generateReserveCSV(result['response'],formdata);
               console.log(result['response']);
              }else{
                this.downloadPdf(
                  result['response'].path,
                  result['response'].fileName
                );
              }

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
    else if (formdata.reportType == '04') {

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
      else if(formdata.reprtType=='03'){
        url=url+'Excel'
      }
      // debugger;
      this.apiService
        .postApi(url, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              if(formdata.reprtType=='03'){
                this.generateSubHeadWiseCsv(result['response']);
              }else{
                this.downloadPdf(
                  result['response'][0].path,
                  result['response'][0].fileName
                );
              }

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
    else if (formdata.reportType == '01') {
      //It is for BE report
      // debugger;
      let url=this.cons.api.getBEAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      else if(formdata.reprtType=='03'){
        url=url+'Excel'
      }
      this.apiService
        .getApi(
          url +
            '/' +
            formdata.finYear.serialNo +
            '/'+
          formdata.allocationType.allocTypeId +
            '/' +
            formdata.amountType.amountTypeId +'/' +
          formdata.allocStatus
        )
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              if(formdata.reprtType=='03'){
                this.generateAllocationReport(result['response']);
              }
              else{
                this.downloadPdf(
                  result['response'][0].path,
                  result['response'][0].fileName
                );
              }

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
    else if (formdata.reportType == '05') {
      //It is for Revised BE report
      // debugger;
      let url=this.cons.api.getREAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';
      else if(formdata.reprtType=='03')
        url=url+'Excel';
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
              if(formdata.reprtType=='03'){
                this.generateRevisionCsv(result['response']);
              }
              else{
                this.downloadPdf(
                  result['response'][0].path,
                  result['response'][0].fileName
                );
              }

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
    else if (formdata.reportType == '07') {
      let url=this.cons.api.getBEREAllocationReport;


      if(formdata.reprtType=='02')
        url=url+'Doc';
      else if(formdata.reprtType=='03'){
        url=url+'Excel';
      }
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
              if(formdata.reprtType=='03'){
                this.generateBERECsv(result['response']);
              }
              else{
                this.downloadPdf(
                  result['response'][0].path,
                  result['response'][0].fileName
                );
                this.SpinnerService.hide();
              }
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
    else if (formdata.reportType == '08'){

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
      if(formdata.allocationType==undefined||formdata.allocationType2==undefined||formdata.allocationType3==undefined){
        Swal.fire("Please enter allocation types");
        return;
      }
      let url=this.cons.api.getMAAllocationReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';

      this.apiService
        .getApi(
          url + '/' +
          formdata.finYear.serialNo + '/' +
          formdata.allocationType.allocTypeId+'/' +
          formdata.allocationType2.allocTypeId+'/' +
          formdata.allocationType3.allocTypeId+ '/' +
          formdata.amountType.amountTypeId)
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
    else if (formdata.reportType == '10'){
      // if(formdata.toDate==undefined||formdata.fromDate==undefined){
      //   Swal.fire("Please enter to and from date");
      //   return;
      // }
      let url=this.cons.api.getConsolidateReceiptReport;
      if(formdata.reprtType=='02')
        url=url+'Doc';

      this.apiService
        .getApi(
          url + '/' +
          formdata.finYear.serialNo + '/' +
          formdata.allocationType.allocTypeId+'/' +
          formdata.amountType.amountTypeId)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              if(formdata.reprtType=='03'){
                this.generateReceiptCSV(result['response']);
              }
              else{
                this.downloadPdf(
                  result['response'][0].path,
                  result['response'][0].fileName
                );
              }

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
  showAllocStatus:boolean=false;
  showSubHeadType:boolean=false;
  selectReportType(data: any) {
    if (data.reportType == '03') {
      this.showUnit = true;
      this.showSubHead = false;
      this.showDate=false;
      this.bere=false;
      this.ma=false;
      this.showAllocStatus=false;
      this.showSubHeadType = false;
    } else if(data.reportType == '11'){
      this.showSubHeadType = true;
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=false;
      this.bere=false;
      this.ma=false;
      this.showAllocStatus=false;
    }
    else if (data.reportType == '01') {
      this.showSubHeadType = false;
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=false;
      this.bere=false;
      this.ma=false;
      this.showAllocStatus=true;
    }else if (data.reportType == '04') {
      this.showSubHead = true;
      this.showSubHeadType = false;
      this.showUnit = false;
      this.showDate=false;
      this.bere=false;
      this.ma=false;
      this.showAllocStatus=false;
    }else if (data.reportType == '07') {
      this.showSubHead = false;
      this.showUnit = false;
      this.showSubHeadType = false;
      this.showDate=false;
      this.bere=true;
      this.ma=false;
      this.showAllocStatus=false;
    }
    else if (data.reportType == '08') {
      this.showSubHead = false;
      this.showUnit = false;
      this.showSubHeadType = false;
      this.showDate = true;
      this.bere = false;
      this.ma=false;
      this.showAllocStatus = false;
    }
    else if (data.reportType == '09') {
      this.showSubHead = false;
      this.showUnit = false;
      this.showDate=false;
      this.showSubHeadType = false;
      this.bere=true;
      this.ma=true;
      this.showAllocStatus=false;
    }
    else {
      this.showAllocStatus=false;
      this.bere=false;
      this.ma=false;
      this.showSubHead = false;
      this.showSubHeadType = false;
      this.showUnit = false;
      this.showDate=false;
    }
  }
  getSubHeadType() {
    this.apiService.getApi(this.cons.api.getSubHeadType).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.subHeadType = result['response'];
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
  generateRevisionCsv(response:any) {
    // Example data and column names
    let tableData = [];
    // let ferDetails = response[0].ferDetails;
    let beallocTotal=0.0;
    let reallocTotal=0.0;
    let finalbeTotal=0.0;
    let finalreTotal=0.0;
    let finalAddTotal=0.0;
    let addtotal=0.0;
    for(let i=0;i<response.length;i++){
      if(i>0){
        if(this.prevSub!=response[i].budgetHead.replaceAll(',', ' ')){
          tableData.push({
            'REVENUE OBJECT HEAD':'',
            'Unit':'TOTAL',
            'Allocation':beallocTotal,
            'Addition':addtotal,
            'Revised':reallocTotal,
          });
          finalbeTotal=finalbeTotal+beallocTotal;
          finalAddTotal=finalAddTotal+addtotal;
          finalreTotal=finalreTotal+reallocTotal;
          beallocTotal=0.0;
          addtotal=0.0;
          reallocTotal=0.0;
        }
        // else{
        //   beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount);
        //   addtotal=addtotal+parseFloat(response[i].additionalAmount);
        //
        //   reallocTotal=reallocTotal+parseFloat(response[i].totalAmount);
        // }
      }
      tableData.push({
        'REVENUE OBJECT HEAD':response[i].budgetHead.replaceAll(',', ' '),
        'Unit':response[i].unitName.replaceAll(',', ' '),
        'Allocation':response[i].allocationAmount,
        'Addition':response[i].additionalAmount,
        'Revised':response[i].totalAmount,
      });

      response[i].additionalAmount=response[i].additionalAmount.replaceAll(',', '');
      response[i].additionalAmount=response[i].additionalAmount.replaceAll('(+)','');
      response[i].additionalAmount=response[i].additionalAmount.replaceAll('(-)','-');

      this.prevSub=response[i].budgetHead.replaceAll(',', ' ');
      beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount.replaceAll(',', '').replaceAll('(+)','').replaceAll('(-)','-'));
      addtotal=addtotal+parseFloat(response[i].additionalAmount);
      reallocTotal=reallocTotal+parseFloat(response[i].totalAmount.replaceAll(',', '').replaceAll('(+)','').replaceAll('(-)','-'));
      if(i==response.length-1){
        tableData.push({
          'REVENUE OBJECT HEAD':'',
          'Unit':'TOTAL',
          'Allocation':beallocTotal,
          'Addition':addtotal,
          'Revised':reallocTotal,
        });
        finalbeTotal=finalbeTotal+beallocTotal;
        finalreTotal=finalreTotal+reallocTotal;
        beallocTotal=0.0;
        addtotal=0.0;
        reallocTotal=0.0;
        tableData.push( {
          'REVENUE OBJECT HEAD':'',
          'Unit':'GRAND TOTAL',
          'Allocation':finalbeTotal,
          'Addition':finalAddTotal,
          'Revised':finalreTotal,
        })
      }
    }
    const columns = [
      'REVENUE OBJECT HEAD',
      'Unit',
      response[0].allocationType+' '+response[0].finYear+ ' Allocation (in '+response[0].amountIn+')',
      response[0].allocationType+' '+response[0].finYear+ ' Addition (in '+response[0].amountIn+')',
      response[0].allocationType+' '+response[0].finYear+ ' Revised (in '+response[0].amountIn+')'
    ];
    const column = [
      'REVENUE OBJECT HEAD',
      'Unit',
      'Allocation',
      'Addition',
      'Revised'
    ];
    const filename = 'Revision_Report.csv';
    this.generateCSV(tableData, columns, filename, column);
  }
  generateBERECsv(response:any) {
    // Example data and column names
    let tableData = [];
    // let ferDetails = response[0].ferDetails;
    let beallocTotal=0.0;
    let reallocTotal=0.0;
    let finalbeTotal=0.0;
    let finalreTotal=0.0;
    for(let i=0;i<response.length;i++){
      if(i>0){
        if(this.prevSub!=response[i].budgetHead.replaceAll(',', ' ')&&response[i].budgetHead.replaceAll(',', ' ')!=''){
          tableData.push({
            'REVENUE OBJECT HEAD':'',
            'Unit':'TOTAL',
            'Allocation':beallocTotal,
            'allocation':reallocTotal,
          });
          finalbeTotal=finalbeTotal+beallocTotal;
          finalreTotal=finalreTotal+reallocTotal;
          beallocTotal=0.0;
          reallocTotal=0.0;
        }
        // else{
        //   beallocTotal=beallocTotal+parseFloat(response[i].fistAllocationAmount);
        //   reallocTotal=reallocTotal+parseFloat(response[i].secondAllocationAmount);
        // }
      }
      tableData.push({
        'REVENUE OBJECT HEAD':response[i].budgetHead.replaceAll(',', ' '),
        'Unit':response[i].unitName.replaceAll(',', ' '),
        'Allocation':response[i].fistAllocationAmount,
        'allocation':response[i].secondAllocationAmount,
      });
      this.prevSub=response[i].budgetHead.replaceAll(',', ' ');
      beallocTotal=beallocTotal+parseFloat(response[i].fistAllocationAmount.replaceAll(',', ''));
      reallocTotal=reallocTotal+parseFloat(response[i].secondAllocationAmount.replaceAll(',', ''));


      if(i==response.length-1){
        tableData.push({
          'REVENUE OBJECT HEAD':'',
          'Unit':'TOTAL',
          'Allocation':beallocTotal,
          'allocation':reallocTotal,
        });
        finalbeTotal=finalbeTotal+beallocTotal;
        finalreTotal=finalreTotal+reallocTotal;
        beallocTotal=0.0;
        reallocTotal=0.0;
        tableData.push( {
          'REVENUE OBJECT HEAD':'',
          'Unit':'GRAND TOTAL',
          'Allocation':finalbeTotal,
          'allocation':finalreTotal,
      })
      }
    }
    const columns = [
      'REVENUE OBJECT HEAD',
      'Unit',
      response[0].fistAllocation+' '+response[0].finYear+' Allocation (in '+response[0].amountIn+')' ,
      response[0].secondAllocation+' '+response[0].finYear+' allocation (in '+response[0].amountIn+')',
    ];
    const column = [
      'REVENUE OBJECT HEAD',
      'Unit',
      'Allocation',
      'allocation',
    ];
    const filename = 'BE&RE_Report.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
    // this.generateCSV([], columns, filename, column);
  }
  generateFERCsv(response:any) {
    // Example data and column names
    let tableData = [];
    let ferDetails = response[0].ferDetails;
    let allocTotal=0.0;
    let billTotal=0.0;
    let percentBillTotal=0.0;
    let grandAllocTotal=0.0;
    let grandBillTotal=0.0;
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
            grandAllocTotal=grandAllocTotal+allocTotal;
            grandBillTotal=grandBillTotal+billTotal;
            allocTotal=0.0;
            billTotal=0.0;
            percentBillTotal=0.0;

          }
          // else{
          //   allocTotal=allocTotal+parseFloat(ferDetails[i].allocAmount);
          //   console.log(allocTotal+'+'+parseFloat(ferDetails[i].allocAmount));
          //   billTotal=billTotal+parseFloat(ferDetails[i].billSubmission);
          //   percentBillTotal=percentBillTotal+parseFloat(ferDetails[i].percentageBill);
          // }
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
        if(i==ferDetails.length-1){
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
          grandAllocTotal=grandAllocTotal+allocTotal;
          grandBillTotal=grandBillTotal+billTotal;
          allocTotal=0.0;
          billTotal=0.0;
          percentBillTotal=0.0;
          tableData.push({
            'REVENUE OBJECT HEAD':'',
            'Allocation to ICG':'',
            'Unit':'Grand Total:',
            'Allocation':grandAllocTotal,
            'Bill Submission':grandBillTotal,
            '% BillSubmission w.r.t.':'',
            'CGDA Booking':'',
            '% Bill Clearance w.r.t.':'',
          });
        }
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
  generateCSV(data: any[], columns:string[], filename: string, column: string[]) {
    const csvData: any[][] = [];
    // Add column names as the first row
    const headingRow: string[] = [];
    if(this.formdata.get('reportType')?.value=='03'||this.formdata.get('reportType')?.value=='04'){
      headingRow.push('');
      headingRow.push('FINANCIAL YEAR:'+this.unitwiseYear);
      headingRow.push('UNIT:'+this.unitwiseUnit);
      headingRow.push('');
      csvData.push(headingRow);
    }


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
  unitwiseUnit:any;
  unitwiseYear:any;
  subHeadType: any;
  private generateUnitWiseCsv(response: any) {
    let beallocTotal=0.0;
    let tableData = [];
    this.unitwiseUnit=response[0].unitName;
    this.unitwiseYear=response[0].finYear;
    for(let i=0;i<response.length;i++){
          beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount);
      tableData.push({
        'SERIAL NO.':i+1,
        'SUB HEAD':response[i].budgetHead,
        'ALLOCATION TYPE':response[i].allocationType,
        'ALLOCATION AMOUNT':response[i].allocationAmount});
      beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount.replaceAll(',', ''));
      if(i==response.length-1){
        tableData.push({
          'SERIAL NO.':'',
          'SUB HEAD':'',
          'ALLOCATION TYPE':'Total',
          'ALLOCATION AMOUNT':beallocTotal});
      }
    }
    const columns = [
      'SERIAL NO.',
      'SUB HEAD',
      'ALLOCATION TYPE',
      'ALLOCATION AMOUNT (in '+response[0].amountIn+')'
    ];
    const column = [
      'SERIAL NO.',
      'SUB HEAD',
      'ALLOCATION TYPE',
      'ALLOCATION AMOUNT'
    ];
    const filename = 'UNIT_WISE_ALLOCATION_Report.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);

  }
  private generateSubHeadWiseCsv(response: any) {
    let beallocTotal=0.0;
    let tableData = [];
    this.unitwiseUnit=response[0].budgetHead;
    this.unitwiseYear=response[0].finYear;
    for(let i=0;i<response.length;i++){
      // beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount);
      tableData.push({
        'SERIAL NO.':i+1,
        'UNIT':response[i].unitName,
        'ALLOCATION TYPE':response[i].allocationType,
        'ALLOCATION AMOUNT':response[i].allocationAmount});
      beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount.replaceAll(',', ''));
      if(i==response.length-1){
        tableData.push({
          'SERIAL NO.':'',
          'UNIT':'',
          'ALLOCATION TYPE':'Total',
          'ALLOCATION AMOUNT':beallocTotal});
      }
    }
    const columns = [
      'SERIAL NO.',
      'UNIT',
      'ALLOCATION TYPE',
      'ALLOCATION AMOUNT (in '+response[0].amountIn+')'
    ];
    const column = [
      'SERIAL NO.',
      'UNIT',
      'ALLOCATION TYPE',
      'ALLOCATION AMOUNT'
    ];
    const filename = 'SUBHEAD_WISE_ALLOCATION_Report.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);

  }

  private generateAllocationReport(response: any) {
// Example data and column names
    let tableData = [];
    let beallocTotal=0.0;
    let finalbeTotal=0.0;
    for(let i=0;i<response.length;i++){
      if(i>0){
        if(this.prevSub!=response[i].budgetHead.replaceAll(',', ' ')&&response[i].budgetHead.replaceAll(',', ' ')!=''){
          tableData.push({
            'REVENUE OBJECT HEAD':'',
            'Unit':'TOTAL',
            'Allocation':beallocTotal,
          });
          finalbeTotal=finalbeTotal+beallocTotal;
          beallocTotal=0.0;
        }
        // else{
        //   beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount);
        // }
      }
      tableData.push({
        'REVENUE OBJECT HEAD':response[i].budgetHead.replaceAll(',', ' '),
        'Unit':response[i].unitName.replaceAll(',', ' '),
        'Allocation':response[i].allocationAmount,
      });
      this.prevSub=response[i].budgetHead.replaceAll(',', ' ');
      beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount.replaceAll(',', '').replaceAll('(+)','').replaceAll('(-)','-'));
      if(i==response.length-1){
        tableData.push({
          'REVENUE OBJECT HEAD':'',
          'Unit':'TOTAL',
          'Allocation':beallocTotal,
        });
        finalbeTotal=finalbeTotal+beallocTotal;
        beallocTotal=0.0;
        tableData.push( {
          'REVENUE OBJECT HEAD':'',
          'Unit':'GRAND TOTAL',
          'Allocation':finalbeTotal,
        })
      }
    }
    const columns = [
      'REVENUE OBJECT HEAD',
      'Unit',
      response[0].allocationType+' '+response[0].finYear+ ' Allocation (in '+response[0].amountIn+')',
    ];
    const column = [
      'REVENUE OBJECT HEAD',
      'Unit',
      'Allocation',
    ];
    const filename = 'Allocation_Report.csv';
    this.generateCSV(tableData, columns, filename, column);
  }

  private generateReceiptCSV(response: any) {
    let tableData = [];
    let Total = 0.0;
    if (response[0].reciptRespone[2037] != undefined){
      let sum = 0.0;
      for (let i = 0; i < response[0].reciptRespone[2037].length; i++) {

        if (i == 0) {
          tableData.push({
            'MAJORHEAD': '2037',
            'DETAILED HEAD': 'REVENUE',
            'ALLOCATION ': '',
          });
          tableData.push({
            'MAJORHEAD': '',
            'DETAILED HEAD': response[0].reciptRespone[2037][i].budgetHead.subHeadDescr,
            'ALLOCATION ': response[0].reciptRespone[2037][i].amount,
          });
          sum = sum + parseFloat(response[0].reciptRespone[2037][i].amount);
        } else {
          tableData.push({
            'MAJORHEAD': '',
            'DETAILED HEAD': response[0].reciptRespone[2037][i].budgetHead.subHeadDescr,
            'ALLOCATION ': response[0].reciptRespone[2037][i].amount,
          });
          sum = sum + parseFloat(response[0].reciptRespone[2037][i].amount);

        }
        if (i == response[0].reciptRespone[2037].length - 1) {
          Total=Total+sum;
          tableData.push({
            'MAJORHEAD': '',
            'DETAILED HEAD': 'Total(REVENUE)',
            'ALLOCATION ': sum,
          });
        }
      }
    }

    if (response[0].reciptRespone[4047] != undefined){
      let sum1 = 0.0;
    for (let i = 0; i < response[0].reciptRespone[4047].length; i++) {

      if (i == 0) {
        tableData.push({
          'MAJORHEAD': '4047',
          'DETAILED HEAD': 'CAPITAL',
          'ALLOCATION ': '',
        });
        tableData.push({
          'MAJORHEAD': '',
          'DETAILED HEAD': response[0].reciptRespone[4047][i].budgetHead.subHeadDescr,
          'ALLOCATION ': response[0].reciptRespone[4047][i].amount,
        });
        sum1 = sum1 + parseFloat(response[0].reciptRespone[4047][i].amount);
      } else {
        tableData.push({
          'MAJORHEAD': '',
          'DETAILED HEAD': response[0].reciptRespone[4047][i].budgetHead.subHeadDescr,
          'ALLOCATION ': response[0].reciptRespone[4047][i].amount,
        });
        sum1 = sum1 + parseFloat(response[0].reciptRespone[4047][i].amount);

      }
      if (i == response[0].reciptRespone[4047].length - 1) {
        Total=Total+sum1;
        tableData.push({
          'MAJORHEAD': '',
          'DETAILED HEAD': 'Total(CAPITAL)',
          'ALLOCATION ': sum1,
        });
      }
    }
  }
    tableData.push({
      'MAJORHEAD': '',
      'DETAILED HEAD': 'Grand Total',
      'ALLOCATION ': Total,
    });
    const columns = [
      'MAJORHEAD',
      'DETAILED HEAD',
      response[0].type + ' (' + response[0].finYear + ') Allocation (in '+response[0].amountType+')',
    ];
    const column = [
      'MAJORHEAD',
      'DETAILED HEAD',
      'ALLOCATION ',
    ];

    const filename = 'Receipt_Report.csv';
    this.generateCSV(tableData, columns, filename, column);
  }

  private generateReserveCSV(response: any,formdata:any) {

    let tableData = [];
    let beallocTotal=0.0;
    let finalbeTotal=0.0;
    let keys = Object.keys(response.allCdaData);
    console.log(keys);
    let i=0;
    debugger;
    let sum=0;
    let sumA=0
    for(let key of keys){
      console.log(response.allCdaData[key]);
      i++;

      tableData.push({
            'S.No':i,
            'Financial Year':formdata.finYear.finYear,
            'Major/Minor/Subhead':formdata.majorHead.majorHead+'/'+formdata.majorHead.minorHead,
            'Allocation Type':formdata.allocationType.allocType,
            'Subhead':key,
            'Allocation Amount':response.allCdaData[key][0].name,
            'Reserve Fund':response.allCdaData[key][0].allocationAmount
              });
      sum=sum+parseFloat(response.allCdaData[key][0].allocationAmount);
      sumA=sumA+parseFloat(response.allCdaData[key][0].name);
    }
    i++;
    tableData.push({
      'S.No':i,
      'Financial Year':'',
      'Major/Minor/Subhead':'',
      'Allocation Type':'',
      'Subhead':'GRAND TOTAL',
      'Allocation Amount':sumA,
      'Reserve Fund':sum
    });

    // for(let i=0;i<response.allCdaData.length;i++){
    //   tableData.push({
    //     'S.No':i+1,
    //     'Financial Year':formdata.finYear.finYear,
    //     'Major/Minor/Subhead':formdata.majorHead.majorHead+'/'+formdata.majorHead.minorHead,
    //     'Allocation Type':formdata.allocationType.allocType,
    //     'Subhead':'',
    //     'Allocation Amount':,
    //     'Reserve Fund'
    //       });
    //       finalbeTotal=finalbeTotal+beallocTotal;
    //       beallocTotal=0.0;
    //   tableData.push({
    //     'REVENUE OBJECT HEAD':response[i].budgetHead.replaceAll(',', ' '),
    //     'Unit':response[i].unitName.replaceAll(',', ' '),
    //     'Allocation':response[i].allocationAmount,
    //   });
    //   this.prevSub=response[i].budgetHead.replaceAll(',', ' ');
    //   beallocTotal=beallocTotal+parseFloat(response[i].allocationAmount.replaceAll(',', '').replaceAll('(+)','').replaceAll('(-)','-'));
    //   if(i==response.length-1){
    //     tableData.push({
    //       'REVENUE OBJECT HEAD':'',
    //       'Unit':'TOTAL',
    //       'Allocation':beallocTotal,
    //     });
    //     finalbeTotal=finalbeTotal+beallocTotal;
    //     beallocTotal=0.0;
    //     tableData.push( {
    //       'REVENUE OBJECT HEAD':'',
    //       'Unit':'GRAND TOTAL',
    //       'Allocation':finalbeTotal,
    //     })
    //   }
    // }
    const columns = [
      'S.No',
      'Financial Year',
      'Major/Minor/Subhead',
      'Allocation Type',
      'Subhead',
      'Allocation Amount'+' (In '+formdata.amountType.amountType+')',
      'Reserve Fund'+ ' (In '+formdata.amountType.amountType+')'
    ];
    const column = [
      'S.No',
      'Financial Year',
      'Major/Minor/Subhead',
      'Allocation Type',
      'Subhead',
      'Allocation Amount',
      'Reserve Fund'
    ];
    const filename = 'ReserveReport.csv';
    this.generateCSV(tableData, columns, filename, column);
  }
}
