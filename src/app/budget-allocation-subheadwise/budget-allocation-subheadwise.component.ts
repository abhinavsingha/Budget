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
  });

  ngOnInit(): void {
    this.getBudgetFinYear();
    this.getSubHeadsData();
    this.getCgUnitData();
    this.getAllocationTypeData();
    this.getNewEmptyEntries();
    this.getUnitDatas();
    this.uploadDocuments.push(new UploadDocuments());
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
    this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
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
    });
  }

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        this.formdata.patchValue({
          finYear: this.budgetFinYears[0],
        });
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

  getCgUnitData() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
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
      if (this.subHeadWiseUnitList[i].amountUnit != undefined)
        this.subHeadWiseUnitList[i].amount =
          this.subHeadWiseUnitList[i].amount *
          this.subHeadWiseUnitList[i].amountUnit.amount;
    }
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }

    // if (this.subHeadWiseUnitList[0].amount == undefined) {
    //   console.warn('===if===');
    // } else if (this.subHeadWiseUnitList[0].amount == 0) {
    //   console.warn('===if else===');
    // } else {
    //   console.warn('===else===');
    // }

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
    for (var i = 0; i < selectedUnitDataWithAmount.length; i++) {
      this.budgetAllocationArray.push({
        financialYear: formDataValue.finYear,
        unitName: selectedUnitDataWithAmount[i].unit,
        subHeadName: formDataValue.subHead,
        allocationType: formDataValue.allocationType,
        amount: selectedUnitDataWithAmount[i].amount,
        remarks: formDataValue.remarks,
        isChecked: false,
      });
    }

    this.subHeadWiseUnitList = [];
    this.formdata.reset();
    this.getNewEmptyEntries();
    this.newFormGroup();
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
  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.unitForDocuments = result['response'];
    });
  }
  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  uploadFileResponse: any;
  amountUnit = [
    {
      unit: 'Crore',
      amount: 10000000,
    },
    {
      unit: 'Lakh',
      amount: 100000,
    },
    {
      unit: 'Thousand',
      amount: 1000,
    },
    {
      unit: 'Hundred',
      amount: 100,
    },
  ];
  uploadFile(index: any) {
    const formData = new FormData();
    formData.append('file', this.file);

    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          // this.newSubcList = [];
          this.uploadFileResponse = '';
          // this.newSubcArr = [];
          this.uploadFileResponse = result['response'];
          console.log(
            'upload file data ======= ' +
              JSON.stringify(this.uploadFileResponse) +
              ' =submitJson'
          );

          this.uploadDocuments[index].uploadDocId =
            this.uploadFileResponse.uploadDocId;

          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
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
      complete: () => console.info('complete'),
    });
  }

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
        allocationTypeId: 'ALL_101',
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
      .postApi(this.cons.api.saveBudgetAllocationUnitWise, newSubmitJson)
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
            this.getDashboardData();
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
  private getDashboardData() {
    // this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.getDashboardData, null).subscribe(
      (results) => {
        this.SpinnerService.hide();
        $.getScript('assets/js/adminlte.js');

        // this.dummydata();
        let result: { [key: string]: any } = results;
        if (result['message'] == 'success') {
          // this.userRole = result['response'].userDetails.role[0].roleName;
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

  getFundAvailableBuFinYearAndSubHeadAndAllocationType(data: any) {
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

    debugger;
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
            this.fundAvailableByFinYearAndUnitAndAllocationType =
              result['response'].fundAvailable;

            this.formdata.patchValue({
              fundAvailable: result['response'].fundAvailable,
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
    this.allocatedTotalAmount =
      this.allocatedTotalAmount + this.subHeadWiseUnitList[index].amount;

    this.formdata.patchValue({
      currentAllocation: this.allocatedTotalAmount,
    });
    debugger;
    // this.getTotalAmount();
  }
}
