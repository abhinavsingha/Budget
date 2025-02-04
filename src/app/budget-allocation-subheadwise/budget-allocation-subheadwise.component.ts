import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {ConstantsService} from '../services/constants/constants.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommonService} from '../services/common/common.service';
import {ApiCallingServiceService} from '../services/api-calling/api-calling-service.service';
import {SubHeadWiseUnitList} from '../model/sub-head-wise-unit-list';
import {UploadDocuments} from '../model/upload-documents';
import Swal from 'sweetalert2';

import {FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {SharedService} from '../services/shared/shared.service';

@Component({
  selector: 'app-budget-allocation-subheadwise',
  templateUrl: './budget-allocation-subheadwise.component.html',
  styleUrls: ['./budget-allocation-subheadwise.component.scss'],
})
export class BudgetAllocationSubheadwiseComponent implements OnInit {
  budgetFinYears: any[] = [];
  subHeads: any[] = [];
  allunits: any[] = [];
  selectedunits: any[] = [];
  subHeadWiseUnitList: any[] = [];
  allocationType: any[] = [];
  filteredUnits: any[] = [];
  uploadDocuments: any[] = [];
  file: any;
  amountTypeas: any;

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
  cdalist: any[] = [];
  cdaDetail: any[] = [];
  allocatedTotalAmount: number = 0;
  amountUnit: any;
  displayUnit: string | undefined;
  isAllChecked: boolean = false;
  currentIndex: any;
  amountEqual: boolean = false;
  totalAlloc: any = 0.0;
  balance: any = 0.0;
  protected readonly localStorage = localStorage;
  private subHeadData: any;

  constructor(
    public sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {
  }

  ngOnInit(): void {
    this.filteredUnits = this.subHeadWiseUnitList;  // Initially display all units
    this.sharedService.updateInbox();
    this.getAmountType();
    this.getDashBoardDta();
    // this.getBudgetFinYear();
    debugger;
    if (!this.sharedService.reject) {
      this.getSubHeadsData();
      this.getCgUnitData();
    } else {
      debugger;
      this.subHeads.push(this.sharedService.allocationData[0].subHead);
      this.formdata.get('subHead')?.setValue(this.subHeads[0]);
      // debugger;
      for (let li of this.sharedService.allocationData) {
        this.allunits.push(li.toUnit);
      }
    }

    this.updateInbox();
    this.uploadDocuments.push(new UploadDocuments());
    this.sharedDashboardData();
    $.getScript('assets/main.js');
  }

  getNewEmptyEntries() {
    let count = 0;
    for (let unit of this.allunits) {
      let entry: SubHeadWiseUnitList;
      if (this.sharedService.reject) {
        entry = {
          id: undefined,
          unit: unit,
          amount: Number(parseFloat(this.sharedService.allocationData[count].allocationAmount) * parseFloat(this.sharedService.allocationData[count].amountUnit.amount) / parseFloat(this.amountUnit.amount)).toFixed(4),
          isSelected: true,
          amountUnit: this.amountUnit,
          cdaParkingId: []
        }
      } else {
        entry = {
          id: undefined,
          unit: unit,
          amount: 0.0000,
          isSelected: true,
          amountUnit: undefined,
          cdaParkingId: []
        }
      }

      this.subHeadWiseUnitList.push(entry);
      count++;
    }
    this.calcTotal();

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

  async getBudgetFinYear() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getBudgetFinYear)).subscribe({
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

  async getSubHeadsData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getSubHeadsData)).subscribe({
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

  async getCgUnitData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getCgUnitWithoutMOD)).subscribe({
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

  async getAllocationTypeData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getAllocationTypeData)).subscribe({
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

  saveFirstForm(formDataValue: any) {
    debugger;
    if (this.budgetAllocationArray.length > 0) {

      this.common.faliureAlert(
        'Please Delete All Items from list below',
        'Please Delete All Items from added list before saving and try again.',
        ''
      );
      return;
    }
    this.budgetAllocationArray = [];
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
    } else if (this.balance < 0) {
      this.common.faliureAlert(
        'Allocation Exceeds available balance',
        'Fund available cannot be less than zero. Allocation total more than available fund.',
        ''
      );
      return;
    }

    for (let i = 0; i < this.subHeadWiseUnitList.length; i++) {
      this.amount = this.amount + parseFloat(this.subHeadWiseUnitList[i].amount);
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
      this.common.faliureAlert('Please Fill atleast one unit data', '', '');
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
    this.calcTotal();
  }

  showData(selectedUnitDataWithAmount: any, formDataValue: any) {
    if (this.cdaDetail.length == 1) {
      for (var i = 0; i < selectedUnitDataWithAmount.length; i++) {
        let cdaParking = [{
          cdaParkingId: this.cdaDetail[0].cdaParkingId,
          cdaAmount: parseFloat(selectedUnitDataWithAmount[i].amount).toFixed(4)
        }]
        selectedUnitDataWithAmount[i].cdaParkingId = cdaParking;
      }
    }
    for (var i = 0; i < selectedUnitDataWithAmount.length; i++) {
      // //debugger;
      let sum = 0.0;
      for (let cda of selectedUnitDataWithAmount[i].cdaParkingId) {
        if (cda.cdaAmount != undefined) {
          sum = sum + parseFloat(cda.cdaAmount);
        }
      }
      if (sum != selectedUnitDataWithAmount[i].amount) {
        this.common.faliureAlert('CDA amount mismatch', 'CDA amount does not mactch allocated amount', '');
        this.budgetAllocationArray = [];
        return;
      }
      this.budgetAllocationArray.push({
        financialYear: formDataValue.finYear,
        unitName: selectedUnitDataWithAmount[i].unit,
        subHeadName: formDataValue.subHead,
        allocationType: formDataValue.allocationType,
        amount: selectedUnitDataWithAmount[i].amount,
        remarks: formDataValue.remarks,
        isChecked: false,
        amountType: formDataValue.amountType,
        cdaParkingId: selectedUnitDataWithAmount[i].cdaParkingId
      });
    }

    this.subHeadWiseUnitList = [];
    this.getNewEmptyEntries();
  }

  tableCheckBoxClicked(index: any) {
    this.budgetAllocationArray[index].isChecked =
      !this.budgetAllocationArray[index].isChecked;
  }

  async getAmountType() {
    (await this.apiService.getApi(this.cons.api.showAllAmountUnit)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountTypeas = result['response'];
          this.amountUnit = this.amountTypeas[1];
          this.displayUnit = this.amountUnit.amountType;
          if (this.sharedService.reject)
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

  delteFromTable() {
    var unitIndex = this.budgetAllocationArray.filter(
      (data) => data.isChecked == true
    );

    var demoNewBudgetAllocationArray = this.budgetAllocationArray;
    for (var j = demoNewBudgetAllocationArray.length - 1; j >= 0; j--) {
      if (this.budgetAllocationArray[j].isChecked) {
        this.budgetAllocationArray.splice(j, 1);
      }
    }
    this.calcTotal();
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
        cdaParkingId: this.budgetAllocationArray[i].cdaParkingId,
      });
    }
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

  async finallySubmit(data: any) {
    this.SpinnerService.show();
    // var newSubmitJson = this.submitJson;
    var newSubmitJson = data;
    // console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');
    let url = this.cons.api.saveBudgetAllocationSubHeadWise;
    if (this.sharedService.reject)
      url = this.cons.api.saveBudgetAllocationSubHeadWiseEdit;
    (await this.apiService
      .postApi(url, newSubmitJson))
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
            this.sharedService.reject = false;
            this.sharedService.allocationData = [];
            this.sharedService.msgId = undefined;
            this.updateInbox();
            this.budgetAllocationArray = [];
            const delayMilliseconds = 3000;

            setTimeout(() => {
              // Reload the page
              window.location.reload();
            }, delayMilliseconds);
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.log('Complete'),
      });

    // this.common.successAlert('Success', 'Finally submitted', 'success');
  }

  sharedDashboardData() {
    if (this.sharedService.dashboardData != undefined)
      this.formdata.patchValue({
        allocationType: this.sharedService.dashboardData.allocationType,
      });
    debugger;
    if (this.sharedService.dashboardData != undefined)
      this.formdata.get('allocationType')?.setValue(this.sharedService.dashboardData.allocationType);
    if (this.sharedService.finYear != undefined)
      this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

    if (this.sharedService.reject) {
      this.getFundAvailableBuFinYearAndSubHeadAndAllocationType(this.formdata.value, this.subHeads[0]);
    }
  }

  async getFundAvailableBuFinYearAndSubHeadAndAllocationType(
    data: any,
    subhead: any
  ) {
    debugger;
    this.formdata.patchValue({
      majorHead: subhead.majorHead,
      minorHead: subhead.minorHead,
    });
    debugger;
    if (data.allocationType == null || data.allocationType == undefined) {
      this.formdata.patchValue({
        fundAvailable: '',
      });
      return;
    }
    debugger;
    if (data.subHead == null || data.subHead == undefined) {
      this.common.warningAlert(
        'Warning',
        'Please Select Sub-Head first...!',
        'error'
      );
      return;
    }
    debugger;
    this.SpinnerService.show();
    // var newSubmitJson = this.submitJson;
    // var newSubmitJson = data;
    // console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');

    let submitJson = {
      finYearId: data.finYear.serialNo,
      subHeadId: data.subHead.budgetCodeId,
      allocationTypeId: data.allocationType.allocTypeId,
    };

    (await this.apiService
      .postApi(
        this.cons.api.getAvailableFundFindByUnitIdAndFinYearId,
        submitJson
      ))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.subHeadData = result['response'];
            this.fundAvailableByFinYearAndUnitAndAllocationType = parseFloat(result['response'].fundAvailable);
            this.balance = parseFloat(result['response'].fundAvailable).toFixed(4);
            this.cdaDetail = result['response'].cdaParkingTrans;
            for (let cda of this.cdaDetail) {
              cda.totalParkingAmount = (parseFloat(cda.totalParkingAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.amountUnit.amount)).toFixed(4);
              cda.remainingCdaAmount = (parseFloat(cda.remainingCdaAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.amountUnit.amount)).toFixed(4);
              cda.amountType = this.amountUnit;
              this.cdalist.push({sum: 0});
            }
            this.formdata.patchValue({
              fundAvailable: parseFloat(result['response'].fundAvailable).toFixed(4),
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
    this.calcTotal();
  }

  setAmountUnit() {

    this.amountUnit = this.formdata.get('amountType')?.value;
    if (this.amountUnit != undefined) {
      this.displayUnit = this.amountUnit.amountType;
    } else {
      return;
    }
    for (let cda of this.cdaDetail) {
      cda.totalParkingAmount = (parseFloat(cda.totalParkingAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.formdata.get('amountType')?.value.amount)).toFixed(4);
      cda.remainingCdaAmount = (parseFloat(cda.remainingCdaAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.formdata.get('amountType')?.value.amount)).toFixed(4);
      cda.amountType = this.formdata.get('amountType')?.value;
    }
    for (let i = 0; i < this.subHeadWiseUnitList.length; i++) {
      if (this.subHeadWiseUnitList[i].amountUnit != undefined && this.subHeadWiseUnitList[i].amount != undefined) {
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
    this.calcTotal();
  }

  async updateInbox() {
    (await this.apiService.getApi(this.cons.api.updateInboxOutBox)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.approve = result['response'].approved;
          this.sharedService.archive = result['response'].archived;
          this.formdata.patchValue({
            allocationType: result['response'].allocationType,
          });
          this.formdata.get('finYear')?.setValue(result['response'].budgetFinancialYear);

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
    for (let i = 0; i < this.budgetAllocationArray.length; i++) {
      this.budgetAllocationArray[i].isChecked = this.isAllChecked;
    }
  }

  cdaWithdrawl() {
    if (!this.amountEqual) {
      this.common.warningAlert('CDA total not equal to amount allocated', 'Cda total not equal to amount allocated', '');
      return;
    }
    //add cda data to unit data
    let cdaParkingId = [];
    for (let i = 0; i < this.cdaDetail.length; i++) {
      if (this.cdaDetail[i].amount != undefined) {
        cdaParkingId.push({
          cdaParkingId: this.cdaDetail[i].cdaParkingId,
          cdaAmount: parseFloat(this.cdaDetail[i].amount).toFixed(4)
        });
        // debugger;


        // this.cdaDetail[i].remainingCdaAmount=(parseFloat(this.cdaDetail[i].remainingCdaAmount)-parseFloat(this.cdaDetail[i].amount)).toFixed(4);
        this.cdaDetail[i].amount = undefined;
      }
    }
    this.subHeadWiseUnitList[this.currentIndex].cdaParkingId = cdaParkingId;
    for (let entry of this.subHeadWiseUnitList) {
      if (entry.cdaParkingId != undefined) {
        for (let i = 0; i < entry.cdaParkingId.length; i++) {
          this.cdalist[i].sum = 0;
        }
      }
    }
    for (let entry of this.subHeadWiseUnitList) {
      if (entry.cdaParkingId != undefined) {
        for (let i = 0; i < entry.cdaParkingId.length; i++) {
          this.cdalist[i].sum = parseFloat(entry.cdaParkingId[i].cdaAmount) + this.cdalist[i].sum;
        }
      }
    }
    debugger;

    this.cdaDetail = this.subHeadData.cdaParkingTrans;
    for (let cda of this.cdaDetail) {
      cda.totalParkingAmount = (parseFloat(cda.totalParkingAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.amountUnit.amount)).toFixed(4)
      cda.remainingCdaAmount = (parseFloat(cda.remainingCdaAmount) * parseFloat(cda.amountType.amount) / parseFloat(this.amountUnit.amount)).toFixed(4)
    }
    this.updateRemainingCda();
  }

  addCda(subHeadWiseUnit: any, i: number) {
    this.currentIndex = i;
    console.log(this.subHeadWiseUnitList[i].cdaParkingId);
    if (this.subHeadWiseUnitList[i].cdaParkingId.length != 0) {
      for (let cda of this.cdaDetail) {
        for (let cda2 of this.subHeadWiseUnitList[i].cdaParkingId) {
          if (cda2.cdaParkingId == cda.cdaParkingId)
            cda.amount = parseFloat(cda2.cdaAmount).toFixed(4);
        }
      }
    } else {
      for (let cda of this.cdaDetail) {
        cda.amount = 0;
      }
    }
  }

  calcCdaTotal() {
    this.amountEqual = false;
    let sum = 0.0;
    for (let cda of this.cdaDetail) {
      if (cda.amount != undefined)
        sum = sum + parseFloat(cda.amount);
      else {
        cda.amount = 0;
      }
      //debugger;
    }
    if (sum == parseFloat(this.subHeadWiseUnitList[this.currentIndex].amount))
      this.amountEqual = true;
    this.cdaWithdrawl();
  }

  calcTotal() {
    debugger;
    this.totalAlloc = 0.0;
    for (let entry of this.subHeadWiseUnitList) {
      this.totalAlloc = (parseFloat(entry.amount) + parseFloat(this.totalAlloc)).toFixed(4);
    }
    if (this.fundAvailableByFinYearAndUnitAndAllocationType != undefined)
      this.balance = (parseFloat(this.fundAvailableByFinYearAndUnitAndAllocationType) - (parseFloat(this.totalAlloc) * parseFloat(this.formdata.get('amountType')?.value.amount))).toFixed(4);
    debugger;
  }

  addDecimal(cda: any, i: number) {
    cda.amount = cda.amount.toFixed(4);
    if (cda.amount > (Number((cda.remainingCdaAmount - this.cdalist[i].sum).toFixed(4)))) {
      console.log(Number((cda.remainingCdaAmount - this.cdalist[i].sum).toFixed(4)));
      this.common.warningAlert('Cannot withdraw more than balance', 'Amount Greater than CDA Amount', '');
      cda.amount = (0.0).toFixed(4);
    }

    // for(let entry of this.subHeadWiseUnitList){
    //   debugger;
    //   if(entry.cdaParkingId!=undefined){
    //     for(let i=0;i<entry.cdaParkingId.length;i++){
    //       this.cdalist[i].sum=parseFloat(entry.cdaParkingId[i].cdaAmount)+this.cdalist[i].sum;
    //     }
    //   }
    // }
  }

  updateRemainingCda() {
    debugger;
  }

  updateBudgetDataFn() {
    this.budgetAllocationArray;
    this.uploadDocuments;

    // let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];
    debugger;
    for (var i = 0; i < this.budgetAllocationArray.length; i++) {
      budgetRequest.push({
        transactionId: this.sharedService.allocationData[i].transactionId,
        budgetFinanciaYearId:
        this.budgetAllocationArray[i].financialYear.serialNo,
        toUnitId: this.budgetAllocationArray[i].unitName.unit,
        subHeadId: this.budgetAllocationArray[i].subHeadName.budgetCodeId,
        amount: this.budgetAllocationArray[i].amount,
        remark: this.budgetAllocationArray[i].remarks,
        allocationTypeId:
        this.budgetAllocationArray[i].allocationType.allocTypeId,
        amountTypeId: this.budgetAllocationArray[i].amountType.amountTypeId,
        cdaParkingId: this.budgetAllocationArray[i].cdaParkingId,
      });
    }
    this.submitJson = {
      // authRequests: authRequestsList,
      msgId: this.sharedService.msgId,
      budgetRequest: budgetRequest,
    };

    this.confirmModel(this.submitJson);

  }


  async getDashBoardDta() {
    this.SpinnerService.show();

    (await this.apiService.postApi(this.cons.api.getDashBoardDta, null)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.sharedService.dashboardData = result['response'];
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          this.sharedDashboardData();
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

  // Method to filter units based on search input as directed by user(shriom sir)
  filterUnits(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      this.filteredUnits = this.subHeadWiseUnitList.filter(unit =>
        unit.unit.descr.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUnits = this.subHeadWiseUnitList;  // Show all units if no search term
    }

  }
}
