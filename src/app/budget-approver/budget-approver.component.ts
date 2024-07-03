import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
// import { DialogComponent } from '../dialog/dialog.component';
// import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared/shared.service';
import { MultiCdaParking } from '../model/multi-cda-parking';
import * as Papa from 'papaparse';
import * as FileSaver from "file-saver";
import {HttpClient} from "@angular/common/http";
class TableData {
  Financial_Year: any;
  To_Unit: any;
  From_Unit: any;
  Subhead: any;
  Type: any;
  Allocated_Fund: any;
}
@Component({
  selector: 'app-budget-approver',
  templateUrl: './budget-approver.component.html',
  styleUrls: ['./budget-approver.component.scss'],
})
export class BudgetApproverComponent implements OnInit {
  multipleCdaParking: any[] = [];

  budgetDataList: any[] = [];

  type: any = '';

  p: number = 1;

  formdata = new FormGroup({
    remarks: new FormControl(),
    reportType:new FormControl('Select Report Type')
  });

  isInboxAndOutbox: any;
  private amountUnitData: any;
  currentIndex: number = 0;
  private authGroupId: any;
  private isRevision: boolean=false;
  previousParking: any[]=[];
  olddataflag: boolean=true;
  private unitId: any;
  showAction: boolean=true;
  oldmultipleCdaParking: any[]=[];
  private totalExpWithAllocation: any;
  subUnitAllocation:number=0;
  isNotification:string|null="true";
  isRevisionFlag: boolean=false;
  ngOnInit(): void {
    this.isNotification=localStorage.getItem('notification');
    this.sharedService.updateInbox();
    ////debugger;

    this.authGroupId=localStorage.getItem('group_id');
    this.getCdaUnitList();
    this.multipleCdaParking.push(new MultiCdaParking());
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }

  constructor(
    // private matDialog: MatDialog,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    public sharedService: SharedService
  ) {}
  private updateMsgStatusMain(msgId: any) {

    this.apiService
      .getApi(this.cons.api.updateMsgStatusMain +'/'+msgId)
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
  async getAllGroupIdAndUnitId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllGroupIdAndUnitId + '/' + groupId)
      .subscribe(async (res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          if(this.budgetDataList[0].isFlag=='1'||this.budgetDataList[0].isBudgetRevision=='1'){
            this.updateMsgStatusMain(this.sharedService.msgId);
          }
          if(this.budgetDataList[0].isTYpe=='REBASE'){
            this.updateMsgStatusMain(this.sharedService.msgId);
          }
          for (let i = 0; i < this.budgetDataList.length; i++) {
            if(this.budgetDataList[i].unallocatedAmount!=undefined&&this.budgetDataList[i].isTYpe!='REBASE') {
              // this.budgetDataList[i].allocationAmount1 = ((Number(this.budgetDataList[i].allocationAmount)*100000000 + Number(this.budgetDataList[i].unallocatedAmount)*100000000)/100000000).toString();
              this.budgetDataList[i].allocationAmount1 = await this.common.addDecimals(this.budgetDataList[i].allocationAmount,this.budgetDataList[i].unallocatedAmount);
            }
            else{
              this.budgetDataList[i].allocationAmount1 = (this.budgetDataList[i].allocationAmount);
            }
            // if (this.budgetDataList[i].balanceAmount != undefined) {
            //   this.budgetDataList[i].balanceAmount = parseFloat(
            //     this.budgetDataList[i].balanceAmount
            //   ).toFixed(4);
            // }
          }
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });

  }

  async getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe(async (res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          //debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          if(this.budgetDataList[0].toUnit.unit!=this.unitId)
            this.showAction=false;
          for (let i = 0; i < this.budgetDataList.length; i++) {
            if(this.budgetDataList[i].unallocatedAmount!=undefined)
              // this.budgetDataList[i].allocationAmount=(parseFloat(this.budgetDataList[i].allocationAmount)+parseFloat(this.budgetDataList[i].unallocatedAmount)).toFixed(4);
              this.budgetDataList[i].allocationAmount=await this.common.addDecimals(this.budgetDataList[i].allocationAmount,this.budgetDataList[i].unallocatedAmount);
          }
          // this.formdata.get('remarks')?.setValue(result['response'].budgetResponseist[0].returnRemarks);
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  cdaUnitList: any[] = [];
  getCdaUnitList() {
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
  approverConfirmationModel(data: any) {}

  returnConfirmationModel(data: any) {}

  approveForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveFormFinally(formDataValue);
      }
    });
  }

  returnForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Return it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnFormFinally(formDataValue);
      }
    });
  }

  approveFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let cdapark: any[] = [];
    // for (let list of this.budgetDataList) {
    //   for (let cda of list.cdaData) {
    //     const entry = {
    //       cdacrDrId: cda.cdaCrdrId,
    //       allocatedAmount: cda.amount,
    //       allocatedAmountType: cda.amountTypeMain.amountTypeId,
    //     };
    //     cdapark.push(entry);
    //   }
    // }
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Approved',
      remarks: formDataValue.remarks,
      // cdaParkingId: cdapark,
    };
    this.apiService
      .postApi(this.cons.api.budgetApprove, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.formdata.reset();
            this.updateInbox();
            this.router.navigateByUrl('/inbox');
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

  returnFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let cdapark: any[] = [];
    for (let list of this.budgetDataList) {
      for (let cda of list.cdaData) {
        const entry = {
          cdacrDrId: cda.cdaCrdrId,
          allocatedAmount: cda.amount,
          allocatedAmountType: cda.amountTypeMain.amountTypeId,
        };
        cdapark.push(entry);
      }
    }
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Rejected',
      remarks: formDataValue.remarks,
      cdaParkingId: cdapark,
    };
    this.apiService
      .postApi(this.cons.api.budgetReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.updateInbox();
            this.formdata.reset();
            this.router.navigateByUrl('/inbox');
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

  totalAmountToAllocateCDAParking: any;
  getCurrentSubHeadData: any;
  showSubmit: boolean = false;
  amountUnit: any;
  showSubHeadDataInNextPage: any;
  async addCDAParking(data: any, index: number) {
    this.currentIndex = index;
    ////debugger;
    this.getCurrentSubHeadData = data;
    this.showSubHeadDataInNextPage = data.subHead.subHeadDescr;
    this.amountUnit = data.amountUnit.amountType;
    this.amountUnitData = data.amountUnit;
    this.multipleCdaParking = [];

    this.multipleCdaParking.push(new MultiCdaParking());
    if(data.revisedAmount!=undefined)
      // this.totalAmountToAllocateCDAParking = ((Number(data.allocationAmount1)*100000000)/100000000).toString();
      this.totalAmountToAllocateCDAParking = data.allocationAmount1;
    else
      // this.totalAmountToAllocateCDAParking = ((Number(data.allocationAmount1)*100000000)/100000000).toString();
      this.totalAmountToAllocateCDAParking = data.allocationAmount1;
    debugger;
    this.isdisableSubmitButton = true;
    this.isdisableUpdateButton = true;
    this.showUpdate = false;
    this.showSubmit = true;
    this.previousParking=[];
    debugger;
    if(Number(data.revisedAmount)!=0){
      for(let oldCda of this.oldmultipleCdaParking){
        this.multipleCdaParking.push(oldCda);
      }
    }
    else{
      let json={
        financialYearId:data.finYear.serialNo,
        budgetHeadId:data.subHead.budgetCodeId,
        amountType:data.amountUnit.amountTypeId,
        allocationTypeId:data.allocTypeId.allocTypeId
      };
      this.olddataflag=false;
      this.subUnitAllocation=0;
      this.apiService
        .postApi(this.cons.api.getAllBillCdaAndAllocationSummery, json)
        .subscribe({
          next: async (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.olddataflag=true;
              this.subUnitAllocation=Number(result['response'].totalExpWithAllocation);
              if(result['response'].totalExpWithAllocation!=undefined){
                // this.totalAmountToAllocateCDAParking=((Number(this.totalAmountToAllocateCDAParking)*100000000-(Number(result['response'].totalExpWithAllocation)*100000000/this.budgetDataList[0].amountUnit.amount))/100000000).toString();
                const div=await this.common.divideDecimals(result['response'].totalExpWithAllocation,this.budgetDataList[0].amountUnit.amount);
                this.totalAmountToAllocateCDAParking=await this.common.subtractDecimals((this.totalAmountToAllocateCDAParking),div);
              }


              const keys = Object.keys(result['response'].subHeadData);
              for (const key of keys) {
                debugger;
                const value = result['response'].subHeadData[key];
                console.log(`${key}: ${value}`);
                let oldCdaData:MultiCdaParking= {
                  id: -1,
                  cdaParkingUnit: value.ginNo,
                  amount: Number(value.totalParkingAmount).toString(),
                  balance: undefined,
                  oldData: Number(value.totalParkingAmount).toString()
                }

                if(oldCdaData!=undefined)
                  this.oldmultipleCdaParking.push(oldCdaData);
                this.multipleCdaParking.push(oldCdaData);
                this.getCDAParkingAllocatedAmount();
              }
              this.totalExpWithAllocation=result['response'].totalExpWithAllocation.toString();

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

    this.getCDAParkingAllocatedAmount();
    let submitJson={
      financialYearId:this.budgetDataList[index].finYear.serialNo,
      budgetHeadId:this.budgetDataList[index].subHead.budgetCodeId,
      allocationTypeId:this.budgetDataList[index].allocTypeId.allocTypeId,
      authGroupId:localStorage.getItem('group_id'),
      amountType:this.budgetDataList[index].amountUnit.amountTypeId,
    }

    // if(this.budgetDataList[0].isTYpe=='AFTER REVISION'){
    //   //debugger;
    //   this.totalAmountToAllocateCDAParking=(Number(this.totalAmountToAllocateCDAParking)-(Number(this.totalExpWithAllocation)/this.budgetDataList[0].amountUnit.amount)).toFixed(4)
    // }
    this.balancedRemaingCdaParkingAmount = this.totalAmountToAllocateCDAParking;
    this.getCDAParkingAllocatedAmount();
    // put rebase condition
    //debugger;
    if(this.budgetDataList[this.currentIndex].isTYpe=='REBASE'){
      this.olddataflag=false;
      this.apiService
        .postApi(this.cons.api.getOldCdaDataForRebase, submitJson)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.olddataflag=true;
              const keys = Object.keys(result['response'].subHeadData);
              for (const key of keys) {
                const value = result['response'].subHeadData[key];
                console.log(`${key}: ${value}`);
                let oldCdaData:MultiCdaParking= {
                  id: undefined,
                  cdaParkingUnit: value.ginNo,
                  amount: value.totalParkingAmount,
                  balance: undefined,
                  oldData: value.totalParkingAmount
                }
                this.multipleCdaParking.push(oldCdaData);

                this.getCDAParkingAllocatedAmount();
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

  async deleteFromMultipleCdaParking(index: any) {
    this.multipleCdaParking.splice(index, 1);
    var amount:any = 0;
    var unitIndex = this.multipleCdaParking.filter(
      (data) => data.amount != null
    );
    for (var i = 0; i < unitIndex.length; i++) {
      if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
        // amount = parseFloat(amount) + parseFloat(unitIndex[i].amount);
        amount =await this.common.addDecimals(amount,unitIndex[i].amount);
      }
    }
    // amount=amount.toFixed(4);
    this.balancedRemaingCdaParkingAmount =await this.common.subtractDecimals(this.totalAmountToAllocateCDAParking,amount);
    if (
      this.balancedRemaingCdaParkingAmount == '0' ||
      this.balancedRemaingCdaParkingAmount == '0.0000'||Number(this.balancedRemaingCdaParkingAmount)==0
    ) {
      this.isdisableSubmitButton = false;
      this.isdisableUpdateButton = false;
    } else {
      this.isdisableSubmitButton = true;
      this.isdisableUpdateButton = true;
    }
  }

  addNewRow() {
    this.multipleCdaParking.push(new MultiCdaParking());
  }
  addOldParking(parking:MultiCdaParking) {
    this.multipleCdaParking.push(parking);
  }
  cdaParkingListResponseData: any[] = [];

  async saveCdaParkingData1() {
    this.getCurrentSubHeadData;
    this.multipleCdaParking;
    this.cdaParkingListResponseData = [];
    for (var i = 0; i < this.multipleCdaParking.length; i++) {
      debugger;
      if(this.multipleCdaParking[i].oldData!=undefined){
        if(this.multipleCdaParking[i].cdaParkingUnit==undefined&&this.multipleCdaParking[i].amount!=undefined){
          this.common.faliureAlert('Cannot Submit','Cannot Save CDA data without selecting CDA','');
          return;
        }
        this.cdaParkingListResponseData.push({
          amountTypeId: this.amountUnitData.amountTypeId,
          budgetFinancialYearId: this.getCurrentSubHeadData.finYear.serialNo,
          allocationTypeID: this.getCurrentSubHeadData.allocTypeId.allocTypeId,
          ginNo: this.multipleCdaParking[i].cdaParkingUnit.ginNo,
          budgetHeadId: this.getCurrentSubHeadData.subHead.budgetCodeId,
          totalParkingAmount: this.multipleCdaParking[i].amount,
          // availableParkingAmount: Number(Number(this.multipleCdaParking[i].amount)-Number(this.multipleCdaParking[i].oldData)),
          availableParkingAmount:await this.common.subtractDecimals(this.multipleCdaParking[i].amount,this.multipleCdaParking[i].oldData),
          authGroupId: this.getCurrentSubHeadData.authGroupId,
          transactionId: this.getCurrentSubHeadData.allocationId,
        });
      }else{
        if(this.multipleCdaParking[i].cdaParkingUnit==undefined&&this.multipleCdaParking[i].amount!=undefined){
          this.common.faliureAlert('Cannot Submit','Cannot Save CDA data without selecting CDA','');
          return;
        }
        if(this.multipleCdaParking[i].cdaParkingUnit!=undefined){
          this.cdaParkingListResponseData.push({
            amountTypeId: this.amountUnitData.amountTypeId,
            budgetFinancialYearId: this.getCurrentSubHeadData.finYear.serialNo,
            allocationTypeID: this.getCurrentSubHeadData.allocTypeId.allocTypeId,
            ginNo: this.multipleCdaParking[i].cdaParkingUnit.ginNo,
            budgetHeadId: this.getCurrentSubHeadData.subHead.budgetCodeId,
            totalParkingAmount: this.multipleCdaParking[i].amount,
            availableParkingAmount: this.multipleCdaParking[i].amount,
            authGroupId: this.getCurrentSubHeadData.authGroupId,
            transactionId: this.getCurrentSubHeadData.allocationId,
          });
        }

      }
    }
    debugger;
    this.saveCDAParking(this.cdaParkingListResponseData);
  }
   saveCDAParking(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = {
      totalExpenditure: this.budgetDataList[this.currentIndex].unallocatedAmount,
      cdaRequest: data,
    };
    let url=this.cons.api.saveCdaParkingData;
    if(this.budgetDataList[0].isTYpe=='REBASE'||this.budgetDataList[0].isTYpe=='REVISION'){
      //debugger;
      url=this.cons.api.saveCdaParkingDataForRebase;
    }
    //debugger;
    this.apiService
      .postApi(url, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.budgetDataList[this.currentIndex].isCDAparking = '1';
            // this.router.navigate(['/budget-approval']);
            this.common.successAlert(
              'CDA Saved',
              'CDA Parking Saved succesfully',
              ''
            );
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.updateInbox(),
      });
  }
  public userRole: any;
  getDashBoardDta() {
    this.SpinnerService.show();
    var newSubmitJson = null;
    this.apiService
      .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.userRole = result['response'].userDetails.role[0].roleName;
            this.unitId=result['response'].userDetails.unitId;
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.sharedService.archive = result['response'].archived;
            this.sharedService.approve = result['response'].approved;
            //debugger;
            if (
              localStorage.getItem('isInboxOrOutbox') != null ||
              localStorage.getItem('isInboxOrOutbox') != undefined
            ) {
              this.isInboxAndOutbox = localStorage.getItem('isInboxOrOutbox');
            }
            if (
              localStorage.getItem('type') != null ||
              localStorage.getItem('type') != undefined
            ) {
              this.type = localStorage.getItem('type');

              if (this.type == 'Budget Receipt') {
                //debugger;
                if(this.sharedService.isRevision=='1')
                {
                  this.isRevisionFlag=true;
                  this.getAllGroupIdAndUnitIdRevisionCase(this.sharedService.sharedValue)
                }
                else {
                  this.getAllGroupIdAndUnitId(this.sharedService.sharedValue);
                }
              }
              else {
                this.getAlGroupId(localStorage.getItem('group_id'));
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
  authGroupIdFromBackend: any;
  showUpdate: boolean = false;
  async viewCDAParking(budgetData: any) {
    this.amountUnitData = budgetData.amountUnit;
    this.showUpdate = true;
    this.showSubmit = false;
    this.showSubHeadDataInNextPage = budgetData.subHead.subHeadDescr;
    this.getCurrentSubHeadData = budgetData;
    this.amountUnit = budgetData.amountUnit.amountType;
    this.multipleCdaParking = [];
    this.multipleCdaParking.push(new MultiCdaParking());
    // this.totalAmountToAllocateCDAParking = budgetData.allocationAmount;
    if(budgetData.revisedAmount!=undefined)
      // this.totalAmountToAllocateCDAParking = (Number(budgetData.allocationAmount1)).toString();
      this.totalAmountToAllocateCDAParking = budgetData.allocationAmount1;
    else
      // this.totalAmountToAllocateCDAParking = (Number(budgetData.allocationAmount1)).toString();
      this.totalAmountToAllocateCDAParking = budgetData.allocationAmount1;

    this.balancedRemaingCdaParkingAmount = '0.0000';
    this.isdisableSubmitButton = true;
    this.isdisableUpdateButton = true;

    this.SpinnerService.show();
    let submitJson = {
      financialYearId: budgetData.finYear.serialNo,
      budgetHeadId: budgetData.subHead.budgetCodeId,
      allocationTypeId: budgetData.allocTypeId.allocTypeId,
    };
    this.apiService
      .postApi(this.cons.api.getCdaDataList, submitJson)
      .subscribe({
        next: async (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // multipleCdaParking

            var cdaParkingList = result['response'].cdaParking;
            this.multipleCdaParking = [];

            this.authGroupIdFromBackend = cdaParkingList[0].authGroupId;
            for (var i = 0; i < cdaParkingList.length; i++) {
              var dummyMultipleCdaParkingData = new MultiCdaParking();
              dummyMultipleCdaParkingData.cdaParkingUnit =
                cdaParkingList[i].ginNo;
              dummyMultipleCdaParkingData.amount =
                cdaParkingList[i].totalParkingAmount;
              // dummyMultipleCdaParkingData.balance = Number(cdaParkingList[i].remainingCdaAmount).toFixed(4);
              dummyMultipleCdaParkingData.balance = cdaParkingList[i].remainingCdaAmount;

              this.multipleCdaParking.push(dummyMultipleCdaParkingData);
            }

            var amount:any = 0;
            var unitIndex = this.multipleCdaParking.filter(
              (data) => data.amount != null
            );
            for (var i = 0; i < unitIndex.length; i++) {
              if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
                amount =await this.common.addDecimals(amount,unitIndex[i].amount);
              }
            }
            // amount=amount.toFixed(4);
            // this.balancedRemaingCdaParkingAmount = (parseFloat(this.totalAmountToAllocateCDAParking) - parseFloat(amount)).toFixed(4);
            this.balancedRemaingCdaParkingAmount =await this.common.addDecimals(this.totalAmountToAllocateCDAParking,amount);
            if (
              this.balancedRemaingCdaParkingAmount == '0' ||
              this.balancedRemaingCdaParkingAmount == '0.0000'||Number(this.balancedRemaingCdaParkingAmount)==0
            ) {
              this.isdisableSubmitButton = false;
              this.isdisableUpdateButton = false;
            } else {
              this.isdisableSubmitButton = true;
              this.isdisableUpdateButton = true;
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
  balancedRemaingCdaParkingAmount: any;
  isdisableSubmitButton: boolean = true;
  isdisableUpdateButton: boolean = true;

  async getCDAParkingAllocatedAmount() {
    var amount:any = 0;
    var unitIndex = this.multipleCdaParking.filter(
      (data) => data.amount != null
    );
    for (var i = 0; i < unitIndex.length; i++) {
      if (unitIndex[i].amount != '' || unitIndex[i].amount != null) {
        if(parseFloat(unitIndex[i].amount)<0){
          this.common.faliureAlert('Invalid Amount','Amount cannot be less than zero','');
          unitIndex[i].amount=undefined;
          return;
        }
        // amount = ((Number(amount)*100000000) + (Number(unitIndex[i].amount)*100000000))/100000000;
        amount =await this.common.addDecimals(amount,unitIndex[i].amount);
      }
    }
    debugger;
    amount=amount.toString();
    // this.balancedRemaingCdaParkingAmount = (((Number(this.totalAmountToAllocateCDAParking)*100000000) - (Number(amount)*100000000))).toFixed(0);
    this.balancedRemaingCdaParkingAmount =await this.common.subtractDecimals(this.totalAmountToAllocateCDAParking,amount);
    // this.balancedRemaingCdaParkingAmount=(this.balancedRemaingCdaParkingAmount/100000000).toString();
    if(this.balancedRemaingCdaParkingAmount == '-0.0000')
      this.balancedRemaingCdaParkingAmount == '0.0000';
    if (
      this.balancedRemaingCdaParkingAmount == '0' ||
      this.balancedRemaingCdaParkingAmount == '0.0000' ||
      this.balancedRemaingCdaParkingAmount == '-0.0000'||Number(this.balancedRemaingCdaParkingAmount)==0
    ) {
      this.isdisableSubmitButton = false;
      this.isdisableUpdateButton = false;
    } else {
      this.isdisableSubmitButton = true;
      this.isdisableUpdateButton = true;
    }
  }
  updateCdaParkingDataApi() {
    this.getCurrentSubHeadData;
    this.multipleCdaParking;
    this.cdaParkingListResponseData = [];
    ////debugger;
    for (var i = 0; i < this.multipleCdaParking.length; i++) {
      this.cdaParkingListResponseData.push({
        amountTypeId: this.amountUnitData.amountTypeId,
        budgetFinancialYearId: this.getCurrentSubHeadData.finYear.serialNo,
        allocationTypeID: this.getCurrentSubHeadData.allocTypeId.allocTypeId,
        ginNo: this.multipleCdaParking[i].cdaParkingUnit.ginNo,
        budgetHeadId: this.getCurrentSubHeadData.subHead.budgetCodeId,
        currentParkingAmount: this.multipleCdaParking[i].cdaParkingUnit.amount,
        availableParkingAmount: this.multipleCdaParking[i].amount,
        authGroupId: this.getCurrentSubHeadData.authGroupId,
        transactionId: this.getCurrentSubHeadData.allocationId,
      });
    }

    this.updateCdaParkingData(this.cdaParkingListResponseData);
  }
  updateCdaParkingData(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = {
      cdaRequest: data,
      authGroupId: this.authGroupIdFromBackend,
    };

    this.apiService
      .postApi(this.cons.api.updateCdaParkingData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            // this.router.navigate(['/budget-approval']);
            // window.location.reload();
            this.common.successAlert('Updated','CDA updated Successfully','')
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
  updateInbox() {
    this.apiService.getApi(this.cons.api.updateInboxOutBox).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.approve = result['response'].approved;
          this.sharedService.archive = result['response'].archived;
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
  generateCSV(data: any[],columns: string[],filename: string,column: string[]) {
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
  downloadAllocationCsv() {
    // Example data and column names
    let tableData = [];
    let totalR = 0.0;
    let totalA = 0.0;
    for (let i = 0; i < this.budgetDataList.length; i++) {
      if(this.budgetDataList[i].isFlag=='1') {
        debugger;
        continue;
      }
      totalA =
        totalA +
        parseFloat(this.budgetDataList[i].allocationAmount) *
        this.budgetDataList[i].amountUnit.amount;
      // totalR=totalR+(parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount);
      let table: any = {
        Financial_Year: this.budgetDataList[i].finYear.finYear.replaceAll(
          ',',
          ' '
        ),
        To_Unit: this.budgetDataList[i].toUnit.descr.replaceAll(',', ' '),
        From_Unit: this.budgetDataList[i].fromUnit.descr.replaceAll(',', ' '),
        Subhead: this.budgetDataList[i].subHead.subHeadDescr.replaceAll(
          ',',
          ' '
        ),
        Type: this.budgetDataList[i].allocTypeId.allocType.replaceAll(',', ' '),
        // Remaining_Amount: (parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount/this.budgetDataList[i].amountUnit.amount).toString(),
        Allocated_Fund: this.budgetDataList[i].allocationAmount
          .replaceAll(',', ' ')
          .toString(),
      };
      if(parseFloat(this.budgetDataList[i].allocationAmount)!=0)
        tableData.push(table);
    }
    let table: TableData = {
      Financial_Year: '',
      To_Unit: '',
      From_Unit: '',
      Subhead: '',
      Type: 'TOTAL',
      Allocated_Fund: (
        parseFloat(totalA.toFixed(4)) /
        parseFloat(this.budgetDataList[0].amountUnit.amount)
      ).toString(),
    };
    tableData.push(table);
    // const data = [
    //   { name: 'John', age: 30, city: 'New York' },
    //   { name: 'Jane', age: 25, city: 'San Francisco' },
    //   { name: 'Bob', age: 35, city: 'Chicago' },
    // ];
    let columns;
    if(this.budgetDataList[0].subHead.majorHead=='2037'){
      columns = [
        'Financial_Year',
        'To_Unit',
        'From_Unit',
        'Revenue Object Head',
        'Type',
        'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
      ];
    }
    else{
      columns = [
        'Financial_Year',
        'To_Unit',
        'From_Unit',
        'Capital Detailed Head',
        'Type',
        'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
      ];
    }

    const column = [
      'Financial_Year',
      'To_Unit',
      'From_Unit',
      'Subhead',
      'Type',
      'Allocated_Fund',
    ];
    const filename = this.type + '.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
  }
  downloadCsv() {
    // Example data and column names
    let tableData = [];
    let totalR = 0.0;
    let totalA = 0.0;
    for (let i = 0; i < this.budgetDataList.length; i++) {
      totalA =
        Number(totalA + Number(this.budgetDataList[i].allocationAmount));
      totalR=Number(totalR+Number(this.budgetDataList[i].revisedAmount));
      let table: any = {
        Financial_Year: this.budgetDataList[i].finYear.finYear.replaceAll(
          ',',
          ' '
        ),
        To_Unit: this.budgetDataList[i].toUnit.descr.replaceAll(',', ' '),
        From_Unit: this.budgetDataList[i].fromUnit.descr.replaceAll(',', ' '),
        Subhead: this.budgetDataList[i].subHead.subHeadDescr.replaceAll(
          ',',
          ' '
        ),
        Type: this.budgetDataList[i].allocTypeId.allocType.replaceAll(',', ' '),
        Allocated_Fund: parseFloat(this.budgetDataList[i].allocationAmount
          .replaceAll(',', ' ')
          .toString())-parseFloat(this.budgetDataList[i].revisedAmount.replaceAll(',', ' ').toString()),
        Additional_Or_Withdrawal:this.budgetDataList[i].revisedAmount
          .replaceAll(',', ' ')
          .toString(),
        Revised_Amount:this.budgetDataList[i].allocationAmount,
      };
      if(parseFloat(this.budgetDataList[i].allocationAmount)!=0)
        tableData.push(table);
    }
    let table: any = {
      Financial_Year: '',
      To_Unit: '',
      From_Unit: '',
      Subhead: '',
      Type: 'Total',
      Allocated_Fund: Number(totalA-totalR),
      Additional_Or_Withdrawal:totalR,
      Revised_Amount:totalA,
    };
    tableData.push(table);
    table = {
      Financial_Year: '',
      To_Unit: '',
      From_Unit: '',
      Subhead: '',
      Type: 'Grand Total',
      Allocated_Fund: Number(totalA-totalR),
      Additional_Or_Withdrawal:totalR,
      Revised_Amount:totalA,
    };
    tableData.push(table);
    //Ashish ne kaha total hata do so hata diya phir bola wapas lagado total and grand total
    // tableData.push(table);



    // const data = [
    //   { name: 'John', age: 30, city: 'New York' },
    //   { name: 'Jane', age: 25, city: 'San Francisco' },
    //   { name: 'Bob', age: 35, city: 'Chicago' },
    // ];
    let columns;
    if(this.budgetDataList[0].subHead.majorHead=='2037'){
      columns = [
        'Financial_Year',
        'To_Unit',
        'From_Unit',
        'Object Head',
        'Type',
        'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
        'Additional_Or_Withdrawal' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
        'Revised_Amount' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
      ];
    }
    else{
      columns = [
        'Financial_Year',
        'To_Unit',
        'From_Unit',
        'Detailed Head',
        'Type',
        'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
        'Additional_Or_Withdrawal' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
        'Revised_Amount' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
      ];
    }
    // const columns = [
    //   'Financial_Year',
    //   'To_Unit',
    //   'From_Unit',
    //   'Subhead',
    //   'Type',
    //   'Allocated_Fund' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
    //   'Additional_Or_Withdrawal' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
    //   'Revised_Amount' + ' in ' + this.budgetDataList[0].amountUnit.amountType,
    // ];
    const column = [
      'Financial_Year',
      'To_Unit',
      'From_Unit',
      'Subhead',
      'Type',
      'Allocated_Fund',
      'Additional_Or_Withdrawal',
      'Revised_Amount'
    ];
    const filename = this.type + '.csv';

    // Generate and download the CSV file
    this.generateCSV(tableData, columns, filename, column);
  }
  cdaData: any[] = [];
  report: any;
  allocAmountUnit: string='';
  amountUnitType: string='';
  cdaDataList(cdaData: any) {
    this.cdaData = cdaData;
    this.allocAmountUnit=cdaData[0].amountTypeMain.amountType;
    this.amountUnitType=cdaData[0].amountType.amountType;
    ////debugger;
  }
  resetCdaList() {
    this.cdaData = [];
  }
  getAllocationReport(authGroupId: any) {
    this.SpinnerService.show();
    // ////debugger;
    this.apiService
      .getApi(this.cons.api.getAllocationReport + '/' + authGroupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        // ////debugger;
        if (result['message'] == 'success') {
          if (result['response'].length > 0) {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
          }
          // this.budgetDataList = result['response'].budgetResponseist;

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }
  getreAllocationReport(data: any) {
    //debugger;



    this.SpinnerService.show();
    // ////debugger;
    let url=this.cons.api.getRevisedAllocationReport+data;
    // let url=this.cons.api.getReceiptReportRevision+data;
    // this.apiService
    //   .getApi(url+'/'+localStorage.getItem('group_id'))
    this.apiService.getApi(url+'/'+localStorage.getItem('group_id'))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
          }
            // else if(result['message'] =='PENDING RECORD NOT FOUND'){
            //   this.apiService.getApi(this.cons.api.getRevisedAllocationAprReport+data+'/'+localStorage.getItem('group_id'))
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
            //
          // }
          else {
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
  getAllocationReportDocx(authGroupId: any) {
    this.SpinnerService.show();
    // ////debugger;
    this.apiService
      .getApi(this.cons.api.getAllocationReportDoc + '/' + authGroupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        // ////debugger;
        if (result['message'] == 'success') {
          if (result['response'].length > 0) {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
          }
          // this.budgetDataList = result['response'].budgetResponseist;

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
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
  downloadReport(formdata:any) {
    //debugger;
    if(this.type=='Budget Receipt'){

      if(formdata.reportType=='03'){
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
        {
          this.getreAllocationReportnew();
        }
        else{
          this.getRecieptReport('Doc');
        }

      }

      else if(formdata.reportType=='01'){
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
          this.downloadCsv();
        else
          this.downloadAllocationCsv();
      }
      else
      {
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
        {
          this.getreAllocationReport('');
        }
        else
          this.getRecieptReport('');
      }

    }
    else{
      if(formdata.reportType=='02'){
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
        {
          this.getreAllocationReport('');
        }

        else
          this.getAllocationReport(this.authGroupId);
      }
      else if(formdata.reportType=='03')
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
        {
          this.getreAllocationReport('Doc');
        }
        else
          this.getAllocationReportDocx(this.authGroupId);
      else if(formdata.reportType=='01')
      {
        if(parseFloat(this.budgetDataList[0].revisedAmount)!=0)
          this.downloadCsv();
        else
          this.downloadAllocationCsv();

      }

    }

  }
  private getRecieptReport(data: string) {
    this.SpinnerService.show();
    // ////debugger;
    let url=this.cons.api.getReceiptReport+data;
    this.apiService
      .getApi(url+'/'+localStorage.getItem('group_id'))
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
  async getAllGroupIdAndUnitIdRevisionCase(sharedValue: string | undefined) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllGroupIdAndUnitIdRevisionCase + '/' + sharedValue)
      .subscribe(async (res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          //debugger;
          if(this.budgetDataList[0].isFlag=='1'||this.budgetDataList[0].isBudgetRevision=='1'||this.budgetDataList[0].allocationAmount=='0.0000'||this.budgetDataList[0].isCDAparking=='1'){
            this.updateMsgStatusMain(this.sharedService.msgId);
          }
          for (let i = 0; i < this.budgetDataList.length; i++) {
            //debugger;
            let json={
              financialYearId:this.budgetDataList[i].finYear.serialNo,
              budgetHeadId:this.budgetDataList[i].subHead.budgetCodeId,
              amountType:this.budgetDataList[i].amountUnit.amountTypeId,
              allocationTypeId:this.budgetDataList[i].allocTypeId.allocTypeId
            };
            this.getOldCdaData(json);
            if(this.budgetDataList[i].totalAllocationAmount!=undefined){
              // this.budgetDataList[i].allocationAmount1=((Number(this.budgetDataList[i].allocationAmount)*100000000-(Number(this.budgetDataList[i].totalAllocationAmount)/this.budgetDataList[i].amountUnit.amount)*100000000)/100000000).toString();
              let div=await this.common.divideDecimals(this.budgetDataList[i].totalAllocationAmount,this.budgetDataList[i].amountUnit.amount);
              this.budgetDataList[i].allocationAmount1=await this.common.subtractDecimals(this.budgetDataList[i].allocationAmount,div);
            }
            else{
              this.budgetDataList[i].allocationAmount1=this.budgetDataList[i].allocationAmount;
            }
            // if (this.budgetDataList[i].balanceAmount != undefined) {
            //   this.budgetDataList[i].balanceAmount = parseFloat(this.budgetDataList[i].balanceAmount).toFixed(4);
            // }
          }
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });

    this.sharedService.isRevision=0;
  }
  editReturnedAllocation(value: any) {
    //debugger;
    this.sharedService.allocationData=this.budgetDataList;
    if (this.budgetDataList[0].isTYpe == 'S'||this.budgetDataList[0].isTYpe == 's') {
      this.router.navigate(['/budget-allocation-subheadwise']);

    }
    else if(this.budgetDataList[0].isTYpe == 'U'||this.budgetDataList[0].isTYpe == 'u'){
      this.router.navigate(['/budget-allocation']);
    }
  }
  // oldDataFlag:boolean=false;

  checkOldDataChange(cdaParking: any) {
    if(cdaParking.oldData!=undefined){
      if(cdaParking.amount<cdaParking.oldData){
        this.common.warningAlert('Amount cannot be less than previous expenditure','Amount cannot be less than previous expenditure of '+cdaParking.oldData,'');
        // this.oldDataFlag=true;

        for(let cda of this.multipleCdaParking){
          if(cda.cdaParkingUnit!=undefined){
            if(cda.cdaParkingUnit.ginNo==cdaParking.cdaParkingUnit.ginNo){
              cda.amount=cdaParking.oldData;
              this.getCDAParkingAllocatedAmount();
            }
          }

          //debugger;
        }
      }
    }

  }
  private getreAllocationReportnew() {
    this.SpinnerService.show();
    // ////debugger;
    let url=this.cons.api.getReceiptReportNew;
    this.apiService
      .getApi(url+'/'+localStorage.getItem('group_id'))
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
  private getOldCdaData(submitJson:any) {

    this.olddataflag=false;
    this.apiService
      .postApi(this.cons.api.getAllBillCdaAndAllocationSummery, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.olddataflag=true;
            const keys = Object.keys(result['response'].subHeadData);
            for (const key of keys) {
              debugger;
              const value = result['response'].subHeadData[key];
              console.log(`${key}: ${value}`);
              let oldCdaData:MultiCdaParking= {
                id: -1,
                cdaParkingUnit: value.ginNo,
                amount: ((value.totalParkingAmount)).toString(),
                balance: undefined,
                oldData: ((value.totalParkingAmount)).toString()
              }

              if(oldCdaData!=undefined)
                this.oldmultipleCdaParking.push(oldCdaData);

              this.getCDAParkingAllocatedAmount();
            }
            debugger;
            this.totalExpWithAllocation=result['response'].totalExpWithAllocation.toString();


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
  saveCdaParkingData() {
    for(let cdaParking of this.multipleCdaParking){
      if(cdaParking.oldData!=undefined){
        if(cdaParking.amount<cdaParking.oldData){
          this.common.warningAlert('Amount cannot be less than previous expenditure','Amount cannot be less than previous expenditure of '+cdaParking.oldData,'');
          return;
        }
      }
    }
    this.saveCdaParkingData1();
  }
}
