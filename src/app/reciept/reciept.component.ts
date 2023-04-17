import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';

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

  ngOnInit(): void {
    this.getBudgetFinYear();
    this.majorDataNew();
    this.getAllocationTypeData();
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

  getAllSubHeadByMajorHead(data: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllSubHeadByMajorHead + '/' + data)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.subHeadList = result['response'];
          for (let i = 0; i < this.subHeadList.length; i++) {
            this.subHeadList[i].be = undefined;
            this.subHeadList[i].re = undefined;
            this.subHeadList[i].ma = undefined;
            this.subHeadList[i].sg = undefined;
            this.subHeadList[i].voa = undefined;
          }

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  majorHeadChange(selectedMajorHead: any) {
    //Step-1 => Auto select Minor-Head
    this.formdata.patchValue({
      minorHead: selectedMajorHead.minorHead,
    });

    // Step-2 => Get all sub head by major head cuz we need to set the sub head in next table
    this.getAllSubHeadByMajorHead(selectedMajorHead.majorHead);
  }

  isSelectedRE: boolean = false;
  isSelectedMA: boolean = false;
  isSectedSG: boolean = false;
  isSectedVOA: boolean = false;

  allocationTypeChange(selectedAllocationType: any) {
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
    } else if (selectedAllocationType.allocType == 'Supplementry Grant') {
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
}
