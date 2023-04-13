import { Component } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { SubHeadWiseUnitList } from '../model/sub-head-wise-unit-list';
import { UploadDocuments } from '../model/upload-documents';
import Swal from 'sweetalert2';
import { SubHeadReciept } from '../model/sub-head-reciept';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reciept',
  templateUrl: './reciept.component.html',
  styleUrls: ['./reciept.component.scss'],
})
export class RecieptComponent {
  submitJson: any;
  budgetFinYears: any[] = [];
  subHeads: any[] = [];
  allCBUnits: any[] = [];
  selectedCBUnits: any[] = [];
  allocationType: any[] = [];
  majorHeads: any[] = [];

  subHeadRecieptList: any[] = [];

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.getAllocationTypeData();
    this.getNewEmptyEntries();
    this.getUnitDatas();
    this.getMajorData();
    this.uploadDocuments.push(new UploadDocuments());
    $.getScript('assets/main.js');
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    // private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  getNewEmptyEntries() {
    this.subHeadRecieptList.push(new SubHeadReciept());
    this.subHeadRecieptList.push(new SubHeadReciept());
    this.subHeadRecieptList.push(new SubHeadReciept());
    this.subHeadRecieptList.push(new SubHeadReciept());
  }

  formdata = new FormGroup({
    finYear: new FormControl('Select Financial Year', Validators.required),
    subHead: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    allocationType: new FormControl(),
    fundAvailable: new FormControl(),
    currentAllocation: new FormControl(),
    balanceFund: new FormControl(),
    remarks: new FormControl('', Validators.required),
  });

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

  getSubHeadList(eventData: any) {
    this.SpinnerService.show();

    this.formdata.patchValue({
      minorHead: eventData.minorHead,
    });

    this.apiService
      .getApi(
        this.cons.api.getAllSubHeadByMajorHead + '/' + eventData.majorHead
      )
      .subscribe((res) => {
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
        this.allCBUnits = result['response'];
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

  getMajorData() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.getMajorData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.majorHeads = result['response'].subHead;
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  uploadDocuments: any[] = [];
  cbUnitForDocuments: any[] = [];
  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.cbUnitForDocuments = result['response'];
    });
  }
  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  uploadFileResponse: any;
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

  saveBudgetDataFn(formData: any) {
    // this.budgetAllocationArray;
    this.uploadDocuments;
    this.subHeadRecieptList;

    let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];

    // for (var i = 0; i < this.budgetAllocationArray.length; i++) {
    //   budgetRequest.push({
    //     budgetFinanciaYearId:
    //       this.budgetAllocationArray[i].financialYear.serialNo,
    //     toUnitId: this.budgetAllocationArray[i].unitName.unit,
    //     subHeadId: this.budgetAllocationArray[i].subHeadName.budgetCodeId,
    //     amount: this.budgetAllocationArray[i].amount,
    //     remark: this.budgetAllocationArray[i].remarks,
    //     allocationTypeId: 'ALL_101',
    //   });
    // }

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

  getAvailableFund(event: any) {
    //Step1:-> Selected Major Data and Minor Data automatically
    // this.formdata.patchValue({
    //   majorHead: event.majorHead,
    //   minorHead: event.minorHead,
    // });
    // this.selectedCBUnits = structuredClone(this.allCBUnits);
  }

  allocationType1: any;
  allocationType2: any;
  saveAllocationType1(eventData: any) {
    this.allocationType1 = eventData;
  }

  saveAllocationType2(eventData: any) {
    this.allocationType2 = eventData;
  }

  deleteSubHeadWiseUnitList(index: any) {
    this.subHeadRecieptList.splice(index, 1);
  }

  moveDataToNextGrid() {
    this.subHeadRecieptList.splice(0, 0, new SubHeadReciept());
  }
}
