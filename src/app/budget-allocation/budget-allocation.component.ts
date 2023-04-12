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

@Component({
  selector: 'app-budget-allocation',
  templateUrl: './budget-allocation.component.html',
  styleUrls: ['./budget-allocation.component.scss'],
})
export class BudgetAllocationComponent implements OnInit {
  uploadDocuments: any[] = [];

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
    cbUnit: new FormControl(), //
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
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private keycloakService: KeycloakService
  ) {}

  token: any;
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    // this.keycloakService.getToken().then((token) => {
    //   this.token = token;
    //   this.getUserDetails(this.token);
    //   localStorage.setItem('token', this.token);
    // });

    // this.getDataBudgetAllocation();
    // this.balanceFund = 0;
    // this.getCombo("MONTH", "");
    // this.getCombo("YEAR", "");
    // this.cgwwaUserDetails = JSON.parse(
    //   localStorage.getItem("cgwwaUserDetails") || ""
    // );
    this.getUserDetails('');
    this.getUnitDatas();

    this.uploadDocuments.push(new UploadDocuments());

    $.getScript('assets/main.js');
  }

  getUserDetails(token: any) {
    this.SpinnerService.show();
    this.apiService
      .getToeknApi(this.cons.api.getUserNameApiUrl, this.token)
      .subscribe({
        next: (v: object) => {
          // console.log("getToeknApi............" + JSON.stringify(v));
          let result: { [key: string]: any } = v;

          // if (result['upn'] != "") {
          var userNameJson = {
            userRoleId: 'ICGS Delhi',
            userName: 'kya hai ye',
            userUnitId: '000015',
          };
          var self = this;

          this.apiService
            .getApi(this.cons.api.getMajorData)
            .subscribe((res) => {
              let result: { [key: string]: any } = res;
              if (result['message'] == 'success') {
                localStorage.setItem('newToken', result['response']['token']);
                this.getFinancialYear();
                this.majorHead = result['response'].subHead;
                this.minorHead = result['response'].subHead;
                this.getCgUnitData();
                this.getAllSubHeadDataFirst();
                this.getAllSubHeadDataSecond();

                this.SpinnerService.hide();
              } else {
                this.common.faliureAlert(
                  'Please try later',
                  result['message'],
                  ''
                );
              }
            });

          // this.apiService
          //   .postApi(this.cons.api.getMajorData, userNameJson)
          //   .subscribe({
          //     next: (v: object) => {
          //       let result: { [key: string]: any } = v;
          //       // console.log("userdetail............" + JSON.stringify(v));
          //       if (result['message'] == 'success') {
          //         localStorage.setItem('newToken', result['response']['token']);
          //         this.getFinancialYear();
          //         this.majorHead = result['response'].subHead;
          //         this.minorHead = result['response'].subHead;
          //         this.getCgUnitData();
          //         this.getAllSubHeadDataFirst();
          //         this.getAllSubHeadDataSecond();

          //         this.SpinnerService.hide();
          //       } else {
          //         this.common.faliureAlert(
          //           'Please try later',
          //           result['message'],
          //           ''
          //         );
          //       }
          //     },
          //     error: (e) => {},
          //     complete: () => console.info('complete'),
          //   });
          // }
        },
        error: (e) => {},
        complete: () => console.info('complete'),
      });
  }

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
        cbUnits: this.cgUnits[i],
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
    const fasd = this.formdata.value.cbUnit;
    var unitIndex = this.arrayWithUnitMajorHeadAndSubHead.findIndex(
      (a: { cbUnits: any }) => a.cbUnits.cbUnit == fasd
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

  getCgUnitData() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();

      let result: { [key: string]: any } = res;
      this.cgUnits = result['response'];
    });
  }

  getAllSubHeadByMajorHeads(data: any, formDataValue: any) {
    //step1:- Must select the Unit before selecting the Major Head
    if (formDataValue.cbUnit == null) {
      this.subHeads = [];
      this.formdata.reset();
      this.common.warningAlert(
        'Messege',
        'Please Select the Unit before selecting the Major Head.',
        ''
      );
      return;
    }

    //step2:- Check if the subhead is froweded to the next grid wrt unit
    if (formDataValue.cbUnit != null) {
      if (this.subHeadArrayWithoutUnit.length > 0) {
        const found = this.subHeadArrayWithoutUnit.find((obj) => {
          return obj.cbUnit.cbUnit === formDataValue.cbUnit.cbUnit;
        });

        if (found != undefined) {
          this.subHeads = [];
          this.getAllSubHeadData(data);
          for (var i = 0; i < this.subHeadArrayWithoutUnit.length; i++) {
            var subHeadIndex = this.subHeads.findIndex(
              (a: { budgetCodeId: any }) =>
                a.budgetCodeId == this.subHeadArrayWithoutUnit[i].budgetCodeId
            );
            if (subHeadIndex > -1) {
              this.subHeads.splice(subHeadIndex, 1);
            }
            // this.subHeadArrayWithoutUnit[i].selectedSubHead.budgetCodeId;
          }
        }
      } else {
        this.getAllSubHeadData(data);
      }
    }
  }

  getAllSubHeadDataFirst() {
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getAllSubHeadByMajorHead + '/4047')
      .subscribe((res) => {
        this.SpinnerService.hide();

        let result: { [key: string]: any } = res;

        this.subHeadFirst = result['response'];

        // result['response'].forEach((item : any, index: any) =>   {
        //   var obj;
        //   obj = {
        //     budgetCodeId: item.budgetCodeId,
        //     codeSubHeadId: item.codeSubHeadId,
        //     majorHead: item.majorHead,
        //     minorHead: item.minorHead,
        //     subHeadDescr: item.subHeadDescr,
        //     subheadShort: item.subheadShort,
        //     isActive: item.isActive,
        //     remark: item.budgetCodeId,
        //   }
        // });
      });
  }

  getAllSubHeadDataSecond() {
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getAllSubHeadByMajorHead + '/2037')
      .subscribe((res) => {
        this.SpinnerService.hide();

        let result: { [key: string]: any } = res;

        this.subHeadSecond = result['response'];
      });
  }

  getAllSubHeadData(data: any) {
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getAllSubHeadByMajorHead + '/' + data)
      .subscribe((res) => {
        this.SpinnerService.hide();

        let result: { [key: string]: any } = res;

        this.subHeads = result['response'];
      });
  }

  createContact(contact: any, fb: FormBuilder) {
    return fb.group({
      name: [contact.name],
      age: [contact.age],
    });
  }

  getDataBudgetAllocation() {
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getDataBudgetAllocation)
      .subscribe((res) => {
        this.SpinnerService.hide();

        let result: { [key: string]: any } = res;
        this.budgetFinYears = result['response'].budgetFinYearData;
        this.subHeads = result['response'].subHeadsData;
        this.cgUnits = result['response'].cgUnitData;
        this.budgetTypes = result['response'].budgetTypeData;
        this.allocationTypes = result['response'].allocationTypeData;

        this.allocationAuthorityUnits =
          result['response'].allocationAuthorityUnits;
        this.authorityTypes = result['response'].authorityTypes;

        console.log('data === ' + this.cgUnits[0].unit);
      });
  }

  subHeadSelected(subHead: any) {
    // this.majorHead = this.subHeads.filter(function (ele) {
    //   return (ele.id = a);
    // });
    console.log('majorHead ============== ' + subHead.majorHead);
    this.majorHead = subHead.majorHead;
    this.minorHead = subHead.minorHead;
  }

  getAvailableFund(cgUnit: any) {
    // Only for demo

    // Only for demo
    this.SpinnerService.show();
    var comboJson = null;
    console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService
      .getApi(this.cons.api.getAvailableFund + '/' + cgUnit.cbUnit)
      .subscribe((res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;

        this.fundAvailable = result['response'].fundAvailable;
        this.previousAllocation = result['response'].previousAllocation;
      });
  }

  addData(data: any) {
    this.newBudgetAllocationList.push(data);
    this.showList('');
  }

  addDataFurtherTable(data: any) {
    console.log('Value data for subHead ==== ' + data);

    // this.newBudgetAllocationList.push(data);
    // this.showList();
  }

  newSubHeadsArray: any[] = [];

  showList(data: any) {
    this.newBudgetAllocationArray = [];
    // step-1:- Show the subhead list into the next grid

    for (var i = 0; i < this.subHeadArrayWithoutUnit.length; i++) {
      // var unitIndex = this.cgUnits.findIndex(
      //   (a: { unit: any }) => a.unit == this.newBudgetAllocationList[i].cbUnit
      // );
      // console.log('index == ' + unitIndex);
      this.newBudgetAllocationArray.push({
        financialYear: this.subHeadArrayWithoutUnit[i].finYearName.finYear,
        unitName: this.subHeadArrayWithoutUnit[i].cbUnit.descr,
        subHeadName:
          this.subHeadArrayWithoutUnit[i].selectedSubHead.subHeadDescr,
        amount: this.subHeadArrayWithoutUnit[i].filledAmount,
        remarks: this.subHeadArrayWithoutUnit[i].remarks,
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
        unit: this.subHeadArrayWithoutUnit[0].cbUnit.cbUnit,
      });
    }
  }

  onSearchChange(searchValue: string): void {
    if (Number(searchValue) > this.fundAvailable) {
      console.log('Value cannot be greter than fund available');
    } else {
      this.balanceFund = Number(this.fundAvailable) - Number(searchValue);
    }
  }

  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

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

  saveBudgetDataFn(data: any) {
    // saveBudgetDataList: any[] = [];
    // newBudgetDataSaveList: any[] = [];

    this.newBudgetAllocationArray;
    this.uploadDocuments;
    debugger;

    this.saveBudgetDataList.push(data);

    var newBudgetAllocationListSubArray = [];

    let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];

    for (var i = 0; i < this.newBudgetAllocationArray.length; i++) {
      budgetRequest.push({
        budgetFinanciaYearId:
          this.newBudgetAllocationArray[i].financialYear.serialNo,
        toUnitId: this.newBudgetAllocationArray[i].unitName.unit,
        subHeadId: this.newBudgetAllocationArray[i].subHeadName.budgetCodeId,
        amount: this.newBudgetAllocationArray[i].amount,
        remark: this.newBudgetAllocationArray[i].remarks,
        allocationTypeId: 'ALL_101',
      });
    }

    for (var i = 0; i < this.uploadDocuments.length; i++) {
      authRequestsList.push({
        authUnitId: this.uploadDocuments[i].authUnit.unit,
        authority: this.uploadDocuments[i].authority,
        authDate: this.uploadDocuments[i].authorityData,
        remark: this.uploadDocuments[i].remarks,
        authDocId: this.uploadDocuments[i].uploadDocId,
      });
    }

    this.submitJson = {
      authRequests: authRequestsList,
      budgetRequest: budgetRequest,
    };

    // var submitJson = {
    //   authorityUnit: 'Diwakar',
    // };

    // newBudgetDataSaveList

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
            this.uploadDocuments = [];
            this.majorHeadBySelectingUnit = [];
            this.arrayWithUnitMajorHeadAndSubHead = [];
            this.minorHead = [];
            this.subHeadBySelectingMajorHead = [];
            this.uploadDocuments.push(new UploadDocuments());
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

    // this.common.successAlert('Success', 'Finally submitted', 'success');
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
      cbUnit: formData.cbUnit,
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
    const cbUnit = unitMajorHeadAndSubHead.cbUnit;

    let cbUnitIndex = 0;

    // very Important
    // const newObj = structuredClone(newarrayWithUnitMajorHeadAndSubHead[0]);
    // // const newObj = Object.assign({}, newarrayWithUnitMajorHeadAndSubHead[0]);
    // newarrayWithUnitMajorHeadAndSubHead[0].cbUnits.isFlag = '0';

    // newObj.majorHeads[0].subHeads[0].isActive = 0;
    // newarrayWithUnitMajorHeadAndSubHead[0] = newObj;

    for (var i = 0; i < this.arrayWithUnitMajorHeadAndSubHead.length; i++) {
      if (this.arrayWithUnitMajorHeadAndSubHead[i].cbUnits.cbUnit == cbUnit) {
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

  addSubHeadValue(data: any, formDataValue: any, subHeadIndex: any) {
    this.formdata.controls['amount'].setValue(null);
    const newarrayWithUnitMajorHeadAndSubHead =
      this.arrayWithUnitMajorHeadAndSubHead;
    const majorHead = data.majorHead;
    const subHead = data.budgetCodeId;
    const cbUnit = formDataValue.cbUnit;

    let cbUnitIndex = 0;

    for (var i = 0; i < this.arrayWithUnitMajorHeadAndSubHead.length; i++) {
      if (this.arrayWithUnitMajorHeadAndSubHead[i].cbUnits.cbUnit == cbUnit) {
        const newObj = structuredClone(
          this.arrayWithUnitMajorHeadAndSubHead[i]
        );
        cbUnitIndex = i;
        if (majorHead == '2037') {
          newObj.majorHeads[0].subHeads.splice(subHeadIndex, 1);
          this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
          this.subHeadBySelectingMajorHead =
            this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[0].subHeads;
          this.showSubHeadDataIntoNextGrid(
            formDataValue.finYearName,
            this.arrayWithUnitMajorHeadAndSubHead[i].cbUnits,
            data,
            formDataValue.amount,
            formDataValue.remarks
          );
        } else if (majorHead == '4047') {
          newObj.majorHeads[1].subHeads.splice(subHeadIndex, 1);
          this.arrayWithUnitMajorHeadAndSubHead[i] = newObj;
          this.subHeadBySelectingMajorHead =
            this.arrayWithUnitMajorHeadAndSubHead[i].majorHeads[1].subHeads;
          this.showSubHeadDataIntoNextGrid(
            formDataValue.finYearName,
            this.arrayWithUnitMajorHeadAndSubHead[i].cbUnits,
            data,
            formDataValue.amount,
            formDataValue.remarks
          );
        }
        break;
      }
    }
  }

  showSubHeadDataIntoNextGrid(
    financialYear: any,
    unit: any,
    subHead: any,
    amount: any,
    remarks: any
  ) {
    this.newBudgetAllocationArray.push({
      financialYear: financialYear,
      unitName: unit,
      subHeadName: subHead,
      amount: amount,
      remarks: remarks,
      isChecked: false,
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
            this.arrayWithUnitMajorHeadAndSubHead[i].cbUnits.cbUnit ==
            unitIndex[j].unitName.cbUnit
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

  cbUnitForDocuments: any[] = [];
  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.cbUnitForDocuments = result['response'];
    });
  }

  addFieldValue() {
    this.uploadDocuments.push(new UploadDocuments());
  }

  deleteFieldValue(index: any) {
    this.uploadDocuments.splice(index, 1);
  }

  rowUploadData(data: any) {}
}
