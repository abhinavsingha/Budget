import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';

import { KeycloakService } from 'keycloak-angular';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  name: any;

  roles: any[] = [];

  userDetails: any = {};

  parseData: any;

  roleHeading: any;

  unitName: any;

  rank: any;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    let nr = localStorage.getItem('userDetails');

    // if (nr != null) {
    //   this.userDetails = JSON.parse(nr);
    //   this.name = this.userDetails.fullName;
    //   this.roles = this.userDetails.role;
    //   this.roleHeading = this.roles[0].roleName;
    // }
    // debugger;

    this.getDashBoardDta();
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private keycloakService: KeycloakService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  changeRole(role: any) {
    if (role.roleName != this.roleHeading) {
      this.confirmModel(role);
    }
  }

  confirmModel(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to switch the role...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(data);
      }
    });
  }

  finallySubmit(data: any) {
    // this.SpinnerService.show();
    var newSubmitJson = data;

    this.apiService
      .getApi(this.cons.api.getUiData + '/' + data.roleId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          localStorage.removeItem('user_role');
          localStorage.setItem('user_role', data.roleName);
          this.roleHeading = data.roleName;
          this.sharedService.roleHeading = this.roleHeading;
          // console.log(this.roleHeading);
          this.router.navigate(['/dashboard']);
          window.location.reload();
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
    // debugger;
    // this.apiService
    //   .postApi(this.cons.api.updateBudgetAllocation, newSubmitJson)
    //   .subscribe({
    //     next: (v: object) => {
    //       this.SpinnerService.hide();
    //       let result: { [key: string]: any } = v;
    //       if (result['message'] == 'success') {
    //         // this.common.successAlert(
    //         //   'Success',
    //         //   result['response']['msg'],
    //         //   'success'
    //         // );

    //         // this.budgetListData[this.mainIndexValue].allocationAmount =
    //         //   this.changeRevisedAmount;
    //         // this.updateBudgetFormData.reset();
    //       } else {
    //         this.common.faliureAlert('Please try later', result['message'], '');
    //       }
    //     },
    //     error: (e) => {
    //       this.SpinnerService.hide();
    //       console.error(e);
    //       this.common.faliureAlert('Error', e['error']['message'], 'error');
    //     },
    //     complete: () => console.info('complete'),
    //   });
  }

  logout() {
    // this.confirmModelForLogout(null);

    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
    this.keycloakService.logout();
  }

  confirmModelForLogout(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Logout...!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallyLogout();
      }
    });
  }

  finallyLogout() {
    localStorage.removeItem('token');
    this.keycloakService.logout();
  }

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
            // this.userDetails = JSON.parse(nr);
            debugger;
            // let userDetailsString: {} = result['response'].userDetails.;

            this.name = result['response'].userDetails.fullName;
            this.roles = result['response'].userDetails.role;
            this.roleHeading = result['response'].userDetails.role[0].roleName;
            this.sharedService.roleHeading = this.roleHeading;
            this.unitName = result['response'].userDetails.unit;
            this.rank = result['response'].userDetails.rank;
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
