import { Component } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { SubHeadWiseUnitList } from '../model/sub-head-wise-unit-list';
import { UploadDocuments } from '../model/upload-documents';
import Swal from 'sweetalert2';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-budget-allocation-subheadwise',
  templateUrl: './budget-allocation-subheadwise.component.html',
  styleUrls: ['./budget-allocation-subheadwise.component.scss'],
})
export class BudgetAllocationSubheadwiseComponent {
  budgetFinYears: any[] = [];
  subHeads: any[] = [];
  allunits: any[] = [];
  selectedunits: any[] = [];
  subHeadWiseUnitList: any[] = [];
  allocationType: any[] = [];

  budgetAllocationArray: any[] = [];

  submitted = false;

  p: number = 1;
  length: number = 0;

  amount = 0;

  submitJson: any;

  fundAvailableByFinYearAndUnitAndAllocationType: any;

  formdata = new FormGroup({
    finYear: new FormControl(),
    subHead: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    allocationType: new FormControl(),
    fundAvailable: new FormControl(),
    currentAllocation: new FormControl(),
    balanceFund: new FormControl(),
    remarks: new FormControl(),
    amountType: new FormControl(),
  });
  private subHeadData: any;

  ngOnInit(): void {
    this.getAmountType();
    // this.getBudgetFinYear();
    this.getSubHeadsData();
    this.getCgUnitData();
    // this.getAllocationTypeData();
    // this.getNewEmptyEntries();
    // this.getUnitDatas();
    this.uploadDocuments.push(new UploadDocuments());
    this.sharedDashboardData();
    $.getScript('assets/main.js');
  }

  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  getNewEmptyEntries() {
    for(let unit of this.allunits){
      let entry:SubHeadWiseUnitList= {
        id: undefined,
        unit: unit,
        amount: 0.0000,
        isSelected: true,
        amountUnit: undefined,
        cdaParkingId: []
      }
      this.subHeadWiseUnitList.push(entry);
    }
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
  }

  newFormGroup() {
    this.formdata = new FormGroup({
      finYear: new FormControl(),
      subHead: new FormControl(),
      majorHead: new FormControl(),
      minorHead: new FormControl(),
      allocationType: new FormControl(),
      fundAvailable: new FormControl(),
      currentAllocation: new FormControl(),
      balanceFund: new FormControl(),
      remarks: new FormControl('', Validators.required),
      amountType: new FormControl(),
    });
  }

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.budgetFinYears = result['response'];
          // this.formdata.patchValue({
          //   finYear: this.budgetFinYears[0],
          // });
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

  getSubHeadsData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadsData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.subHeads = result['response'];
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

  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitWithoutMOD).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allunits = result['response'];
          this.SpinnerService.hide();
          this.getNewEmptyEntries();
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
    this.apiService.getApi(this.cons.api.getAllocationTypeData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
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

  getAvailableFund(event: any) {
    //Step1:-> Selected Major Data and Minor Data automatically
    this.formdata.patchValue({
      majorHead: event.majorHead,
      minorHead: event.minorHead,
    });

    //Step2-> Get Allocation Fund By API by SubHead and Financial Year

    //Step3-> Get All Unit By SubHead Selected
    this.selectedunits = structuredClone(this.allunits);
  }

  moveDataToNextGrid(formDataValue: any) {
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    this.subHeadWiseUnitList.splice(0, 0, new SubHeadWiseUnitList());
  }

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 45 || charCode > 57)) {
      return false;
    }
    return true;
  }

  saveFirstForm(formDataValue: any) {
    debugger;
    if (
      formDataValue.finYear == null ||
      formDataValue.subHead == null ||
      formDataValue.allocationType == null
    ) {
      this.common.faliureAlert(
        'Please try again',
        'Please fill the required data.',
        ''
      );
      return;
    }

    for (let i = 0; i < this.subHeadWiseUnitList.length; i++) {
      this.amount = this.amount + this.subHeadWiseUnitList[i].amount;
    }
    this.formdata.patchValue({
      currentAllocation: this.amount,
    });

    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }

    let checkUserFilledAnyUnitData = this.subHeadWiseUnitList.filter(function (
      ele
    ) {
      return ele.amount == undefined;
    });

    if (checkUserFilledAnyUnitData.length == this.subHeadWiseUnitList.length) {
      this.common.faliureAlert('Please Fill atleast on unit data', '', '');
      return;
    }

    let checkUserFilledAnyUnitDataNotUndefinedAmount =
      this.subHeadWiseUnitList.filter(function (ele) {
        return ele.amount != undefined;
      });

    let checkUserFilledAnyUnitDataNotUndefinedUnit =
      checkUserFilledAnyUnitDataNotUndefinedAmount.filter(function (ele) {
        return ele.unit != undefined;
      });

    this.showData(
      checkUserFilledAnyUnitDataNotUndefinedUnit,
      this.formdata.value
    );
    // console.warn(this.formdata.value);
  }

  showData(selectedUnitDataWithAmount: any, formDataValue: any) {
    if(this.cdaDetail.length==1){
      for (var i = 0; i < selectedUnitDataWithAmount.length; i++) {
        let cdaParking=[{
          cdaParkingId:this.cdaDetail[0].cdaParkingId,
          cdaAmount:selectedUnitDataWithAmount[i].amount
        }]
        selectedUnitDataWithAmount[i].cdaParkingId=cdaParking;
      }
    }
    for (var i = 0; i < selectedUnitDataWithAmount.length; i++) {
      debugger;
      this.budgetAllocationArray.push({
        financialYear: formDataValue.finYear,
        unitName: selectedUnitDataWithAmount[i].unit,
        subHeadName: formDataValue.subHead,
        allocationType: formDataValue.allocationType,
        amount: selectedUnitDataWithAmount[i].amount,
        remarks: formDataValue.remarks,
        isChecked: false,
        amountType: formDataValue.amountType,
        cdaParkingId:selectedUnitDataWithAmount[i].cdaParkingId
      });
    }

    this.subHeadWiseUnitList = [];
    this.getNewEmptyEntries();
    // this.newFormGroup();
  }

  tableCheckBoxClicked(index: any) {
    this.budgetAllocationArray[index].isChecked =
      !this.budgetAllocationArray[index].isChecked;
  }

  deleteSubHeadWiseUnitList(index: any) {
    this.subHeadWiseUnitList.splice(index, 1);
  }

  uploadDocuments: any[] = [];
  unitForDocuments: any[] = [];
  // getUnitDatas() {
  //   this.SpinnerService.show();
  //   this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
  //     this.SpinnerService.hide();
  //     let result: { [key: string]: any } = res;
  //     this.unitForDocuments = result['response'];
  //   });
  // }
  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  uploadFileResponse: any;
  amountTypeas: any;
  getAmountType() {
    this.apiService.getApi(this.cons.api.showAllAmountUnit).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountTypeas = result['response'];
          this.amountUnit = this.amountTypeas[1];
          this.displayUnit=this.amountUnit.amountType;
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

  // uploadFile(index: any) {
  //   const formData = new FormData();
  //   formData.append('file', this.file);
  //
  //   this.SpinnerService.show();
  //
  //   this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
  //     next: (v: object) => {
  //       this.SpinnerService.hide();
  //       let result: { [key: string]: any } = v;
  //
  //       if (result['message'] == 'success') {
  //         // this.newSubcList = [];
  //         this.uploadFileResponse = '';
  //         // this.newSubcArr = [];
  //         this.uploadFileResponse = result['response'];
  //         console.log(
  //           'upload file data ======= ' +
  //             JSON.stringify(this.uploadFileResponse) +
  //             ' =submitJson'
  //         );
  //
  //         this.uploadDocuments[index].uploadDocId =
  //           this.uploadFileResponse.uploadDocId;
  //
  //         this.common.successAlert(
  //           'Success',
  //           result['response']['msg'],
  //           'success'
  //         );
  //       } else {
  //         this.common.faliureAlert('Please try later', result['message'], '');
  //       }
  //     },
  //     error: (e) => {
  //       this.SpinnerService.hide();
  //       console.error(e);
  //       this.common.faliureAlert('Error', e['error']['message'], 'error');
  //     },
  //     complete: () => console.info('complete'),
  //   });
  // }

  deleteFieldValue(index: any) {
    this.uploadDocuments.splice(index, 1);
  }

  addFieldValue() {
    this.uploadDocuments.push(new UploadDocuments());
  }

  delteFromTable() {
    var unitIndex = this.budgetAllocationArray.filter(
      (data) => data.isChecked == true
    );

    //step-2

    var demoNewBudgetAllocationArray = this.budgetAllocationArray;
    for (var j = demoNewBudgetAllocationArray.length - 1; j >= 0; j--) {
      if (this.budgetAllocationArray[j].isChecked) {
        this.budgetAllocationArray.splice(j, 1);
      }
    }
  }

  saveBudgetDataFn() {
    this.budgetAllocationArray;
    this.uploadDocuments;

    // let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];

    for (var i = 0; i < this.budgetAllocationArray.length; i++) {
      budgetRequest.push({
        budgetFinanciaYearId:
          this.budgetAllocationArray[i].financialYear.serialNo,
        toUnitId: this.budgetAllocationArray[i].unitName.unit,
        subHeadId: this.budgetAllocationArray[i].subHeadName.budgetCodeId,
        amount: this.budgetAllocationArray[i].amount,
        remark: this.budgetAllocationArray[i].remarks,
        allocationTypeId:
          this.budgetAllocationArray[i].allocationType.allocTypeId,
        amountTypeId: this.budgetAllocationArray[i].amountType.amountTypeId,
        cdaParkingId:this.budgetAllocationArray[i].cdaParkingId,
      });
    }

    // for (var i = 0; i < this.uploadDocuments.length; i++) {
    //   authRequestsList.push({
    //     authUnitId: this.uploadDocuments[i].authUnit.unit,
    //     authority: this.uploadDocuments[i].authority,
    //     authDate: this.uploadDocuments[i].authorityData,
    //     remark: this.uploadDocuments[i].remarks,
    //     authDocId: this.uploadDocuments[i].uploadDocId,
    //   });
    // }

    this.submitJson = {
      // authRequests: authRequestsList,
      budgetRequest: budgetRequest,
    };

    this.confirmModel(this.submitJson);
  }

  confirmModel(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(this.submitJson);
      }
    });
  }

  finallySubmit(data: any) {
    this.SpinnerService.show();
    // var newSubmitJson = this.submitJson;
    var newSubmitJson = data;
    console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');

    this.apiService
      .postApi(this.cons.api.saveBudgetAllocationSubHeadWise, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          // console.log(JSON.stringify(result) + " =submitJson");

          if (result['message'] == 'success') {
            // this.newSubcList = [];
            // this.newSubcArr = [];
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.updateInbox();
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

    // this.common.successAlert('Success', 'Finally submitted', 'success');
  }
  // private getDashboardData() {
  //   // this.SpinnerService.show();
  //   this.apiService.postApi(this.cons.api.getDashboardData, null).subscribe(
  //     (results) => {
  //       this.SpinnerService.hide();
  //       // this.dummydata();
  //       let result: { [key: string]: any } = results;
  //       if (result['message'] == 'success') {
  //         // this.userRole = result['response'].userDetails.role[0].roleName;
  //         this.formdata.patchValue({
  //           allocationType: result['response'].allocationType,
  //         });
  //
  //         this.sharedService.inbox = result['response'].inbox;
  //         this.sharedService.outbox = result['response'].outBox;
  //         this.sharedService.finYear=result['response'].budgetFinancialYear;
  //         if(this.sharedService.finYear!=undefined)
  //           this.formdata.get('finYear')?.setValue(this.sharedService.finYear);
  //
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  sharedDashboardData(){
    if(this.sharedService.dashboardData!=undefined)
    this.formdata.patchValue({
      allocationType: this.sharedService.dashboardData.allocationType,
    });

    if(this.sharedService.finYear!=undefined)
      this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

  }
  cdaDetail:any[]=[];
  getFundAvailableBuFinYearAndSubHeadAndAllocationType(
    data: any,
    subhead: any
  ) {
    debugger;
    this.formdata.patchValue({
      majorHead: subhead.majorHead,
      minorHead: subhead.minorHead,
    });

    if (data.allocationType == null || data.allocationType == undefined) {
      this.formdata.patchValue({
        fundAvailable: '',
      });
      return;
    }

    if (data.subHead == null || data.subHead == undefined) {
      this.common.warningAlert(
        'Warning',
        'Please Select Sub-Head first...!',
        'error'
      );
      return;
    }

    this.SpinnerService.show();
    // var newSubmitJson = this.submitJson;
    // var newSubmitJson = data;
    // console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');

    let submitJson = {
      finYearId: data.finYear.serialNo,
      subHeadId: data.subHead.budgetCodeId,
      allocationTypeId: data.allocationType.allocTypeId,
    };

    this.apiService
      .postApi(
        this.cons.api.getAvailableFundFindByUnitIdAndFinYearId,
        submitJson
      )
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.subHeadData=result['response'];
            this.fundAvailableByFinYearAndUnitAndAllocationType = parseFloat(
              result['response'].fundAvailable
            );
            this.cdaDetail=result['response'].cdaParkingTrans;
            for(let cda of this.cdaDetail){
              cda.totalParkingAmount=parseFloat(cda.totalParkingAmount)*parseFloat(cda.amountType.amount)/parseFloat(this.amountUnit.amount)
              cda.remainingCdaAmount=parseFloat(cda.remainingCdaAmount)*parseFloat(cda.amountType.amount)/parseFloat(this.amountUnit.amount)
            }
            this.formdata.patchValue({
              fundAvailable: parseFloat(result['response'].fundAvailable),
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

  allocatedTotalAmount: number = 0;

  allocatedAmount(index: any) {
    if (this.formdata.get('amountType')?.value == undefined) {
      Swal.fire('Please fill Rupees in');
      this.subHeadWiseUnitList[index].amount = undefined;
      return;
    }
    this.subHeadWiseUnitList[index].amount = Number(
      this.subHeadWiseUnitList[index].amount
    ).toFixed(4);
    this.subHeadWiseUnitList[index].amountUnit =
      this.formdata.get('amountType')?.value;
    // this.subHeadWiseUnitList;
    // let amount = 0;
    // for (var i = 0; i < this.subHeadWiseUnitList.length; i++) {
    //   amount = amount + this.subHeadWiseUnitList[i].amount;
    // }
    // this.formdata.patchValue({
    //   currentAllocation: amount,
    // });
    // this.getTotalAmount();
  }
  amountUnit: any;
  displayUnit:string|undefined;
  isAllChecked: boolean=false;
  setAmountUnit() {

    this.amountUnit = this.formdata.get('amountType')?.value;
    if(this.amountUnit!=undefined){
      this.displayUnit=this.amountUnit.amountType;
    }
    else{
      return;
    }
    for (let i = 0; i < this.subHeadWiseUnitList.length; i++) {
      if (this.subHeadWiseUnitList[i].amount != undefined) {
        this.subHeadWiseUnitList[i].amount = (
          (this.subHeadWiseUnitList[i].amount *
            this.subHeadWiseUnitList[i].amountUnit.amount) /
          this.formdata.get('amountType')?.value.amount
        ).toFixed(4);
        this.subHeadWiseUnitList[i].amountUnit = this.amountUnit =
          this.formdata.get('amountType')?.value;
      }
      this.budgetAllocationArray;
    }
    for (let i = 0; i < this.budgetAllocationArray.length; i++) {
      // if (this.subHeadWiseUnitList[i].amount != undefined) {
      this.budgetAllocationArray[i].amount = (
        (this.budgetAllocationArray[i].amount *
          this.budgetAllocationArray[i].amountType.amount) /
        this.formdata.get('amountType')?.value.amount
      ).toFixed(4);
      this.budgetAllocationArray[i].amountType = this.amountUnit =
        this.formdata.get('amountType')?.value;
      // }
    }
  }
  updateInbox() {
    this.apiService.getApi(this.cons.api.updateInboxOutBox).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
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

  tableAllCheckBoxClicked() {
    // this.isAllChecked=!this.isAllChecked;
    for(let i=0;i<this.budgetAllocationArray.length;i++){
      this.budgetAllocationArray[i].isChecked=this.isAllChecked;
    }
  }

  cdaWithdrawl() {
    if(!this.amountEqual){
      this.common.warningAlert('Cda total not equal to amount allocated','Cda total not equal to amount allocated','');
      return;
    }
    //add cda data to unit data
    let cdaParkingId=[];
    for(let i=0;i<this.cdaDetail.length;i++){
      if(this.cdaDetail[i].amount!=undefined){
        cdaParkingId.push({
          cdaParkingId:this.cdaDetail[i].cdaParkingId,
          cdaAmount:this.cdaDetail[i].amount
        });
      }
    }
    this.subHeadWiseUnitList[this.currentIndex].cdaParkingId=cdaParkingId;
    this.cdaDetail=this.subHeadData.cdaParkingTrans;
    for(let cda of this.cdaDetail){
      cda.totalParkingAmount=parseFloat(cda.totalParkingAmount)*parseFloat(cda.amountType.amount)/parseFloat(this.amountUnit.amount)
      cda.remainingCdaAmount=parseFloat(cda.remainingCdaAmount)*parseFloat(cda.amountType.amount)/parseFloat(this.amountUnit.amount)
    }
    debugger;
  }
currentIndex:any;
  addCda(subHeadWiseUnit: any, i: number) {
    this.currentIndex=i;
  }
  amountEqual:boolean=false;
  calcCdaTotal() {
    this.amountEqual=false;
    let sum=0.0;
    for(let cda of this.cdaDetail){
      if(cda.amount!=undefined)
        sum=sum+parseFloat(cda.amount);
    debugger;
    }
    if(sum==parseFloat(this.subHeadWiseUnitList[this.currentIndex].amount))
      this.amountEqual=true;
  }
}
