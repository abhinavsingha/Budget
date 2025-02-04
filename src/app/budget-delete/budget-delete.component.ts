// import { Component } from '@angular/core';
import { Component } from '@angular/core';
import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-budget-delete',
  templateUrl: './budget-delete.component.html',
  styleUrls: ['./budget-delete.component.scss'],
})
export class BudgetDeleteComponent {
  // budgetFinYears: any[] = [];
  //
  // allunits: any[] = [];
  //
  // budgetListData: any[] = [];
  //
  // p: number = 1;
  //
  // formdata = new FormGroup({
  //   finYear: new FormControl(),
  //   toUnit: new FormControl(),
  // });

  ngOnInit(): void {

    // this.getBudgetFinYear();
    // this.getCgUnitData();
    // $.getScript('assets/main.js');
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  // getBudgetFinYear() {
  //   this.SpinnerService.show();
  //   await this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
  //     let result: { [key: string]: any } = res;
  //     if (result['message'] == 'success') {
  //       this.budgetFinYears = result['response'];
  //       this.SpinnerService.hide();
  //     } else {
  //       this.common.faliureAlert('Please try later', result['message'], '');
  //     }
  //   });
  // }
  //
  // getCgUnitData() {
  //   this.SpinnerService.show();
  //
  //   await this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
  //     let result: { [key: string]: any } = res;
  //     if (result['message'] == 'success') {
  //       this.allunits = result['response'];
  //       this.SpinnerService.hide();
  //     } else {
  //       this.common.faliureAlert('Please try later', result['message'], '');
  //     }
  //   });
  // }
  //
  // searchData(formData: any) {
  //   this.SpinnerService.show();
  //
  //   let submitJson = {
  //     budgetFinancialYearId: formData.finYear.serialNo,
  //     toUnitId: formData.toUnit.unit,
  //     subHead: null,
  //   };
  //
  //   await this.apiService
  //     .postApi(this.cons.api.budgetAllocationReport, submitJson)
  //     .subscribe({
  //       next: (v: object) => {
  //         this.SpinnerService.hide();
  //         let result: { [key: string]: any } = v;
  //
  //         if (result['message'] == 'success') {
  //           this.budgetListData = result['response'];
  //         } else {
  //           this.common.faliureAlert('Please try later', result['message'], '');
  //         }
  //       },
  //       error: (e) => {
  //         this.SpinnerService.hide();
  //         console.error(e);
  //         this.common.faliureAlert('Error', e['error']['message'], 'error');
  //       },
  //       complete: () => console.info('complete'),
  //     });
  // }
  //
  // budgetListDataIndexValue: any;
  // deleteSelectedBudget(index: any, unitId: any, transactionId: any) {
  //   this.budgetListDataIndexValue = index;
  //
  //   let submitJson = {
  //     unitId: unitId,
  //     transactionId: transactionId,
  //   };
  //
  //   this.confirmModel(submitJson);
  // }
  //
  // confirmModel(data: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.finallySubmit(data);
  //     }
  //   });
  // }
  //
  // finallySubmit(data: any) {
  //   this.SpinnerService.show();
  //   var newSubmitJson = data;
  //
  //   await this.apiService
  //     .postApi(this.cons.api.budgetDelete, newSubmitJson)
  //     .subscribe({
  //       next: (v: object) => {
  //         this.SpinnerService.hide();
  //         let result: { [key: string]: any } = v;
  //         if (result['message'] == 'success') {
  //           this.common.successAlert(
  //             'Success',
  //             result['response']['msg'],
  //             'success'
  //           );
  //           this.budgetListData.splice(this.budgetListDataIndexValue, 1);
  //         } else {
  //           this.common.faliureAlert('Please try later', result['message'], '');
  //         }
  //       },
  //       error: (e) => {
  //         this.SpinnerService.hide();
  //         console.error(e);
  //         this.common.faliureAlert('Error', e['error']['message'], 'error');
  //       },
  //       complete: () => console.info('complete'),
  //     });
  // }

  protected readonly localStorage = localStorage;
}
