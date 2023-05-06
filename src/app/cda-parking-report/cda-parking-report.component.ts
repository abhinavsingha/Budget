import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
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
import {SharedService} from "../services/shared/shared.service";

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
    majorHead: new FormControl(),
    cdas: new FormControl(),
    amountType: new FormControl(),
    allocationType: new FormControl()
  });

  updateBudgetFormData = new FormGroup({
    cdas: new FormControl(),
    subHead: new FormControl(),
  });
  cdaUnitList: any[] = [{cda:"All CDA"},{cda:"Mumbai CDA"}];
  amountType: any;
  allocationType: any;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getSubHeadsData();
    this.majorDataNew();
    this.getAmountType();
    this.getAllocationTypeData();
    this.getDashboardData();
  }

  @ViewChild('authFileInput') authFileInput: any;
  private authFile: any;
  constructor(
    private sharedService: SharedService,
    private httpService: ApiCallingServiceService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private common: CommonService // private select :NgSelectModule
  ) {}
  private getDashboardData() {
    // this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.getDashboardData, null).subscribe(
      (results) => {
        // debugger;
        this.SpinnerService.hide();
        $.getScript('assets/js/adminlte.js');

        // this.dummydata();
        let result: { [key: string]: any } = results;
        if (result['message'] == 'success') {
          // this.userRole = result['response'].userDetails.role[0].roleName;
          this.formdata.patchValue({
            allocationType: result['response'].allocationType,
          });

          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
        }
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
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
nType: any;
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
          // this.draw();
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
  getAmountType(){
    this.apiService
      .getApi(this.cons.api.showAllAmountUnit)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.amountType = result['response'];

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
  getAllocationTypeData() {
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
  downloadCDAParkingReport(formdata: any) {
    debugger;
    if (
      formdata.finYear == null ||
      formdata.finYear == undefined ||
      formdata.cdas == null ||
      formdata.cdas == undefined ||
      formdata.majorHead == null ||
      formdata.majorHead == undefined
    ) {
      this.common.faliureAlert(
        'Please try again.',
        'Please fill the required data.',
        ''
      );
      return;
    }

    let submitJson = {
      financialYearId: formdata.finYear.serialNo,
      cdaType: formdata.cdas.cda,
      majorHead: formdata.majorHead.majorHead,
      amountType:formdata.amountType.amountTypeId,
      allocationType:formdata.allocationType.allocTypeId
    };
    debugger;
    this.apiService
      .postApi(this.cons.api.getCdaParkingReport, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.downloadPdf()
            this.downloadPdf(result['response'][0].path);
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

  downloadPdf(pdfUrl: string): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, 'document.pdf');
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }
}
