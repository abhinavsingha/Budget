import { Component, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantsService } from '../services/constants/constants.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { CommonService } from '../services/common/common.service';
import { SharedService } from '../services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approved-budget',
  templateUrl: './approved-budget.component.html',
  styleUrls: ['./approved-budget.component.scss'],
})
export class ApprovedBudgetComponent implements OnInit {
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  budgetDataList: any[] = [];

  type: any = '';

  p: number = 1;

  formdata = new FormGroup({
    file: new FormControl(),
    date: new FormControl(),
    authority: new FormControl(),
    authUnit: new FormControl(),
    remarks: new FormControl(),
  });

  isInboxAndOutbox: any;
  unitData: any;
  invoice: any;
  invoicePath: any;
  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCgUnitData();
    if (
      localStorage.getItem('isInboxOrOutbox') != null ||
      localStorage.getItem('isInboxOrOutbox') != undefined
    ) {
      this.isInboxAndOutbox = localStorage.getItem('isInboxOrOutbox');
    }
    if (
      localStorage.getItem('type') != null ||
      localStorage.getItem('type') != undefined
    ) {
      this.type = localStorage.getItem('type');
    }
    this.getAlGroupId(localStorage.getItem('group_id'));
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }
  public userRole: any;
  getDashBoardDta() {
    this.SpinnerService.show();
    var newSubmitJson = null;
    this.apiService
      .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.userRole = result['response'].userDetails.role[0].roleName;

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
  getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.budgetDataList = result['response'].budgetResponseist;
          if (this.budgetDataList.length > 0) {
            let authGroupId = this.budgetDataList[0].authGroupId;
            this.getAllocationReport(authGroupId);
          }
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  path: any;
  getAllocationReport(authGroupId: any) {
    this.SpinnerService.show();
    debugger;
    this.apiService
      .getApi(this.cons.api.getAllocationReport + '/' + authGroupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        debugger;
        if (result['message'] == 'success') {
          if (result['response'].length > 0) {
            this.path = result['response'][0].path;
          }
          // this.budgetDataList = result['response'].budgetResponseist;

          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  getCgUnitData() {
    this.SpinnerService.show();
    var comboJson = null;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.unitData = result['response'];
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  upload() {
    const file: File = this.invoiceFileInput.nativeElement.files[0];
    console.log(file);
    const formData = new FormData();
    console.log(this.formdata.get('file')?.value);
    formData.append('file', file);
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
          this.invoice = result['response'].uploadDocId;
          this.invoicePath = result['response'].uploadPathUrl;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
          this.SpinnerService.hide();
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => this.SpinnerService.hide(),
    });
  }
  save(formDataValue: any) {
    let newSubmitJson = {
      authDate: formDataValue.date,
      remark: formDataValue.remarks,
      authUnitId: formDataValue.authUnit.unit,
      authDocId: this.invoice,
      authGroupId: localStorage.getItem('group_id'),
    };
    this.apiService
      .postApi(this.cons.api.saveAuthData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          // console.log(JSON.stringify(result) + " =submitJson");

          if (result['message'] == 'success') {
            // this.common.successAlert(
            //   'Success',
            //   result['response']['msg'],
            //   'success'
            // );
            this.router.navigate(['/dashboard']);
            this.getDashBoardDta();
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

  downloadReport() {}
}
