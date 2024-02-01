import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common/common.service";
import {SharedService} from "../services/shared/shared.service";

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
    if(localStorage.getItem('cdaType')=='update')
      this.getCdaHistoryData();
    else if(localStorage.getItem('cdaType')=='entry')
      this.getCdaData();
  }

  private getCdaHistoryData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.cdaHistoryData+'/'+this.sharedService.sharedValue+'/'+localStorage.getItem('cdaUnitId')).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.oldCdaData=result['response'].oldCda;
        this.newCdaData=result['response'].newCda;
        this.oldSum=0;
        this.newSum=0;
        for(let cda of this.oldCdaData){
          this.oldSum=Number(Number(this.oldSum)+Number(cda.oldAmount)).toFixed(4);
        }
debugger;
        for(let cda of this.newCdaData){
          this.newSum=Number(Number(this.newSum)+Number(cda.newAmount)).toFixed(4);
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
            this.newSum=Number(Number(this.newSum)+Number(entry.newAmount)).toFixed(4);
            this.newCdaData.push(entry);
            debugger;
          }
          this.finallyMoveArchive(this.sharedService.msgId);
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
}
