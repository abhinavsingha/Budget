import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';

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

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';

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
    reprtType:new FormControl('Select Report Type'),
    finYear: new FormControl(),
    majorHead: new FormControl(),
    cdas: new FormControl(),
    amountType: new FormControl(),
    allocationType: new FormControl(),
    subHeadType:new FormControl(),
    reportType:new FormControl,
    subHead:new FormControl(),
    unit:new FormControl()
  });

  updateBudgetFormData = new FormGroup({
    cdas: new FormControl(),
    subHead: new FormControl(),
  });
  cdaUnitList: any[] = [{ cda: 'All CDA' }, { cda: 'Mumbai CDA' }];
  amountType: any;
  allocationType: any;
  subHeadType: any;
  unitData: any;
  data: any;
  head: any;
  keys: string[]=[];
  downloadFilename: string = '';
  downloadPath: any;
  private downloadPathDOC: any;
  private downloadFilenameDOC: any;

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getSubHeadsData();
    this.majorDataNew();
    this.getAmountType();
    this.getAllocationTypeData();
    this.getDashboardData();
    this.getSubHeadType();
    this.getAllCda();
    this.getCgUnitData();
  }
  getCgUnitData() {
    this.SpinnerService.show();
    var comboJson = null;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.unitData = result['response'];
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
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
  getAllCda() {
    this.apiService.getApi(this.cons.api.getAllCda).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.cdaUnitList = result['response'];
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

  @ViewChild('authFileInput') authFileInput: any;
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
        //
        this.SpinnerService.hide();
        $.getScript('assets/js/adminlte.js');

        // this.dummydata();
        let result: { [key: string]: any } = results;
        if (result['message'] == 'success') {
          // this.userRole = result['response'].userDetails.role[0].roleName;
          this.formdata.patchValue({
            allocationType: result['response'].allocationType,
          });
          this.sharedService.finYear=result['response'].budgetFinancialYear;
          if(this.sharedService.finYear!=undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

          this.sharedService.finYear=result['response'].budgetFinancialYear;
          if(this.sharedService.finYear!=undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);


          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
        }
      },
      (error) => {
        console.error(error);
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
        // this.formdata.patchValue({
        //   finYear: this.budgetFinYears[0],
        // });
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
  subHead: any;
  setSubHead() {
    this.SpinnerService.show();
    let json = {
      budgetHeadType: this.formdata.get('subHeadType')?.value.subHeadTypeId,
      majorHead: this.formdata.get('majorHead')?.value.majorHead,
    };
    this.apiService
      .postApi(this.cons.api.getAllSubHeadByMajorHead, json)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          this.subHeadData = result['response'];
          this.SpinnerService.hide();
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
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

          // console.log('DATA>>>>>>>' + this.CdaParkingReport);
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
    if (
      formdata.finYear == null ||
      formdata.cdas == null ||
      formdata.majorHead == null||formdata.subHeadType==null
    ) {
      this.common.faliureAlert(
        'Please try again.',
        'Please fill the required data.',
        ''
      );
      return;
    }
    let submitJson:any;
    if(formdata.reportType=='01'){
      submitJson = {
        financialYearId: formdata.finYear.serialNo,
        cdaType: formdata.cdas.ginNo,
        majorHead: formdata.majorHead.majorHead,
        amountType: formdata.amountType.amountTypeId,
        allocationTypeId: formdata.allocationType.allocTypeId,
        subHeadType:formdata.subHeadType.subHeadTypeId,
        budgetHeadId:formdata.subHead.budgetCodeId,
        reportType:formdata.reportType,
        minorHead:formdata.majorHead.minorHead,
      };}
      else if (formdata.reportType=='02'){
      submitJson = {
        financialYearId: formdata.finYear.serialNo,
        cdaType: formdata.cdas.ginNo,
        majorHead: formdata.majorHead.majorHead,
        minorHead:formdata.majorHead.minorHead,
        amountType: formdata.amountType.amountTypeId,
        allocationTypeId: formdata.allocationType.allocTypeId,
        subHeadType:formdata.subHeadType.subHeadTypeId,
        unitId:formdata.unit.unit,
        reportType:formdata.reportType
      };
      }
      else{
      submitJson = {
        minorHead:formdata.majorHead.minorHead,
        financialYearId: formdata.finYear.serialNo,
        cdaType: formdata.cdas.ginNo,
        majorHead: formdata.majorHead.majorHead,
        amountType: formdata.amountType.amountTypeId,
        allocationTypeId: formdata.allocationType.allocTypeId,
        subHeadType:formdata.subHeadType.subHeadTypeId,
      };
    }
      this.SpinnerService.show();
    this.apiService
      .postApi(this.cons.api.getCdaParkingReport, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.data=result['response'].allCdaData;
            this.head=this.data.head;
            this.keys=this.objectKeys(this.data);
            this.downloadPath=result['response'].path;
            this.downloadFilename=result['response'].fileName;
            // this.downloadPdf()
            // this.downloadPdf(
            //   result['response'].path,
            //   result['response'].fileName
            // );
          } else {
            this.SpinnerService.hide();
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
      debugger;
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
  showSubhead:boolean=false;
  showUnit:boolean=false;
  showReportType: boolean=true;
  show(formdata:any) {
    debugger;
    this.showSubhead=false;
    this.showUnit=false;
    if(formdata.reportType=='02')
      this.showUnit=true;
    else if(formdata.reportType=='01'){
      this.setSubHead();
      this.showSubhead=true;
    }

  }

  downloadCsv() {

  }
  objectKeys(data: any):string[] {
    return Object.keys(data);
  }

  getArr(key: string) {
    return(this.data[key]);
  }

  report(formdata:any) {
    debugger;
    if(formdata.reprtType=='01')
    this.downloadPdf(this.downloadPath,this.downloadFilename)
    else if(formdata.reprtType=='02')
    {
      let submitJson:any;
      if(formdata.reportType=='01'){
        submitJson = {
          financialYearId: formdata.finYear.serialNo,
          cdaType: formdata.cdas.ginNo,
          majorHead: formdata.majorHead.majorHead,
          amountType: formdata.amountType.amountTypeId,
          allocationTypeId: formdata.allocationType.allocTypeId,
          subHeadType:formdata.subHeadType.subHeadTypeId,
          budgetHeadId:formdata.subHead.budgetCodeId,
          reportType:formdata.reportType,
          minorHead:formdata.majorHead.minorHead,
        };}
      else if (formdata.reportType=='02'){
        submitJson = {
          financialYearId: formdata.finYear.serialNo,
          cdaType: formdata.cdas.ginNo,
          majorHead: formdata.majorHead.majorHead,
          minorHead:formdata.majorHead.minorHead,
          amountType: formdata.amountType.amountTypeId,
          allocationTypeId: formdata.allocationType.allocTypeId,
          subHeadType:formdata.subHeadType.subHeadTypeId,
          unitId:formdata.unit.unit,
          reportType:formdata.reportType
        };
      }
      else{
        submitJson = {
          minorHead:formdata.majorHead.minorHead,
          financialYearId: formdata.finYear.serialNo,
          cdaType: formdata.cdas.ginNo,
          majorHead: formdata.majorHead.majorHead,
          amountType: formdata.amountType.amountTypeId,
          allocationTypeId: formdata.allocationType.allocTypeId,
          subHeadType:formdata.subHeadType.subHeadTypeId,
        };
      }
      this.apiService
        .postApi(this.cons.api.getCdaParkingReportDoc, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.data=result['response'].allCdaData;
              this.head=this.data.head;
              this.keys=this.objectKeys(this.data);
              this.downloadPathDOC=result['response'].path;
              this.downloadFilenameDOC=result['response'].fileName;
              this.downloadPdf(this.downloadPathDOC,this.downloadFilenameDOC);
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
      debugger;
    }
  }

  checkCda(formData: any) {
    if(formData.cdas.ginNo=='112233'||formData.cdas.ginNo=='112244')
      this.showReportType=true;
    else if(formData.cdas.ginNo=='123456'){
      this.showReportType=false;
      this.showUnit=false;
      this.showSubhead=false;
    }
    else
      this.showReportType=true;
  }

  reset() {
    this.formdata.get('reportType')?.reset();
    this.formdata.get('subHead')?.reset();
    this.subHeadData=[];
  }
}
