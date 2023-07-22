import { Component, DebugElement } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {SharedService} from "../services/shared/shared.service";

@Component({
  selector: 'app-unit-rebase',
  templateUrl: './unit-rebase.component.html',
  styleUrls: ['./unit-rebase.component.scss'],
})
export class UnitRebaseComponent {
  budgetFinYears: any[] = [];

  allunits: any[] = [];

  budgetListData: any[] = [];

  allStationsList: any[] = [];

  p: number = 1;

  uploadFileResponse: any;

  // formdata = new FormGroup({
  //   finYear: new FormControl(),
  //   toUnit: new FormControl(),
  //   fromStation: new FormControl(),
  //   fromUnitDHQ: new FormControl(),
  //   fromUnitRHQ: new FormControl(),
  // });

  formdataForToStation = new FormGroup({
    toStation: new FormControl(),
    occDate: new FormControl(),
    authUnit: new FormControl(),
    authority: new FormControl(),
    date: new FormControl(),
    toUnitDHQ: new FormControl(),
    toUnitRHQ: new FormControl(),
  });
  private dasboardData: any;

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.getAllStation();
    this.getDashBoardDta();
    $.getScript('assets/main.js');
  }

  formdata!: FormGroup;
  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private sharedService: SharedService
  ) {
    this.formdata = formBuilder.group({
      finYear: [null, Validators.required],
      toUnit: [null, Validators.required],
      fromStation: new FormControl(),
      fromUnitDHQ: new FormControl(),
      fromUnitRHQ: new FormControl(),
    });
  }
  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.dasboardData = result['response'];
          // console.log('DATA>>>>>>>' + this.dasboardData);
          this.formdata
            .get('finYear')
            ?.setValue(result['response'].budgetFinancialYear);
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
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
  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        // this.formdata.patchValue({
        //   finYear: this.budgetFinYears[0],
        // });
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllIsShipCgUnitData).subscribe({
      next: (v: object) => {
        debugger;
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allunits = result['response'];
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
      toUnitId: formData.toUnit.unit,
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
      confirmButtonText: 'Yes, Submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(data);
      }
    });
  }

  finallySubmit(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = data;

    this.apiService
      .postApi(this.cons.api.saveUnitRebase, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.getCgUnitData();
            this.getAllStation();
            Swal.fire({
              title: 'Success',
              text: result['response']['msg'],
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
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

  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  viewFile(file: string) {
    this.apiService.getApi(this.cons.api.fileDownload + file).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        this.openPdfUrlInNewTab(result['response'].pathURL);
        // console.log(result['response'].pathURL);
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
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
    var newTableListData: any[] = [];
    for (var i = 0; i < this.tableDataList.length; i++) {
      var stringDate = null;
      if (this.tableDataList[i].lastCbDate != null) {
        var date = new Date(this.tableDataList[i].lastCbDate);
        stringDate =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate();
      }
      newTableListData.push({
        budgetHeadId: this.tableDataList[i].subHead.budgetCodeId,
        allocAmount: this.tableDataList[i].allocatedAmount,
        expAmount: this.tableDataList[i].expenditureAmount,
        balAmount: this.tableDataList[i].remBal,
        amountType: this.tableDataList[i].amountType.amountTypeId,
        allocationTypeId: this.tableDataList[i].allocationType.allocTypeId,
        lastCbDate: stringDate,
      });
    }

    let submitJson = {
      authDate: formdataForToStation.date,
      authDocId: this.uploadFileResponse.uploadDocId,
      authUnitId: formdataForToStation.authUnit.unit,
      authority: formdataForToStation.authority,
      finYear: formdata.finYear.serialNo,
      occurrenceDate: formdataForToStation.occDate,
      rebaseUnitId: formdata.toUnit.unit,
      headUnitId: formdata.fromUnitDHQ,
      frmStationId: formdata.fromStation,
      toStationId: formdataForToStation.toStation.stationId,
      toHeadUnitId: formdataForToStation.toUnitDHQ,
      unitRebaseRequests: newTableListData,
    };
    debugger;
    this.confirmModel(submitJson);
  }

  tooltipFromUnitDHQ: String = '';
  tooltipFromUnitRHQ: String = '';
  selectUnit(data: any) {
    if (data == undefined) {
      this.tooltipFromUnitDHQ = '';
      this.tooltipFromUnitRHQ = '';
      this.formdata.patchValue({
        fromStation: '',
        fromUnitDHQ: '',
        fromUnitRHQ: '',
      });
    }
    this.tooltipFromUnitDHQ = data.cgStation.dhqName;
    this.tooltipFromUnitRHQ = data.cgStation.rhqId;
    this.formdata.patchValue({
      fromStation: data.cgStation.stationName,
      fromUnitDHQ: data.cgStation.dhqName,
      fromUnitRHQ: data.cgStation.rhqId,
    });
  }

  tableDataList: any[] = [];
  showNODataFound: Boolean = true;

  showList(data: any) {
    // ;
    // data.finYear.serialNo;
    // data.toUnit.unit;
    // getAllUnitRebaseData/{finYear}/{unit}
    this.SpinnerService.show();
    debugger;
    this.apiService
      .getApi(
        this.cons.api.getAllUnitRebaseData +
          '/' +
          data.finYear.serialNo +
          '/' +
          data.toUnit.unit
      )
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          debugger;
          if (result['message'] == 'success') {
            this.tableDataList = result['response'];
            this.showNODataFound = false;
          } else {
            this.tableDataList = [];
            this.showNODataFound = true;
            this.common.warningAlert(
              'Data Not Found',
              'No Data Found',
              'warning'
            );
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

  selectToStation(data: any) {
    debugger;
    this.formdataForToStation.patchValue({
      toUnitDHQ: data.dhqName,
      toUnitRHQ: data.rhqId,
    });
  }
}
