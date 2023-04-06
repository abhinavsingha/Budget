// import { Component } from '@angular/core';
import { Component } from '@angular/core';
import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';

@Injectable()
@Component({
  selector: 'app-budget-update',
  templateUrl: './budget-update.component.html',
  styleUrls: ['./budget-update.component.scss'],
})
export class BudgetUpdateComponent {
  budgetFinYears: any[] = [];

  allCBUnits: any[] = [];

  budgetListData: any[] = [];

  p: number = 1;

  formdata = new FormGroup({
    finYear: new FormControl(),
    toUnit: new FormControl(),
  });

  updateBudgetFormData = new FormGroup({
    transactionId: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    minorHead: new FormControl(),
    fundAvailable: new FormControl(),
    preAllocation: new FormControl(),
    allocationType: new FormControl(),
    revisedAmount: new FormControl(),
    balanceFund: new FormControl(),
  });

  ngOnInit(): void {
    this.getBudgetFinYear();
    this.getCgUnitData();
    $.getScript('assets/main.js');
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

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

  getCgUnitData() {
    this.SpinnerService.show();
    debugger;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allCBUnits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  searchData(formData: any) {
    this.SpinnerService.show();

    let submitJson = {
      budgetFinancialYearId: formData.finYear.serialNo,
      toUnitId: formData.toUnit.cbUnit,
      subHead: null,
    };

    this.apiService
      .postApi(this.cons.api.budgetAllocationReport, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.budgetListData = result['response'];
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

  deleteSelectedBudget(index: any, unitId: any, transactionId: any) {
    this.budgetListData.splice(index, 1);

    let submitJson = {
      unitId: unitId,
      transactionId: transactionId,
    };

    this.confirmModel(submitJson);
  }

  confirmModel(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(data);
      }
    });
  }

  finallySubmit(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = data;
    debugger;
    this.apiService
      .postApi(this.cons.api.updateBudgetAllocation, newSubmitJson)
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
            this.budgetListData[this.mainIndexValue].allocationAmount =
              this.changeRevisedAmount;
            this.updateBudgetFormData.reset();
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

  mainIndexValue: any;

  updateBudget(indexValue: any, budgetData: any) {
    this.mainIndexValue = indexValue;
    this.updateBudgetFormData.patchValue({
      transactionId: budgetData.transactionId,
      majorHead: budgetData.subHead.majorHead,
      subHead: budgetData.subHead.subHeadDescr,
      minorHead: budgetData.subHead.minorHead,
      fundAvailable: 0.0,
      preAllocation: 0.0,
      allocationType: budgetData.allocTypeId.allocDesc,
      revisedAmount: budgetData.allocationAmount,
      balanceFund: 0.0,
    });
  }

  changeRevisedAmount: any;

  updateBudgetAllocationFund(updateBudgetFormDataValue: any) {
    // this.budgetListData.splice(index, 1);

    this.changeRevisedAmount = updateBudgetFormDataValue.revisedAmount;

    let submitJson = {
      transactionId: updateBudgetFormDataValue.transactionId,
      amount: updateBudgetFormDataValue.revisedAmount,
    };

    this.confirmModel(submitJson);
  }
}
