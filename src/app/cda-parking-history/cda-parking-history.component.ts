import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common/common.service";
import {SharedService} from "../services/shared/shared.service";
import {MultiCdaParking} from "../model/multi-cda-parking";

@Component({
  selector: 'app-cda-parking-history',
  templateUrl: './cda-parking-history.component.html',
  styleUrls: ['./cda-parking-history.component.scss']
})
export class CdaParkingHistoryComponent implements OnInit {
  oldCdaData: any[]=[];
  newCdaData: any[]=[];
  oldSum: any;
  newSum: any;
  expDataCdaList: any[]=[];
  expSum: any;
  oldSumResponse: any;
  newSumResponse: any;
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
    debugger;
    if(localStorage.getItem('cdaType')=='update')
      this.getCdaHistoryData();
    else if(localStorage.getItem('cdaType')=='entry')
      // this.getCdaData();
      this.getCdaHistoryData();
  }

  private getCdaHistoryData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.cdaHistoryData+'/'+this.sharedService.sharedValue+'/'+localStorage.getItem('cdaUnitId')).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.oldCdaData=result['response'].oldCda;
        this.newCdaData=result['response'].newCda;
        this.oldSumResponse=result['response'].oldDataSum;
        this.newSumResponse=result['response'].newDataSum;
        this.oldSum=0;
        this.newSum=0;

        for(let cda of this.oldCdaData){
          this.oldSum=((Number(Number(this.oldSum)*100000000+Number(cda.oldAmount)*100000000))/100000000).toString();
        }
          debugger;
        for(let cda of this.newCdaData){
          this.newSum=((Number(Number(this.newSum)*100000000+Number(cda.newAmount)*100000000)/100000000)).toString();
        }


        debugger;
        this.finallyMoveArchive(this.sharedService.msgId);
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }
  private finallyMoveArchive(msgId:string) {
    this.apiService
      .getApi(this.cons.api.moveToArchive +'/'+msgId)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;

        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }

  private getCdaData() {
    this.newSum=0;
    this.apiService
      .getApi(this.cons.api.getCdaDataUnitWise +'/'+this.sharedService.sharedValue+'/'+localStorage.getItem('cdaUnitId'))
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          debugger;
          let cdaData=result['response'].cdaParking;

          for(let data of cdaData){
            let entry={
              amountType:data.amountUnit,
              newGinNo:data.ginNo,
              newAmount:data.remainingCdaAmount,
              subHead:data.budgetHead
            }
            this.newSum=(Number(Number(this.newSum)*100000000+Number(entry.newAmount)*100000000)/100000000).toString();
            this.newCdaData.push(entry);
            debugger;
          }
          this.getPreviousCdaExpenditure(cdaData);
          this.finallyMoveArchive(this.sharedService.msgId);
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }

  private getPreviousCdaExpenditure(data: any[]) {
debugger;
    let json={
      financialYearId:data[0].finYearId.serialNo,
      budgetHeadId:data[0].budgetHead.budgetCodeId,
      amountType:data[0].amountUnit.amountTypeId,
      allocationTypeId:data[0].allocationType.allocTypeId,
      unitId:data[0].unitId,
    };
    this.apiService.postApi(this.cons.api.getAllBillCdaAndAllocationSummeryUnit, json).subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.expDataCdaList=[];
            this.expSum='0';
            const keys = Object.keys(result['response'].subHeadData);
            for (const key of keys) {
              debugger;
              const value = result['response'].subHeadData[key];
              console.log(`${key}: ${value}`);
              let oldCdaData= {
                ginNo: value.ginNo,
                amount: Number(value.totalParkingAmount).toString(),
              }
              this.expSum=Number(Number(this.expSum)+Number(oldCdaData.amount)).toString();
              this.expDataCdaList.push(oldCdaData);

            }
            debugger;
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
