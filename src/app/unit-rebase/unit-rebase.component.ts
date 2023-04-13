import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unit-rebase',
  templateUrl: './unit-rebase.component.html',
  styleUrls: ['./unit-rebase.component.scss'],
})
export class UnitRebaseComponent {
  budgetFinYears: any[] = [];

  allCBUnits: any[] = [];

  budgetListData: any[] = [];

  allStationsList: any[] = [];

  p: number = 1;

  uploadFileResponse: any;

  formdata = new FormGroup({
    finYear: new FormControl(),
    toUnit: new FormControl(),
  });

  formdataForToStation = new FormGroup({
    toStation: new FormControl(),
    occDate: new FormControl(),
    authUnit: new FormControl(),
    authority: new FormControl(),
    date: new FormControl(),
  });

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.getAllStation();
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

  getAllStation() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.getAllStation).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allStationsList = result['response'];
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

  budgetListDataIndexValue: any;
  deleteSelectedBudget(index: any, unitId: any, transactionId: any) {
    this.budgetListDataIndexValue = index;

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

    this.apiService.postApi(this.cons.api.saveRebase, newSubmitJson).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
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

  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  uploadFile() {
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

  finallySubmitUnitRebase(formdata: any, formdataForToStation: any) {
    let submitJson = {
      budgetFinanciaYearId: formdata.finYear.serialNo,
      toUnitId: formdata.toUnit.cbUnit,
      stationId: formdataForToStation.toStation.stationId,
      occurrenceDate: formdataForToStation.occDate,
      authority: formdataForToStation.authority,
      authDate: formdataForToStation.date,
      authUnitId: formdataForToStation.authUnit.cbUnit,
      authDocId: this.uploadFileResponse.uploadDocId,
    };

    this.confirmModel(submitJson);
  }
}
