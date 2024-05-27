import { Component, OnInit} from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import {SharedService} from "../services/shared/shared.service";
import {DatePipe} from "@angular/common";
import {MultiCdaParking} from "../model/multi-cda-parking";

@Component({
  selector: 'app-cda-parking',
  templateUrl: './cda-parking.component.html',
  styleUrls: ['./cda-parking.component.scss'],
})
export class CdaParkingComponent implements OnInit {

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
  originalCda:any;
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
    this.originalCda=[];
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
      this.originalCda.push(entry);
      this.totalParking=Number(sum).toFixed(7);

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
    for(let cda of this.originalCda){
      if(cda.balance!=undefined)
        sum1=Number(sum1)+Number(cda.balance);
    }
    for(let cda of this.cdaList){
      debugger;
      if(cda.amount!=undefined)
        sum=Number(sum)+Number(cda.amount);
      // if(cda.balance!=undefined)
      //   sum1=Number(sum1)+Number(cda.balance);
    }
    this.totalParking=Number(sum1).toFixed(7);
    this.totalParking=Number(Number(this.totalParking)-Number(sum)).toFixed(7);
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
