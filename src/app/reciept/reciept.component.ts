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
import { elements } from 'chart.js';
import {SharedService} from "../services/shared/shared.service";
import {DatePipe} from "@angular/common";
import {MultiCdaParking} from "../model/multi-cda-parking";

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
    amountType: new FormControl(),
    allocType:new FormControl()
  });
  formData=new FormGroup({
    amountType2: new FormControl(),
  })

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

  totalAmount: any = 0.0;

  defaultAllocationType: any;
  defaultAmountType: any;
  outboxResponse: any;
  cdaUnitList: any;
  cdaList: any;
  currentIndex:any;
  currentEntry:any;
  totalParking:any;
  parking: any;
  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('./assets/js/adminlte.js');
    this.getCdaUnitList();
    this.getAmountType();
    this.getBudgetFinYear();
    this.majorDataNew();
    this.getAllocationTypeData();
    this.getUnitDatas();
    this.getBudgetRecipt();
    this.getSubHeadType();
    this.getModData();
    this.outboxResponse=this.sharedService.inboxOutbox();
    // debugger;
  }

  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private datePipe: DatePipe
  ) {}

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.finYearList = result['response'];
          // this.formdata.patchValue({
          //   finYear: this.finYearList[0],
          // });
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
  getSubHeadType() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadType).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
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

  majorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.majorHeadList = result['response'].subHead;
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

  getBudgetRecipt() {
    // debugger;
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetRecipt).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.finalTableData = result['response'].budgetResponseist;
        // debugger;
        if(this.defaultAmountType==null&&this.defaultAmountType2!=null)
         this.defaultAmountType=this.defaultAmountType2;
        if (this.defaultAmountType2 != undefined) {
          for (let i = 0; i < this.finalTableData.length; i++) {
            this.finalTableData[i].allocationAmount = (
              (this.finalTableData[i].allocationAmount *
                this.finalTableData[i].amountUnit.amount) /
              this.defaultAmountType2.amount
            ).toFixed(4);
            this.finalTableData[i].isEdit = false;
            if(this.finalTableData[i].cdaParkingListData.length==0){
              console.log(i+">>>>Backup Amount "+this.finalTableData[i].allocationAmount)
            }
            this.finalTableData[i].allocationAmountBackup=this.finalTableData[i].allocationAmount;
          }
          this.updateInbox();
        }
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getAllocationTypeData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllocationTypeData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();

        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          // debugger;
          this.allocationTypeList = result['response'];

          for (var i = 0; i < this.allocationTypeList.length; i++) {
            if (
              result['response'][i].allocTypeId == 'ALL_106' ||
              result['response'][i].allocTypeId == 'ALL_107'
            ) {
              this.allocationTypeList.splice(i, 1);
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
  setminorhead(selectedMajorHead: any) {
    this.formdata.patchValue({
      minorHead: selectedMajorHead.minorHead,
    });
  }
  majorHeadChange(selectedMajorHead: any, formdataValue: any) {
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
    this.totalAmount = 0;
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
    // this.formdata.patchValue({
    //   minorHead: selectedMajorHead.minorHead,
    // });

    // Step-2 => Get all sub head by major head cuz we need to set the sub head in next table
    this.getAllSubHeadByMajorHead(selectedMajorHead.majorHead, formdataValue);
  }
  file: any;

  onChangeFile(event: any,i:number) {
    debugger;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      // debugger;
      $.getScript('assets/js/adminlte.js');
      this.uploadDocuments[i].filepath=this.file.name;
    }
  }
  uploadFileResponse: any;
  uploadFile(index: any) {
    debugger;
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
    debugger;
  }
  viewFile(file: string) {
    this.apiService.getApi(this.cons.api.fileDownload + file).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        this.openPdfUrlInNewTab(result['response'].pathURL);
        // console.log(result['response'].pathURL);
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
  deleteFieldValue(index: any) {
    this.uploadDocuments.splice(index, 1);
  }

  addFieldValue() {
    this.uploadDocuments.push(new UploadDocuments());
  }

  selectedFinYear: any;
  previousRecieptData:any[]=[];
  getAllSubHeadByMajorHead(formData: any, formdataValue: any) {
    this.SpinnerService.show();
    let submitJson = {
      budgetHeadType: formdataValue.subHeadType.subHeadTypeId,
      majorHeadId: formdataValue.majorHead.majorHead,
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
            this.previousRecieptData=[];
            this.isUpdate = false;
            this.autoSelectedAllocationType = null;
            this.subHeadList = result['response'].budgetData[0].data;
            for (let i = 0; i < this.subHeadList.length; i++) {
              this.subHeadList[i].codeSubHeadId =
                this.subHeadList[i].budgetHead.codeSubHeadId;
              this.subHeadList[i].subHeadDescr =
                this.subHeadList[i].budgetHead.subHeadDescr;
              this.subHeadList[i].budgetCodeId =
                this.subHeadList[i].budgetHead.budgetCodeId;
              this.subHeadList[i].amount = '';
              this.subHeadList[i].amountType = undefined;
            }

            for(let i=0;i<result['response'].budgetData.length;i++){
              if(result['response'].budgetData[i].allocationType!=null)
                this.previousRecieptData.push(result['response'].budgetData[i]);
            }
            for(let i=0;i<this.previousRecieptData.length;i++){
              for(let j=0;j<this.previousRecieptData[i].data.length;j++){
                if(this.previousRecieptData[i].data[j].budgetAllocations==null){
                  let alAm=[{allocationAmount:'Not defined'}]
                  this.previousRecieptData[i].data[j].budgetAllocations=alAm;
                }
              }
            }
          // debugger;
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
    this.totalAmount = 0;
    let authRequestsList: any[] = [];
    let budgetRequest: any[] = [];

    for (var i = 0; i < this.subHeadList.length; i++) {
      if (this.subHeadList[i].amount == '') {
        this.subHeadList[i].amount = '0';
      }
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
      majorMinerHead:this.formdata.get('majorHead')?.value.majorHead,
      subHeadType:this.formdata.get('subHeadType')?.value.subType,
      budgetFinancialYearId: this.selectedFinYear,
      allocationType: this.formdata.get('allocType')?.value,
      amountTypeId: this.formdata.get('amountType')?.value.amountTypeId,
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

    // console.log(JSON.stringify(newSubmitJson) + ' =submitJson for save budget');

    this.apiService
      .postApi(this.cons.api.budgetRecipetSave, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.updateInbox();
            this.sharedService.finYear=this.formdata.get('finYear')?.value;
            this.isSelectedRE = false;
            this.isSelectedMA = false;
            this.isSectedSG = false;
            this.isSectedVOA = false;
            this.isUpdate = false;
            this.autoSelectedAllocationType = null;
            this.subHeadList = [];
            this.uploadDocuments = [];
            // this.uploadDocuments.push(new UploadDocuments());
            this.formdata.reset();
            this.file=undefined;
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);
            this.getModData();
            this.common.successAlert('Success', 'Finally submitted', 'success');
            // this.formData.get('amountType2')?.setValue(this.defaultAmountType2);
            this.getBudgetRecipt();
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
  amountType: any;
  defaultAmountType2: any;
  getAmountType() {
    this.apiService.getApi(this.cons.api.showAllAmountUnit).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountType = result['response'];
          this.defaultAmountType = this.amountType[0];
          this.defaultAmountType2 = this.amountType[0];
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
    // debugger;

    let submitJson = {
      majorHeadId: data.subHead.majorHead,
      budgetFinancialYearId: data.finYear.serialNo,
      budgetHeadType: data.subHead.subHeadTypeId,
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
    this.totalAmount = 0;
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

  allocatedAmount(index: any, formdata: any) {
    if (formdata.amountType == undefined) {
      this.subHeadList[index].amount = undefined;
      Swal.fire('Please enter Rupees in.');
      return;
    }
    this.subHeadList[index].amountType = formdata.amountType;
    this.totalAmount = 0;
    this.subHeadList[index].amount = Number(
      this.subHeadList[index].amount
    ).toFixed(4);
    for (var i = 0; i < this.subHeadList.length; i++) {
      if (this.subHeadList[i].amount != '') {
        this.totalAmount =
          parseFloat(this.totalAmount) + parseFloat(this.subHeadList[i].amount);
      }
    }
  }

  getModData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getModData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          let newUploadDocuments = new UploadDocuments();
          newUploadDocuments.authUnit = result['response'];
          this.uploadDocuments.push(newUploadDocuments);
          debugger;
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

  setAmountType(formData: any) {
    for (let i = 0; i < this.subHeadList.length; i++) {
      this.subHeadList[i].amount = (
        (this.subHeadList[i].amount * this.subHeadList[i].amountType.amount) /
        formData.amountType.amount
      ).toFixed(4);
      this.subHeadList[i].amountType = formData.amountType;
    }
    // for (let i = 0; i < this.finalTableData.length; i++) {
    //   this.finalTableData[i].allocationAmount = (this.finalTableData[i].allocationAmount * this.finalTableData[i].amountUnit.amount / formData.amountType.amount).toFixed(4);
    //   this.finalTableData[i].amountUnit=formData.amountType;
    // }
  }

  setAmountType2(formData: any) {
    // debugger;
    for (let i = 0; i < this.finalTableData.length; i++) {
      this.finalTableData[i].allocationAmount = (
        (this.finalTableData[i].allocationAmount *
          this.finalTableData[i].amountUnit.amount) /parseFloat(this.formData.get('amountType2')?.value.amount)

        // formData.amountType2.amount
      ).toFixed(4);
      this.finalTableData[i].amountUnit =this.formData.get('amountType2')?.value;
        // formData.amountType2;
    }
  }

  updateRecieptByInlineEditing(data: any, index: any) {
    this.finalTableData.forEach((element) => {
      // debugger;
      element.isEdit = false;
    });
    data.isEdit = true;
  }

  cancelUpdate(data: any) {
    data.isEdit = false;
    this.getBudgetRecipt();
  }

  updateRecipetSave(data: any) {
    this.SpinnerService.show();
    let submitJson = {
      budgetFinancialYearId: data.finYear.serialNo,
      allocationTypeId: data.allocTypeId.allocTypeId,
      amountTypeId: data.amountUnit.amountTypeId,
      budgetHeadId: data.subHead.budgetCodeId,
      allocationAmount: data.allocationAmount,
    };

    this.apiService
      .postApi(this.cons.api.updateRecipetSave, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.getBudgetRecipt();
            this.updateInbox();
            this.common.successAlert('Success', 'Successfully Updated', '');
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
  updateInbox(){
    this.apiService
      .getApi(this.cons.api.updateInboxOutBox)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.sharedService.approve=result['response'].approved;
            this.sharedService.archive=result['response'].archived;
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

  checkDate(i:number) {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const cbDate = this.datePipe.transform(
      new Date(this.uploadDocuments[i].authorityData),
      'yyyy-MM-dd'
    );
    if (cbDate != null && date != null) {
      if (cbDate > date) {
        Swal.fire('Authority Date cannot be a future date');
        this.uploadDocuments[i].authorityData=undefined;
        // console.log('date= ' + this.formdata.get('cbDate')?.value);
      }
    }
    let flag:boolean=this.common.checkDate(this.uploadDocuments[i].authorityData);
    if(!flag){
      this.common.warningAlert('Invalid Date','Enter date of this fiscal year only','');
      this.uploadDocuments[i].authorityData=undefined;
    }
  }
  private getCdaUnitList() {
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
  isdisableUpdateButton=true;
  checkTotalParking() {
    this.totalParking=Number(this.parking).toFixed(4);
    debugger;
    let sum=0;
    for(let cda of this.cdaList){
      if(cda.amount!=undefined)
        sum=Number(sum)+Number(cda.amount);
    }

    this.totalParking=Number(Number(this.totalParking)-Number(sum)).toFixed(4);
    if(this.totalParking==0){
      this.isdisableUpdateButton=false;
    }
    else{
      this.isdisableUpdateButton=true;
    }
  }
  addNewRow() {
    this.cdaList.push(new MultiCdaParking());
  }

  deleteFromMultipleCdaParking(index: any) {
    this.cdaList.splice(index, 1);
  }
  populateCda(li: any,index:number) {
    let sum1 =0;
    for(let cda of li.cdaParkingListData){
      sum1=sum1+Number(cda.remainingCdaAmount);
    }
    this.parking=Number(Number(li.allocationAmount)-Number(li.allocationAmountBackup)+Number(sum1)).toFixed(4);
    this.totalParking=Number(this.parking).toFixed(4);
    debugger;
    this.cdaList=[];
    this.currentIndex=index;
    this.currentEntry=li;
    let sum:number=0;
    for(let cda of li.cdaParkingListData){
      sum=sum+Number(cda.remainingCdaAmount);
      let entry:MultiCdaParking={
        id: undefined,
        cdaParkingUnit: cda.ginNo,
        amount: undefined,
        balance: cda.remainingCdaAmount,
        oldData: undefined
      };
      // this.cdaList.push(entry);
    }
    this.addNewRow();
    debugger;
  }

  checkRemaining(li:any) {
    let sum =0;
    for(let cda of li.cdaParkingListData){
      sum=sum+Number(cda.remainingCdaAmount);
    }
    if(li.cdaParkingListData.length>0&&(Number(li.allocationAmount)<(Number(li.allocationAmountBackup)-Number(sum)))){
      this.common.faliureAlert('Amount less than remaining','Amount should be atleast '+ Number(Number(li.allocationAmountBackup)-Number(sum)).toFixed(4),'');
      li.allocationAmount=undefined;
    }
    else{
      this.parking=Number(li.allocationAmount)-Number(li.allocationAmountBackup)+Number(sum);
      this.totalParking=this.parking;
    }

    debugger;
  }

  updateCdaPark() {
    this.cdaList;
    this.currentEntry;
    debugger;
    let cdaReq:any[]=[];
    for(let cda of this.cdaList) {
      let cdaRequest = {
        budgetFinancialYearId:this.currentEntry.finYear.serialNo,
        allocationTypeID: this.currentEntry.allocTypeId.allocTypeId,
        ginNo: cda.cdaParkingUnit.ginNo,
        budgetHeadId: this.currentEntry.subHead.budgetCodeId,
        availableParkingAmount: cda.amount.toString(),
        remark: undefined,
        authGroupId: this.currentEntry.authGroupId,
        transactionId: this.currentEntry.transactionId,
        amountTypeId: this.currentEntry.amountUnit.amountTypeId
      }

      cdaReq.push(cdaRequest);
    }
      let json={
        budgetFinancialYearId:this.currentEntry.finYear.serialNo,
        allocationTypeId:this.currentEntry.allocTypeId.allocTypeId,
        amountTypeId:this.currentEntry.amountUnit.amountTypeId,
        budgetHeadId:this.currentEntry.subHead.budgetCodeId,
        allocationAmount:this.currentEntry.allocationAmount,

        alterAmount:(Number(this.currentEntry.allocationAmount)-Number(this.currentEntry.allocationAmountBackup)).toString(),

        cdaRequest:cdaReq
      }
      this.apiService
        .postApi(this.cons.api.updateRecipetSave, json)
        .subscribe({
          next: (v: object) => {
            this.SpinnerService.hide();
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.getBudgetRecipt();
              this.updateInbox();
              this.common.successAlert('Success', 'Successfully Updated', '');
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
