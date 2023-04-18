import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';
import { UploadDocuments } from '../model/upload-documents';

@Component({
  selector: 'app-reciept',
  templateUrl: './reciept.component.html',
  styleUrls: ['./reciept.component.scss'],
})
export class RecieptComponent {
  formdata = new FormGroup({
    finYear: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    subHeadType: new FormControl(),
    remarks: new FormControl(),
  });

  finYearList: any[] = [];
  majorHeadList: any[] = [];
  subHeadTypeList: any[] = [];
  subHeadList: any[] = [];
  allocationTypeList: any[] = [];

  finalTableData: any[] = [];

  uploadDocuments: any[] = [];
  unitForDocuments: any[] = [];

  submitJson: any;

  autoSelectedAllocationType: any;

  searchText: any = '';

  p: number = 1;

  ngOnInit(): void {
    this.getBudgetFinYear();
    this.majorDataNew();
    this.getAllocationTypeData();
    this.uploadDocuments.push(new UploadDocuments());
    this.getUnitDatas();
    this.getBudgetRecipt();
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
        this.finYearList = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  majorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.majorHeadList = result['response'].subHead;
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.unitForDocuments = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getBudgetRecipt() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetRecipt).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.finalTableData = result['response'].budgetResponseist;

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
          this.allocationTypeList = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  majorHeadChange(selectedMajorHead: any, formdataValue: any) {
    debugger;

    if (selectedMajorHead == undefined || selectedMajorHead == null) {
      this.formdata.reset();
      this.isSelectedRE = false;
      this.isSelectedMA = false;
      this.isSectedSG = false;
      this.isSectedVOA = false;
      this.isUpdate = false;
      this.autoSelectedAllocationType = null;
      this.subHeadList = [];
      this.uploadDocuments = [];
      this.uploadDocuments.push(new UploadDocuments());
      return;
    }

    if (formdataValue.finYear == null || formdataValue.finYear == undefined) {
      this.common.faliureAlert(
        'Please try again.',
        'Please select Financial Year.',
        ''
      );
      this.formdata.reset();
      this.isSelectedRE = false;
      this.isSelectedMA = false;
      this.isSectedSG = false;
      this.isSectedVOA = false;
      this.isUpdate = false;
      this.autoSelectedAllocationType = null;
      this.subHeadList = [];
      this.uploadDocuments = [];
      this.uploadDocuments.push(new UploadDocuments());
      return;
    }

    //Step-1 => Auto select Minor-Head
    this.formdata.patchValue({
      minorHead: selectedMajorHead.minorHead,
    });

    // Step-2 => Get all sub head by major head cuz we need to set the sub head in next table
    this.getAllSubHeadByMajorHead(selectedMajorHead.majorHead, formdataValue);
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

  selectedFinYear: any;
  getAllSubHeadByMajorHead(formData: any, formdataValue: any) {
    this.SpinnerService.show();

    let submitJson = {
      majorHeadId: formData,
      budgetFinancialYearId: formdataValue.finYear.serialNo,
    };

    this.selectedFinYear = formdataValue.finYear.serialNo;

    this.apiService
      .postApi(this.cons.api.getBudgetReciptFilter, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.isUpdate = false;
            this.autoSelectedAllocationType = null;
            this.subHeadList = result['response'].budgetData;
            for (let i = 0; i < this.subHeadList.length; i++) {
              this.subHeadList[i].codeSubHeadId =
                this.subHeadList[i].budgetHead.codeSubHeadId;
              this.subHeadList[i].subHeadDescr =
                this.subHeadList[i].budgetHead.subHeadDescr;
              this.subHeadList[i].budgetCodeId =
                this.subHeadList[i].budgetHead.budgetCodeId;
              this.subHeadList[i].amount = '';
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

  isSelectedRE: boolean = false;
  isSelectedMA: boolean = false;
  isSectedSG: boolean = false;
  isSectedVOA: boolean = false;
  finalSelectedAllocationType: any = {};

  allocationTypeChange(selectedAllocationType: any) {
    this.finalSelectedAllocationType = selectedAllocationType;
    if (selectedAllocationType.allocType == 'RE') {
      this.isSelectedRE = true;
      this.isSelectedMA = false;
      this.isSectedSG = false;
      this.isSectedVOA = false;
    } else if (selectedAllocationType.allocType == 'MA') {
      this.isSelectedRE = false;
      this.isSelectedMA = true;
      this.isSectedSG = false;
      this.isSectedVOA = false;
    } else if (selectedAllocationType.allocType == 'SG') {
      this.isSelectedRE = false;
      this.isSelectedMA = false;
      this.isSectedSG = true;
      this.isSectedVOA = false;
    } else if (selectedAllocationType.allocType == 'VOA') {
      this.isSelectedRE = false;
      this.isSelectedMA = false;
      this.isSectedSG = false;
      this.isSectedVOA = true;
    } else if (selectedAllocationType.allocType == 'BE') {
      this.isSelectedRE = false;
      this.isSelectedMA = false;
      this.isSectedSG = false;
      this.isSectedVOA = false;
    }
  }

  saveBudgetRecipt() {
    let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];

    for (var i = 0; i < this.subHeadList.length; i++) {
      budgetRequest.push({
        budgetHeadId: this.subHeadList[i].budgetHead.budgetCodeId,
        allocationAmount: this.subHeadList[i].amount,
      });
    }

    for (var i = 0; i < this.uploadDocuments.length; i++) {
      if (
        this.uploadDocuments[i].authority == null ||
        this.uploadDocuments[i].authority == undefined ||
        this.uploadDocuments[i].authUnit == null ||
        this.uploadDocuments[i].authUnit == undefined ||
        this.uploadDocuments[i].authorityData == null ||
        this.uploadDocuments[i].authorityData == undefined ||
        this.uploadDocuments[i].remarks == null ||
        this.uploadDocuments[i].remarks == undefined ||
        this.uploadDocuments[i].uploadDocId == null ||
        this.uploadDocuments[i].uploadDocId == undefined
      ) {
        authRequestsList = [];
        this.common.faliureAlert(
          'Please try again.',
          'Please Fill Authority Data',
          ''
        );
        return;
      } else {
        if (this.isUpdate) {
          authRequestsList.push({
            authority: this.uploadDocuments[i].authority,
            authDate: this.uploadDocuments[i].authorityData,
            remark: this.uploadDocuments[i].remarks,
            authUnitId: this.uploadDocuments[i].authUnit.unit,
            authDocId: this.uploadDocuments[i].uploadDocId,
            authorityId: 'AU_ID1681724260012',
          });
        } else {
          authRequestsList.push({
            authority: this.uploadDocuments[i].authority,
            authDate: this.uploadDocuments[i].authorityData,
            remark: this.uploadDocuments[i].remarks,
            authUnitId: this.uploadDocuments[i].authUnit.unit,
            authDocId: this.uploadDocuments[i].uploadDocId,
          });
        }
      }
    }

    this.submitJson = {
      budgetFinancialYearId: this.selectedFinYear,
      allocationTypeId: this.finalSelectedAllocationType.allocTypeId,
      authListData: authRequestsList,
      receiptSubRequests: budgetRequest,
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
      .postApi(this.cons.api.budgetRecipetSave, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.getBudgetRecipt();
            this.isSelectedRE = false;
            this.isSelectedMA = false;
            this.isSectedSG = false;
            this.isSectedVOA = false;
            this.isUpdate = false;
            this.autoSelectedAllocationType = null;
            this.subHeadList = [];
            this.uploadDocuments = [];
            this.uploadDocuments.push(new UploadDocuments());
            this.formdata.reset();
            this.common.successAlert('Success', 'Finally submitted', 'success');
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

  previewURL(path: any) {
    window.open(path.authList[0].docId.pathURL, '_blank');
  }

  authListData: any[] = [];

  isUpdate: boolean = false;

  updateReciept(data: any) {
    this.SpinnerService.show();
    this.isUpdate = true;

    this.formdata.patchValue({
      finYear: data.finYear,
      majorHead: data.subHead,
      minorHead: data.subHead.minorHead,
    });

    this.allocationTypeChange(data.allocTypeId);

    this.selectedFinYear = data.finYear.serialNo;
    this.finalSelectedAllocationType = data.allocTypeId;

    let selectedAllocationType = data.allocTypeId.allocType;

    this.autoSelectedAllocationType = data.allocTypeId.allocType;

    let submitJson = {
      majorHeadId: data.subHead.majorHead,
      budgetFinancialYearId: data.finYear.serialNo,
    };

    this.apiService
      .postApi(this.cons.api.getBudgetReciptFilter, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();

          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.subHeadList = result['response'].budgetData;

            for (let i = 0; i < this.subHeadList.length; i++) {
              this.subHeadList[i].codeSubHeadId =
                this.subHeadList[i].budgetHead.codeSubHeadId;
              this.subHeadList[i].subHeadDescr =
                this.subHeadList[i].budgetHead.subHeadDescr;
              this.subHeadList[i].budgetCodeId =
                this.subHeadList[i].budgetHead.budgetCodeId;
              if (selectedAllocationType == 'BE') {
                this.subHeadList[i].amount = this.subHeadList[i].be;
              } else if (selectedAllocationType == 'RE') {
                this.subHeadList[i].amount = this.subHeadList[i].re;
              } else if (selectedAllocationType == 'MA') {
                this.subHeadList[i].amount = this.subHeadList[i].ma;
              } else if (selectedAllocationType == 'SG') {
                this.subHeadList[i].amount = this.subHeadList[i].sg;
              } else if (selectedAllocationType == 'VOA') {
                this.subHeadList[i].amount = this.subHeadList[i].voa;
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

  changeFinYear() {
    this.isSelectedRE = false;
    this.isSelectedMA = false;
    this.isSectedSG = false;
    this.isSectedVOA = false;
    this.isUpdate = false;
    this.autoSelectedAllocationType = null;
    this.subHeadList = [];
    this.formdata.patchValue({
      minorHead: '',
      majorHead: null,
    });
  }
}
