import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
// import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-budget-approver',
  templateUrl: './budget-approver.component.html',
  styleUrls: ['./budget-approver.component.scss'],
})
export class BudgetApproverComponent implements OnInit {
  budgetDataList: any[] = [];

  p: number = 1;

  formdata = new FormGroup({
    remarks: new FormControl(),
  });

  ngOnInit(): void {
    this.getAlGroupId(localStorage.getItem('group_id'));
    $.getScript('assets/js/adminlte.js');
  }

  constructor(
    private matDialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router
  ) {}

  openDialog() {
    // this.matDialog.open(DialogComponent, {
    //   width: '350px',
    // });
  }

  getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.budgetDataList = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  approverConfirmationModel(data: any) {}

  returnConfirmationModel(data: any) {}

  approveForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveFormFinally(formDataValue);
      }
    });
  }

  returnForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Return it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.returnFormFinally(formDataValue);
      }
    });
  }

  approveFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Approved',
      remarks: formDataValue.remarks,
    };
    this.apiService
      .postApi(this.cons.api.approveBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.formdata.reset();
            this.router.navigateByUrl('/inbox');
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

  returnFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let submitJson = {
      authGroupId: this.budgetDataList[0].authGroupId,
      status: 'Rejected',
      remarks: formDataValue.remarks,
    };
    this.apiService
      .postApi(this.cons.api.approveBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.formdata.reset();
            this.router.navigateByUrl('/inbox');
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
