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
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import {AuthService} from "../services/auth-service/AuthService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  name: any;

  roles: any[] = [];

  userDetails: any = {};

  parseData: any;

  roleHeading: any;

  unitName: any;

  rank: any;
  private path: any;
  private filename: any;

  ngOnInit(): void {
    this.getDashBoardDta();
    // localStorage.setItem('notification','true');
    // $.getScript('assets/js/adminlte.js');
    // let nr = localStorage.getItem('userDetails');
  }

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private keycloakService: KeycloakService,
    private authService:AuthService,
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

  serverRedirectUrl = this.cons.serverRedirectUrl;

  finallySubmit(data: any) {
    // this.SpinnerService.show();
    var newSubmitJson = data;

    this.apiService
      .getApi(this.cons.api.getUiData + '/' + data.roleId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          localStorage.removeItem('user_role');
          // localStorage.setItem('user_role', data.roleName);
          this.roleHeading = data.roleName;
          this.sharedService.roleHeading = this.roleHeading;
          // console.log(this.roleHeading);

          if (this.router.url == '/dashboard') {
            window.location.reload();
          } else {
            this.router.navigate(['/dashboard']);
          }
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
    // ;
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCurrentUnit');
    localStorage.removeItem('userCurrentUnitName');
    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
    // this.keycloakService.logout();
    this.authService.logout(this.cons.endSessionUrl);
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
            this.roles = result['response'].userDetails.role;
            localStorage.setItem('userRole',this.roles[0].roleId);
            if (this.roles[0].roleId == '113') {
              this.redirectUri();
            }
            this.name = result['response'].userDetails.fullName;
            this.roleHeading = result['response'].userDetails.role[0].roleName;
            this.sharedService.roleHeading = this.roleHeading;
            this.unitName = result['response'].userDetails.unit;
            this.rank = result['response'].userDetails.rank;
            this.sharedService.inbox=result['response'].inbox;
            this.sharedService.outbox=result['response'].outbox;
            this.sharedService.archive=result['response'].archive;
            this.sharedService.approve=result['response'].approve;
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

  redirectUri() {
    this.router.navigate([
      '/https://icg.net.in/auth/realms/icgrms/protocol/openid-connect/logout?redirect_uri=https://icg.net.in/CGBMS/',
    ]);
  }

  downloadManual() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getUserManual).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.path = result['response'].path;
          this.filename = result['response'].filename;
          this.downloadPdf(this.path, this.filename);
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
  downloadPdf(pdfUrl: string, fileName: any): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, fileName);
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }
}
