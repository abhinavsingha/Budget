import { Component } from '@angular/core';
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common/common.service";
import {DatePipe} from "@angular/common";
import {SharedService} from "../services/shared/shared.service";
import {FormControl, FormGroup} from "@angular/forms";
import * as $ from "jquery";
import Swal from "sweetalert2";


interface cb {
  cdaParkingId:any;
  authGroupId: any;
  onAccountOf: any;
  authorityDetails: any;
  contingentBilId: any;
  budgetHeadID: any;
  authUnitId: any;
  unitId: any;
  uploadFileDate: any;
  finSerialNo: any;
  progressiveAmount: any;
  fileNo: any;
  fileDate: any;
  minorHead: any;
  unit: any;
  finYearName: any;
  majorHead: any;
  subHead: any;
  amount: any;
  file: any;
  cbNo: any;
  cbDate: any;
  remarks: any;
  authority: any;
  authorityUnit: any;
  date: any;
  firmName: any;
  invoiceNo: any;
  invoiceDate: any;
  invoiceFile: any;
  returnRemarks: any;
  status: any;
  checked?: boolean;
  budgetAllocated: any;
}
class updateRequest {
  status: any;
  groupId: any;
  remarks: any;
  cdaParkingId:any;
}

@Component({
  selector: 'app-cb-verification',
  templateUrl: './cb-verification.component.html',
  styleUrls: ['./cb-verification.component.scss']
})
export class CbVerificationComponent {
  p: number = 1;
  finYearData: any;
  unitData: any;
  majorHeadData: any;
  minorHeadData: any;
  majorHead: any;
  subHeadData: any;
  budgetAllotted: any;
  expenditure: any;
  private dasboardData: any;
  FundAllotted: any;
  private unitId: any;
  cdaData: any;
  constructor(
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private datePipe: DatePipe,
    public sharedService: SharedService
  ) {}
  selectedCb: any;
  cbList: cb[] = [];
  disabled: boolean = true;
  formdata = new FormGroup({
    balance:new FormControl(),
    progressive:new FormControl(),
    budgetAllocated: new FormControl(),
    minorHead: new FormControl(), //
    unit: new FormControl(), //
    finYearName: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    amount: new FormControl('0'),
    file: new FormControl(),
    cbNo: new FormControl(),
    cbDate: new FormControl(),
    remarks: new FormControl(),
    authority: new FormControl(),
    authorityUnit: new FormControl(),
    date: new FormControl(),
    firmName: new FormControl(),
    invoiceNo: new FormControl(),
    invoiceDate: new FormControl(),
    invoiceFile: new FormControl(),
    returnRemarks: new FormControl(),
  });
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getContingentBill();
    this.getMajorHead();
    this.getFinancialYear();
    this.getCgUnitData();
    this.getSubHeadType();
    this.updateInbox();
  }
  private getContingentBill() {
    this.cbList = [];
    this.apiService.getApi(this.cons.api.getCb).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        // console.log(result['response']);
        let getCbList = result['response'];

        for (let i = 0; i < getCbList.length; i++) {
          // console.log('interation :' + i);
          if(getCbList[i].authoritiesList.length>0)
          {
            let cdaData=[];
            for(let cda of getCbList[i].cdaData){
              const cdaItr = {
                cdacrDrId: cda.cdaCrdrId,
                cdaParkingId:cda.cdaParkingTrans,
                cdaAmount:cda.amount
              };
              cdaData.push(cdaItr);
            }
            const entry: cb = {
              cdaParkingId:cdaData,
              authGroupId: getCbList[i].authoritiesList[0].authGroupId,
              onAccountOf: getCbList[i].onAccountOf,
              authorityDetails: getCbList[i].authorityDetails,
              authUnitId: getCbList[i].authoritiesList[0].authUnit,
              unitId: getCbList[i].cbUnitId.unit,
              uploadFileDate: getCbList[i].fileDate,
              finSerialNo: getCbList[i].finYear.serialNo,
              progressiveAmount: getCbList[i].progressiveAmount,
              fileDate: getCbList[i].fileDate,
              minorHead: getCbList[i].budgetHeadID.minorHead,
              unit: getCbList[i].cbUnitId.descr,
              finYearName: getCbList[i].finYear.finYear,
              majorHead: getCbList[i].budgetHeadID.majorHead,
              subHead: getCbList[i].budgetHeadID.subHeadDescr,
              amount: getCbList[i].cbAmount,
              cbNo: getCbList[i].cbNo,
              cbDate: this.datePipe.transform(
                new Date(getCbList[i].cbDate),
                'yyyy-MM-dd'
              ),
              remarks: getCbList[i].remarks,
              authority: getCbList[i].authoritiesList[0].authority,
              authorityUnit: getCbList[i].authoritiesList[0].authUnit,
              date: this.datePipe.transform(
                new Date(getCbList[i].authoritiesList[0].authDate),
                'yyyy-MM-dd'
              ),
              firmName: getCbList[i].vendorName,
              invoiceNo: getCbList[i].invoiceNO,
              invoiceDate: getCbList[i].invoiceDate,
              invoiceFile: getCbList[i].invoiceUploadId.uploadID,
              returnRemarks: getCbList[i].authoritiesList[0].remarks,
              status: getCbList[i].status,
              budgetAllocated: this.budgetAllotted,
              checked: false,
              fileNo: getCbList[i].fileID,
              file: getCbList[i].authoritiesList[0].docId,
              budgetHeadID: getCbList[i].budgetHeadID,
              contingentBilId: getCbList[i].cbId,
            };
            if (entry.authGroupId == this.sharedService.sharedValue)
              this.cbList.push(entry);
            // console.log(entry+"      ||     "+this.cbList);
          }

        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getFinancialYear() {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getBudgetFinYear)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.finYearData = result['response'];
      });
  }
  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.unitData = result['response'];
    });
  }
  getMajorHead() {
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          localStorage.setItem('newToken', result['response']['token']);
          this.majorHeadData = result['response'].subHead;
          this.minorHeadData = result['response'].subHead;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {},
      complete: () => console.info('complete'),
    });
  }
  getCheckedRows(cbNo: any) {
    this.cbList.forEach((cbEntry) => {
      if (cbEntry.cbNo == cbNo && cbEntry.checked == false) {
        cbEntry.checked = true;
        this.updateFormdata(cbEntry);
      } else if (cbEntry.cbNo == cbNo && cbEntry.checked == true)
        cbEntry.checked = false;
    });
  }
  getSubHeadType(){
    this.apiService
      .getApi(this.cons.api.getSubHeadType)
      .subscribe({
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
  updateFormdata(cbEntry: cb) {
    let subHeadType:any;
    // console.log('cbentry' + cbEntry);
    for (let i = 0; i < this.majorHeadData.length; i++) {
      let major = this.majorHeadData[i];
      if (major.majorHead == cbEntry.majorHead) {
        this.formdata.get('majorHead')?.setValue(cbEntry.majorHead);
        this.majorHead = major;
        if (this.subHeadData == undefined) {
          for(let i=0;i< this.subHeadType.length;i++){
            if(this.subHeadType[i].subHeadTypeId==cbEntry.budgetHeadID.subHeadTypeId){
              // this.formdata.get('subHeadType')?.setValue(this.subHeadType[i]);
              subHeadType=this.subHeadType[i];
              this.SpinnerService.show();
              this.formdata.get('minorHead')?.setValue(this.majorHead);
              this.SpinnerService.show();
              let json={
                budgetHeadType:subHeadType.subHeadTypeId,
                majorHead:cbEntry.majorHead
              }
              this.apiService.postApi(this.cons.api.getAllSubHeadByMajorHead,json).subscribe((res) => {
                  let result: { [key: string]: any } = res;
                  this.subHeadData = result['response'];
                  for (let i = 0; i < this.subHeadData.length; i++) {
                    let sub = this.subHeadData[i];
                    if (sub.subHeadDescr == cbEntry.subHead) {
                      this.formdata.get('subHead')?.setValue(sub);
                      let json = {
                        budgetHeadId: this.formdata.get('subHead')?.value.budgetCodeId,
                        budgetFinancialYearId:this.formdata.get('finYearName')?.value.serialNo,
                        unitId:this.unitId
                      };
                      this.apiService.postApi(this.cons.api.getAvailableFund, json).subscribe({
                        next: (v: object) => {
                          this.SpinnerService.hide();
                          let result: { [key: string]: any } = v;
                          if (result['message'] == 'success') {
                            this.FundAllotted = result['response'];
                            this.expenditure = parseFloat(this.FundAllotted.expenditure);
                            this.formdata.get('progressive')?.setValue(this.expenditure);
                            this.formdata.get('budgetAllocated')?.setValue(parseFloat(this.FundAllotted.fundallocated)*this.FundAllotted.amountUnit.amount);
                            this.budgetAllotted = cbEntry.budgetAllocated;
                            this.formdata.get('progressive')?.setValue(parseFloat(this.FundAllotted.expenditure));
                            this.formdata
                              .get('balance')
                              ?.setValue(parseFloat(this.FundAllotted.fundallocated)*this.FundAllotted.amountUnit.amount - parseFloat(this.FundAllotted.expenditure));
                            this.cdaData=result['response'].cdaParkingTrans;
                            for(let cda of this.cdaData){
                              cda.remainingCdaAmount=parseFloat(cda.remainingCdaAmount)*parseFloat(cda.amountType.amount);
                              for(let cbEntryItr of cbEntry.cdaParkingId){
                                if(cda.cdaParkingId==cbEntryItr.cdaParkingId)
                                  cda.amount=cbEntryItr.cdaAmount;
                              }
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
                  }
                  this.SpinnerService.hide();
                },
                (error) => {
                  console.error(error);
                  this.SpinnerService.hide();
                }
              );
            }
          }
        } else {
          for (let i = 0; i < this.subHeadData.length; i++) {
            let sub = this.subHeadData[i];
            if (sub.subHeadDescr == cbEntry.subHead) {
              this.formdata.get('subHead')?.setValue(sub);
            }
          }
        }
      }
    }
    this.formdata.get('amount')?.setValue(cbEntry.amount);
    this.formdata.get('cbNo')?.setValue(cbEntry.cbNo);
    this.formdata.get('cbDate')?.setValue(cbEntry.cbDate);
    this.formdata.get('remarks')?.setValue(cbEntry.remarks);
    this.formdata.get('authority')?.setValue(cbEntry.authority);
    this.formdata.get('date')?.setValue(cbEntry.date);
    this.formdata.get('firmName')?.setValue(cbEntry.firmName);
    this.formdata.get('invoiceNo')?.setValue(cbEntry.invoiceNo);
    this.formdata.get('invoiceDate')?.setValue(cbEntry.invoiceDate);
    this.formdata.get('invoiceFile')?.setValue(cbEntry.invoiceFile);
    this.formdata.get('returnRemarks')?.setValue(cbEntry.returnRemarks);
    for (let i = 0; i < this.minorHeadData.length; i++) {
      if (this.minorHeadData[i].minorHead == cbEntry.minorHead) {
        this.formdata.get('minorHead')?.setValue(this.minorHeadData[i]);
      }
    }
    this.formdata.get('unit')?.setValue(cbEntry.unit);
    this.formdata.get('authorityUnit')?.setValue(cbEntry.unit);
    for (let i = 0; i < this.finYearData.length; i++) {
      if (this.finYearData[i].finYear == cbEntry.finYearName)
        this.formdata.get('finYearName')?.setValue(this.finYearData[i]);
    }
    this.formdata.get('file')?.setValue(cbEntry.file);
  }
  subHeadType:any;
  confirmModel() {
    Swal.fire({
      title: 'Are you sure you want to Approve this Batch?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveCb();
      }
    });
  }
  approveCb() {
    for (let i = 0; i < this.cbList.length; i++) {
      // if(this.cbList[i].cbNo==this.formdata.get('cbNo')?.value){
      this.cbList[i].status = 'Verified';
    }
    let cdapark:any[]=[];
    // debugger;
    for(let list of this.cbList){
      for(let cda of list.cdaParkingId){
        const entry={
          cdacrDrId:cda.cdacrDrId,
          allocatedAmount:cda.cdaAmount,
        }
        cdapark.push(entry);
      }
    }
    const update: updateRequest = {
      status: this.cbList[0].status,
      groupId: this.cbList[0].authGroupId,
      remarks: undefined,
      cdaParkingId:cdapark
    };
    this.apiService
      .postApi(this.cons.api.verifyContingentBill, update)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.common.successAlert('Verified', result['message'], '');
            this.cbList = [];
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
          this.updateInbox();
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.getContingentBill(),
      });
    // }
    // }
    // console.log(this.cbList);
  }
  confirmRejectModel() {
    Swal.fire({
      title: 'Are you sure you want to Reject this Batch?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnCb();
      }
    });
  }
  returnCb() {
    if(this.formdata.get('returnRemarks')?.value==undefined){
      Swal.fire('Return Remark cannot be blank');
      return;
    }
    for (let i = 0; i < this.cbList.length; i++) {
      // if(this.cbList[i].cbNo==this.formdata.get('cbNo')?.value){
      this.cbList[i].status = 'Rejected';
    }
    let cdapark:any[]=[];
    // debugger;
    for(let list of this.cbList){
      for(let cda of list.cdaParkingId){
        const entry={
          cdacrDrId:cda.cdacrDrId,
          allocatedAmount:cda.cdaAmount,
        }
        cdapark.push(entry);
      }
    }
    const update: updateRequest = {
      status: this.cbList[0].status,
      groupId: this.cbList[0].authGroupId,
      remarks: this.formdata.get('returnRemarks')?.value,
      cdaParkingId: cdapark
    };
    this.apiService
      .postApi(this.cons.api.verifyContingentBill, update)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert('Rejected', result['message'], '');
            this.cbList = [];
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
          this.updateInbox();
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.getContingentBill(),
      });
    // }
    // }

  }
  viewFile(file: string) {
    this.apiService
      .getApi(this.cons.api.fileDownload + this.formdata.get(file)?.value)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          this.openPdfUrlInNewTab(result['response'].pathURL);
          // console.log(result['response'].pathURL);
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
  updateInbox(){
    this.apiService
      .getApi(this.cons.api.updateInboxOutBox)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.unitId=result['response'].userDetails.unitId;
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
  getAvailableFundData() {
    this.SpinnerService.show();
    let json = {
      budgetHeadId: this.formdata.get('subHead')?.value.budgetCodeId,
    };
    this.apiService.postApi(this.cons.api.getAvailableFund, json).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.FundAllotted = result['response'];
          this.expenditure = this.FundAllotted.expenditure;
          this.formdata.get('progressive')?.setValue(this.expenditure);
          if (result['response'].fundAvailable == 0) {
            this.budgetAllotted = 0;
            this.formdata.get('budgetAllocated')?.setValue(0);
          } else {
            this.budgetAllotted = (
              parseFloat(result['response'].fundallocated) *
              parseFloat(result['response'].amountUnit.amount)
            ).toFixed(4);
            this.formdata
              .get('budgetAllocated')
              ?.setValue(
                (
                  parseFloat(result['response'].fundallocated) *
                  parseFloat(result['response'].amountUnit.amount)
                ).toFixed(4)
              );
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
}
