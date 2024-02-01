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


  oldmultipleCdaParking:any[]=[];
  private getOldCdaData(submitJson:any) {
    this.oldmultipleCdaParking=[];
    this.apiService
      .postApi(this.cons.api.getAllBillCdaAndAllocationSummery, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.olddataflag=true;
            const keys = Object.keys(result['response'].subHeadData);
            for (const key of keys) {
              debugger;
              const value = result['response'].subHeadData[key];
              console.log(`${key}: ${value}`);
              let oldCdaData:MultiCdaParking= {
                id: -1,
                cdaParkingUnit: value.ginNo,
                amount: value.totalParkingAmount,
                balance: undefined,
                oldData: value.totalParkingAmount
              }

              if(oldCdaData!=undefined)
                this.oldmultipleCdaParking.push(oldCdaData);
              debugger;

              // this.getCDAParkingAllocatedAmount();
            }
            // this.totalExpWithAllocation=result['response'].totalExpWithAllocation.toString();


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
  populateCda(li: any,index:number) {
debugger;
    let json={
      financialYearId:li.finYear.serialNo,
      budgetHeadId:li.subHead.budgetCodeId,
      amountType:li.amountUnit.amountTypeId,
      allocationTypeId:li.allocTypeId.allocTypeId
    };
    this.getOldCdaData(json);

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
      this.totalParking=Number(sum).toFixed(4);

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
    this.totalParking=Number(sum1).toFixed(4);
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
            window.location.reload();
            this.common.successAlert('Updated','CDA updated Successfully','');

          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.log('complete'),
      });
  }
}
