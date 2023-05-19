import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { KeycloakService } from 'keycloak-angular';
import { UploadDocuments } from '../model/upload-documents';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-budget-allocation',
  templateUrl: './budget-allocation.component.html',
  styleUrls: ['./budget-allocation.component.scss'],
})
export class BudgetAllocationComponent implements OnInit {
  budgetFinYearsNew: any[] = [];
  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.budgetFinYearsNew = result['response'];
          this.formdata.patchValue({
            // finYearId: this.budgetFinYearsNew[0],
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

  allunitsNew: any[] = [];
  getCgUnitDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allunitsNew = result['response'];
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

  allocationType: any[] = [];
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

  subHeadType: any[] = [];
  amountUnits: any;
  getSubHeadType() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadType).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.SpinnerService.hide();
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

  majorDataNew: any[] = [];
  getMajorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.majorDataNew = result['response'].subHead;
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

  unitForDocuments: any[] = [];
  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.unitForDocuments = result['response'];
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

  deleteDataByPid() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.deleteDataByPid).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
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

  amountType: any;
  getAmountType() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.showAllAmountUnit).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountType = result['response'];
          this.amountUnits = this.amountType[0];
          this.amountUnit = this.amountUnits.amountType;
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

  // getDashboardData() {
  //   this.SpinnerService.show();
  //   this.apiService.postApi(this.cons.api.getDashboardData, null).subscribe(
  //     (results) => {
  //       this.SpinnerService.hide();
  //       let result: { [key: string]: any } = results;
  //       if (result['message'] == 'success') {
  //         this.formdata.patchValue({
  //           allocationType: result['response'].allocationType,
  //         });
  //         this.sharedService.finYear=result['response'].budgetFinancialYear;
  //         if(this.sharedService.finYear!=undefined)
  //           this.formdata.get('finYearId')?.setValue(this.sharedService.finYear);
  //
  //         this.sharedService.inbox = result['response'].inbox;
  //         this.sharedService.outbox = result['response'].outBox;
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  sharedDashboardData(){
    if(this.sharedService.dashboardData!=undefined){
      this.formdata.patchValue({

        allocationType: this.sharedService.dashboardData.allocationType,
      });
    }
    if(this.sharedService.finYear!=undefined)
      this.formdata.get('finYearId')?.setValue(this.sharedService.finYear);
    }

  ngOnInit(): void {
    this.getBudgetFinYear();
    this.getCgUnitDataNew();
    this.getMajorDataNew();
    this.getUnitDatas();
    // this.getAllocationTypeData();
    this.deleteDataByPid();
    this.getAmountType();
    this.sharedDashboardData();
    this.getSubHeadType();

    $.getScript('assets/js/adminlte.js');
    $.getScript('assets/main.js');
  }

  budgetFinYears: any[] = [];
  subHeads: any[] = [];
  cgUnits: any[] = [];
  budgetTypes: any[] = [];
  allocationTypes: any[] = [];
  allocationAuthorityUnits: any[] = [];
  authorityTypes: any[] = [];
  majorHead: any[] = [];
  minorHead: any[] = [];
  fundAvailable: any = 0;
  previousAllocation: any = 0;

  uploadFileResponse: any;

  p: number = 1;
  length: number = 0;

  balanceFund: any;

  //for the new table entries
  newBudgetAllocationList: any[] = [];
  saveBudgetDataList: any[] = [];
  newBudgetDataSaveList: any[] = [];

  newBudgetAllocationArray: any[] = [];

  submitJson: any;

  subHeadFirst: any[] = [];
  subHeadSecond: any[] = [];

  demoSubHeads: any[] = [];

  items!: FormArray;
  formdata = new FormGroup({
    finYearName: new FormControl(), //
    subHead: new FormControl(), //
    unit: new FormControl(), //
    prevAllocation: new FormControl(this.previousAllocation),
    amount: new FormControl(),
    remarks: new FormControl(),
    budgetType: new FormControl(), //
    allocationType: new FormControl(), //
    isChecked: new FormControl(false), //
    subHeadValue: new FormControl(), //
    subHeadAmount: new FormControl(), //
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    finYearId: new FormControl(),
    majorHeadId: new FormControl(),
    unitId: new FormControl(),
    minorHeadId: new FormControl(),
    amountType: new FormControl(),
    subHeadType: new FormControl(),
  });

  subHeadTableData = new FormGroup({
    isChecked: new FormControl(false), //
    subHeadValue: new FormControl(), //
    subHeadAmount: new FormControl(), //
  });

  saveBudgetData = new FormGroup({
    allocationAuthorityUnits: new FormControl(),
    authorityTypes: new FormControl(),
    authorityName: new FormControl(),
    budgetDate: new FormControl(),
  });

  // for the subheads selected values
  selectedValueOfSubheadsData: any;
  selectedValueOfSubheadsDatas: any[] = [];

  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private keycloakService: KeycloakService
  ) {}

  token: any;

  arrayWithUnitMajorHeadAndSubHead: any[] = [];
  putInNewList() {
    const unitDatas = this.cgUnits;
    const majorHeadDatas = this.majorHead;
    const subHeadDatasByFirstMajorHead = this.subHeadFirst;
    const subHeadDatasBySecondMajorHead = this.subHeadSecond;

    //put the extra key in

    const majorHeadWithSubHeads = [];

    for (var i = 0; i < majorHeadDatas.length; i++) {
      if (majorHeadDatas[i].majorHead == 2037) {
        majorHeadWithSubHeads.push({
          majorHead: majorHeadDatas[i],
          subHeads: subHeadDatasBySecondMajorHead,
        });
      } else {
        majorHeadWithSubHeads.push({
          majorHead: majorHeadDatas[i],
          subHeads: subHeadDatasByFirstMajorHead,
        });
      }
    }

    for (var i = 0; i < this.cgUnits.length; i++) {
      this.arrayWithUnitMajorHeadAndSubHead.push({
        descr: this.cgUnits[i].descr,
        units: this.cgUnits[i],
        majorHeads: majorHeadWithSubHeads,
      });
    }

    console.log(
      'New Major Heads ............' + JSON.stringify(majorHeadWithSubHeads)
    );
  }
  majorHeadBySelectingUnit: any[] = [];

  selectedUnit() {
    this.formdata.controls['majorHead'].setValue('');
    this.formdata.controls['amount'].setValue(null);
    this.subHeadBySelectingMajorHead = [];
    const fasd = this.formdata.value.unit;
    var unitIndex = this.arrayWithUnitMajorHeadAndSubHead.findIndex(
      (a: { units: any }) => a.units.unit == fasd
    );

    if (unitIndex > -1) {
      const asdasd = this.arrayWithUnitMajorHeadAndSubHead[unitIndex];
      console.log('Asdasd == ' + asdasd);
      this.majorHeadBySelectingUnit = asdasd.majorHeads;
    }
  }

  subHeadBySelectingMajorHead: any[] = [];

  selectedMajorHead() {
    const fasd = this.formdata.value.majorHead;
    var majorHeadIndex = this.majorHeadBySelectingUnit.findIndex(
      (a: { majorHead: any }) => a.majorHead.majorHead == fasd
    );

    if (majorHeadIndex > -1) {
      const asdasd = this.majorHeadBySelectingUnit[majorHeadIndex];
      console.log('Asdasd == ' + asdasd);
      this.subHeadBySelectingMajorHead = asdasd.subHeads;
    }
  }

  getFinancialYear() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      this.SpinnerService.hide();

      let result: { [key: string]: any } = res;
      this.budgetFinYears = result['response'];
    });
  }

  getAvailableFund(cgUnit: any) {
    // Only for demo

    // Only for demo
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getAvailableFund + '/' + cgUnit.unit)
      .subscribe((res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;

        this.fundAvailable = result['response'].fundAvailable;
        this.previousAllocation = result['response'].previousAllocation;
      });
  }

  newSubHeadsArray: any[] = [];

  showList(data: any) {
    this.newBudgetAllocationArray = [];
    // step-1:- Show the subhead list into the next grid

    for (var i = 0; i < this.subHeadArrayWithoutUnit.length; i++) {
      // var unitIndex = this.cgUnits.findIndex(
      //   (a: { unit: any }) => a.unit == this.newBudgetAllocationList[i].unit
      // );
      // console.log('index == ' + unitIndex);
      this.newBudgetAllocationArray.push({
        financialYear: this.subHeadArrayWithoutUnit[i].finYearName.finYear,
        unitName: this.subHeadArrayWithoutUnit[i].unit.descr,
        subHeadName:
          this.subHeadArrayWithoutUnit[i].selectedSubHead.subHeadDescr,
        amount: this.subHeadArrayWithoutUnit[i].filledAmount,
        // remarks: this.subHeadArrayWithoutUnit[i].remarks,
      });
    }

    // step2:-Remove the subhead from the showing list which is having filled
    var removingSubHeadData = [];
    for (var i = 0; i < this.subHeadArrayWithoutUnit.length; i++) {
      const id = this.subHeadArrayWithoutUnit[i].selectedSubHead.codeSubHeadId;
      var subHeadIndex = this.subHeads.findIndex(
        (a: { codeSubHeadId: any }) => a.codeSubHeadId == id
      );
      this.subHeads.splice(subHeadIndex, 1);
    }

    // Step3:-> save the list of an array with unit
    if (this.newSubHeadsArray.length > 0) {
    } else {
      this.newSubHeadsArray.push({
        subHeads: this.subHeads,
        unit: this.subHeadArrayWithoutUnit[0].unit.unit,
      });
    }
  }

  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  saveBudgetDataFn(data: any) {
    debugger;
    this.tableData;
    this.saveBudgetDataList.push(data);
    let budgetRequest: any[] = [];
    for (var i = 0; i < this.tableData.length; i++) {
      let cda:any[]=[];
      for(let j=0;j<this.finalData[i].cdaInfo.length;j++){
        cda.push({
          cdaParkingId:this.finalData[i].cdaInfo[j].cdaParkingId,
          cdaAmount:this.finalData[i].cdaInfo[j].amount
        })
      }
      budgetRequest.push({
        budgetFinanciaYearId: this.tableData[i].financialYear.serialNo,
        toUnitId: this.tableData[i].unitName.unit,
        subHeadId: this.tableData[i].selectedSubHead.budgetCodeId,
        amount: this.tableData[i].selectedSubHead.amount,
        remark: this.tableData[i].remarks,
        allocationTypeId: this.tableData[i].allocationType.allocTypeId,
        amountTypeId: this.formdata.get('amountType')?.value.amountTypeId,
        cdaParkingId:cda
      });
    }
    this.submitJson = {
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
    var newSubmitJson = data;
    console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');
    this.apiService
      .postApi(this.cons.api.saveBudgetAllocationUnitWise, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.majorHeadBySelectingUnit = [];
            this.arrayWithUnitMajorHeadAndSubHead = [];
            this.minorHead = [];
            this.subHeadBySelectingMajorHead = [];
            this.formdata.reset();
            this.tableData = [];
            this.deleteDataByPid();
            this.subHeadFilterDatas = [];
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
  }

  subHeadDataFormObject = {
    id: null,
    amount: null,
    remarks: null,
  };

  subHeadDataFormList: any[] = [];

  inputBoxValue(data: any, indexValue: any) {
    // console.log('Heelo world' + this.demoSubHeads[data].subheadDesc);

    let indexGet = this.subHeadDataFormList.findIndex(
      (subHeadDataFormObject) => subHeadDataFormObject.id === indexValue + 1
    );

    if (indexGet > -1) {
      this.subHeadDataFormList.splice(indexGet, 1);
    } else {
      this.subHeadDataFormObject.id = indexValue + 1;
      this.subHeadDataFormObject.amount = data.subHeadAmount;
      console.log(
        'Value Come from the subHeads = ' + this.subHeadDataFormObject
      );
      this.subHeadDataFormList.push(this.subHeadDataFormObject);
      this.subHeadDataFormObject = {
        id: null,
        amount: null,
        remarks: null,
      };
    }
  }

  inputBoxValueNew(data: any, indexValue: any) {
    console.log('Heelo world' + this.demoSubHeads[data].subheadDesc);
  }

  subHeadArrayWithoutUnit: any[] = [];

  checkBoxClick(indexValue: any, inputBoxValue: any, formData: any) {
    // Step-1:- Get the sub-head object with index value
    const checkedSubHeadData = this.subHeads[indexValue];

    // Step-2"- create a new array and put the id value as a index value and the subhead value
    this.subHeadArrayWithoutUnit.push({
      id: checkedSubHeadData.budgetCodeId,
      isChecked: true,
      selectedSubHead: checkedSubHeadData,
      filledAmount: inputBoxValue,
      finYearName: formData.finYearName,
      unit: formData.unit,
      remarks: formData.remarks,
    });
  }

  asd(data: any, unitMajorHeadAndSubHead: any, subHeadIndex: any) {
    // this.arrayWithUnitMajorHeadAndSubHead;

    const newarrayWithUnitMajorHeadAndSubHead: any[] = [
      ...this.arrayWithUnitMajorHeadAndSubHead,
    ];
    const majorHead = data.majorHead;
    const subHead = data.budgetCodeId;
    const unit = unitMajorHeadAndSubHead.unit;

    let unitIndex = 0;

    // very Important
    // const newObj = structuredClone(newarrayWithUnitMajorHeadAndSubHead[0]);
    // // const newObj = Object.assign({}, newarrayWithUnitMajorHeadAndSubHead[0]);
    // newarrayWithUnitMajorHeadAndSubHead[0].units.isFlag = '0';

    // newObj.majorHeads[0].subHeads[0].isActive = 0;
    // newarrayWithUnitMajorHeadAndSubHead[0] = newObj;

    for (var i = 0; i < this.arrayWithUnitMajorHeadAndSubHead.length; i++) {
      if (this.arrayWithUnitMajorHeadAndSubHead[i].units.unit == unit) {
        const newObj = structuredClone(
          this.arrayWithUnitMajorHeadAndSubHead[i]
        );
        if (majorHead == '2037') {
          newObj.majorHeads[0].subHeads[subHeadIndex].isActive = 0;
          this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
          this.subHeadBySelectingMajorHead =
            this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[0].subHeads;
        } else if (majorHead == '4047') {
          newObj.majorHeads[1].subHeads[subHeadIndex].isActive = 0;
          this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
          this.subHeadBySelectingMajorHead =
            this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[1].subHeads;
        }
        break;
      }
    }
    // this.arrayWithUnitMajorHeadAndSubHead = newarrayWithUnitMajorHeadAndSubHead;

    // this.subHeadBySelectingMajorHead =
  }

  tableData: any[] = [];
  finalData:any[]=[];
  addSubHeadValue(data: any, formDataValue: any, subHeadIndex: any) {
    if (
      data.amount == undefined ||
      formDataValue.finYearId == null ||
      formDataValue.unitId == null ||
      formDataValue.majorHeadId == null
    ) {
      this.common.faliureAlert(
        'Please try again.',
        'Please fill mandatory data.',
        ''
      );
      return;
    }

    this.SpinnerService.show();
     debugger;
    let submitJson = {
      finYearId: formDataValue.finYearId.serialNo,
      codeSubHeadId: data.budgetCodeId,
      unitId: formDataValue.unitId.unit,
      codeMajorHeadId: data.majorHead,
      allocationType: formDataValue.allocationType.allocTypeId,
      subHeadTypeId: formDataValue.subHeadType.subHeadTypeId,
    };
    let finalTableData:any;
      if(this.subHeadFilterDatas[subHeadIndex].cdaParkingTrans.length>1){
      finalTableData={
        subHeadInfo:this.subHeadFilterDatas[subHeadIndex],
        cdaInfo:this.cdaDetail
      }

    }
      else
      {
        this.cdaDetail=this.subHeadFilterDatas[subHeadIndex].cdaParkingTrans
        this.cdaDetail[0].amount=this.subHeadFilterDatas[subHeadIndex].amount;
        finalTableData={
          subHeadInfo:this.subHeadFilterDatas[subHeadIndex],
          cdaInfo:this.cdaDetail
        }
      }
    this.cdaDetail=undefined;

    this.finalData.push(finalTableData);
    this.apiService
      .postApi(this.cons.api.saveFilterData, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.subHeadFilterDatas = result['response'].subHeads;
            this.tableData.push({
              financialYear: formDataValue.finYearId,
              unitName: formDataValue.unitId,
              selectedSubHead: data,
              remarks: formDataValue.remarks,
              allocationType: formDataValue.allocationType,
            });

            if (this.subHeadFilterDatas != undefined) {
              for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
                if (this.subHeadFilterDatas[i].amountUnit != null) {
                  this.subHeadFilterDatas[i].totalAmount = (
                    (this.subHeadFilterDatas[i].totalAmount *
                      this.subHeadFilterDatas[i].amountUnit.amount) /
                    formDataValue.amountType.amount
                  ).toFixed(4);
                  this.subHeadFilterDatas[i].amountUnit =
                    formDataValue.amountType;
                }

                this.subHeadFilterDatas[i].amount = undefined;
                this.subHeadFilterDatas[i].amountUnit2 = undefined;
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

  showSubHeadDataIntoNextGrid(
    financialYear: any,
    unit: any,
    subHead: any,
    remarks: any
  ) {
    this.newBudgetAllocationArray.push({
      financialYear: financialYear,
      unitName: unit,
      selectedSubHead: subHead,
      remarks: remarks,
    });
  }

  tableCheckBoxClicked(index: any) {
    this.newBudgetAllocationArray[index].isChecked =
      !this.newBudgetAllocationArray[index].isChecked;
  }

  delteFromTable() {
    let adas = this.newBudgetAllocationArray;

    var unitIndex = this.newBudgetAllocationArray.filter(
      (data) => data.isChecked == true
    );

    // Step-1: Rest the subhead entity into the array
    if (unitIndex.length > 0) {
      for (var j = 0; j < unitIndex.length; j++) {
        for (var i = 0; i < this.arrayWithUnitMajorHeadAndSubHead.length; i++) {
          if (
            this.arrayWithUnitMajorHeadAndSubHead[i].units.unit ==
            unitIndex[j].unitName.unit
          ) {
            const newObj = structuredClone(
              this.arrayWithUnitMajorHeadAndSubHead[i]
            );
            if (unitIndex[j].subHeadName.majorHead == '2037') {
              unitIndex[j].subHeadName.isActive = 1;
              newObj.majorHeads[0].subHeads.push(unitIndex[j].subHeadName);
              this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
              this.subHeadBySelectingMajorHead =
                this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[0].subHeads;
            } else if (unitIndex[j].subHeadName.majorHead == '4047') {
              unitIndex[j].subHeadName.isActive = 1;
              newObj.majorHeads[1].subHeads.push(unitIndex[j].subHeadName);
              this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
              this.subHeadBySelectingMajorHead =
                this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[1].subHeads;
            }
            break;
          }
        }
      }

      //step-2

      var demoNewBudgetAllocationArray = this.newBudgetAllocationArray;
      for (var j = demoNewBudgetAllocationArray.length - 1; j >= 0; j--) {
        if (this.newBudgetAllocationArray[j].isChecked) {
          this.newBudgetAllocationArray.splice(j, 1);
        }
      }
    }
  }

  rowUploadData(data: any) {}

  subHeadFilterDatas: any[] = [];

  // minorHeadAutoSelect: any;
  getAllSubHeadByFinYearMajorHeadAndUnit(formdataValue: any) {
    this.count = 1;
    this.countFinYear = 1;

    if (
      formdataValue.majorHeadId == null ||
      formdataValue.majorHeadId.length == 0
    ) {
      this.formdata.patchValue({
        majorHeadId: [],
        minorHeadId: '',
      });
      this.subHeadFilterDatas = [];
      return;
    }

    if (
      formdataValue.finYearId == null ||
      formdataValue.unitId == null ||
      formdataValue.unitId.length == 0 ||
      formdataValue.finYearId.length == 0 ||
      formdataValue.allocationType == null ||
      formdataValue.allocationType.length == 0 ||
      formdataValue.subHeadType == undefined
    ) {
      this.formdata.patchValue({
        majorHeadId: [],
        finYearId: [],
        unitId: [],
        minorHeadId: '',
      });
      this.common.faliureAlert(
        'Please try again...!',
        'Please select Financial Year, To Unit, SubHead Type and allocation type.',
        ''
      );
      return;
    }

    this.SpinnerService.show();

    // this.minorHeadAutoSelect = formdataValue.majorHeadId.minorHead;

    this.formdata.patchValue({
      minorHeadId: formdataValue.majorHeadId.minorHead,
    });
    // debugger;
    let submitJson = {
      finyearId: formdataValue.finYearId.serialNo,
      majorHead: formdataValue.majorHeadId.majorHead,
      unitId: formdataValue.unitId.unit,
      allocationType: this.formdata.get('allocationType')?.value.allocTypeId,
      subHeadTypeId: formdataValue.subHeadType.subHeadTypeId,
    };

    this.apiService.postApi(this.cons.api.getFilterData, submitJson).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.subHeadFilterDatas = result['response'].subHeads;
          // debugger;
          if (this.subHeadFilterDatas != undefined) {
            for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
              if (this.subHeadFilterDatas[i].amountUnit != null) {
                this.subHeadFilterDatas[i].totalAmount = (
                  (this.subHeadFilterDatas[i].totalAmount *
                    this.subHeadFilterDatas[i].amountUnit.amount) /
                  formdataValue.amountType.amount
                ).toFixed(4);
                this.subHeadFilterDatas[i].amountUnit =
                  formdataValue.amountType;
              }

              this.subHeadFilterDatas[i].amount = undefined;
              this.subHeadFilterDatas[i].amountUnit2 = undefined;
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

  count: any = 0;
  majorHeadReset() {
    if (this.count > 0) {
      this.formdata.patchValue({
        majorHeadId: [],
        minorHeadId: '',
      });
      this.count = 0;
    }
    this.subHeadFilterDatas = [];
  }

  countFinYear: any = 0;
  amountUnit: string = '';
  toUnitAndMajorHeadReset() {
    if (this.countFinYear > 0) {
      this.formdata.patchValue({
        majorHeadId: [],
        unitId: [],
        minorHeadId: '',
      });
      this.countFinYear = 0;
    }
    this.subHeadFilterDatas = [];
  }

  deleteRowFromTableData(tableSingleData: any, indexValue: any) {
    this.SpinnerService.show();
    debugger;
    this.finalData.splice(indexValue, 1);
    let submitJson = {
      finyearId: tableSingleData.financialYear.serialNo,
      majorHead: tableSingleData.selectedSubHead.majorHead,
      unitId: tableSingleData.unitName.unit,
      subHeadId: tableSingleData.selectedSubHead.budgetCodeId,
      allocationType: tableSingleData.allocationType.allocTypeId,
    };

    this.apiService.postApi(this.cons.api.deleteData, submitJson).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.subHeadFilterDatas = result['response'].subHeads;

          this.tableData.splice(indexValue, 1);

          if (this.subHeadFilterDatas != undefined) {
            for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
              this.subHeadFilterDatas[i].amount = undefined;
              this.subHeadFilterDatas[i].amountUnit = undefined;
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

  allocatedAmount(index: any, formdata: any) {
    if (formdata.amountType == undefined) {
      Swal.fire('Please Select Rupees in');
      this.subHeadFilterDatas[index].amount = undefined;
      return;
    }
    if(this.subHeadFilterDatas[index].amount>this.subHeadFilterDatas[index].totalAmount){
      this.common.warningAlert('Allocation Amount limit exceed','Allocation amount cannot be larger than available balance','');
      return
    }if(this.subHeadFilterDatas[index].amount<0){
      this.common.warningAlert('Allocation Amount cannot be less than 0','Allocation Amount cannot be less than 0','');
      return
    }
    this.subHeadFilterDatas[index].amount = Number(
      this.subHeadFilterDatas[index].amount
    ).toFixed(4);
    this.subHeadFilterDatas[index].amountUnit2 = formdata.amountType;
  }

  setAmountType() {
    this.amountUnit = this.formdata.get('amountType')?.value.amountType;
    for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
      if (this.subHeadFilterDatas[i].amountUnit != null) {
        for(let j=0;j<this.subHeadFilterDatas[i].cdaParkingTrans.length;j++){
          this.subHeadFilterDatas[i].cdaParkingTrans[j].totalParkingAmount=(parseFloat(this.subHeadFilterDatas[i].cdaParkingTrans[j].totalParkingAmount)*parseFloat(this.subHeadFilterDatas[i].amountUnit.amount) /
          parseFloat(this.formdata.get('amountType')?.value.amount)
        ).toFixed(4);
          this.subHeadFilterDatas[i].cdaParkingTrans[j].remainingCdaAmount=(parseFloat(this.subHeadFilterDatas[i].cdaParkingTrans[j].remainingCdaAmount)*parseFloat(this.subHeadFilterDatas[i].amountUnit.amount) /
            parseFloat(this.formdata.get('amountType')?.value.amount)
          ).toFixed(4);
        }
        this.subHeadFilterDatas[i].totalAmount = (
          (this.subHeadFilterDatas[i].totalAmount *
            this.subHeadFilterDatas[i].amountUnit.amount) /
          this.formdata.get('amountType')?.value.amount
        ).toFixed(4);
        this.subHeadFilterDatas[i].amountUnit =
          this.formdata.get('amountType')?.value;
      }
      if (this.subHeadFilterDatas[i].amount != undefined) {
        this.subHeadFilterDatas[i].amount = (
          (this.subHeadFilterDatas[i].amount *
            this.subHeadFilterDatas[i].amountUnit2.amount) /
          this.formdata.get('amountType')?.value.amount
        ).toFixed(4);
        this.subHeadFilterDatas[i].amountUnit2 =
          this.formdata.get('amountType')?.value;
      }
    }
    for (let i = 0; i < this.tableData.length; i++) {
      debugger;
      this.tableData[i].selectedSubHead.amount = (
        (this.tableData[i].selectedSubHead.amount *
          this.tableData[i].selectedSubHead.amountUnit2.amount) /
        this.formdata.get('amountType')?.value.amount
      ).toFixed(4);
      this.tableData[i].selectedSubHead.amountUnit2 =
        this.formdata.get('amountType')?.value;
      this.tableData[i].selectedSubHead.totalAmount = (
        (this.tableData[i].selectedSubHead.totalAmount *
          this.tableData[i].selectedSubHead.amountUnit.amount) /
        this.formdata.get('amountType')?.value.amount
      ).toFixed(4);
      this.tableData[i].selectedSubHead.amountUnit =
        this.formdata.get('amountType')?.value;
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
  cdaDetail:any;
  index:number=0;
  populateCda(subHeadData: any,i:number) {
    if(subHeadData.amount==undefined)
    {
      this.common.warningAlert("Amount not selected",'Please select amount','');
      return;
    }
    this.index=i;
    this.cdaDetail=subHeadData.cdaParkingTrans;
    debugger;
    for(let j=0;j<this.cdaDetail.length;j++){
      this.cdaDetail[j].totalParkingAmount=parseFloat(this.cdaDetail[j].totalParkingAmount)*parseFloat(this.subHeadFilterDatas[i].amountUnit.amount)/parseFloat(this.amountUnits.amount)
      this.cdaDetail[j].remainingCdaAmount=parseFloat(this.cdaDetail[j].remainingCdaAmount)*parseFloat(this.subHeadFilterDatas[i].amountUnit.amount)/parseFloat(this.amountUnits.amount)
    }
    console.log(subHeadData);
    debugger;
  }
  cdaAllocationbalance:boolean=false;
  cdaWithdrawl(cda: any) {
    this.cdaAllocationbalance=false;
    if(cda.amount>cda.remainingCdaAmount){
      this.common.warningAlert('Amount Exceeds Balance','Cannot withdraw more than balance.','');
      cda.amount=0;
      return;
    }

    let sum=0.0;
    for(let cdaData of this.cdaDetail){
      if(cdaData.amount!=undefined)
        sum=cdaData.amount+sum;
    }
    if(sum==this.subHeadFilterDatas[this.index].amount)
      this.cdaAllocationbalance=true;
    console.log(sum);
    debugger;
  }
}
