import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../services/common/common.service';
import Swal from 'sweetalert2';
import { InboxComponent } from '../inbox/inbox.component';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public userRole: any;

  inbox: any;

  outbox: any;

  unitName: any;

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    // this.userRole = localStorage.getItem('user_role');
    // console.log('Role of user == ' + this.userRole);
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload');
    //   location.reload();
    // } else {
    //   localStorage.removeItem('foo');
    //   localStorage.setItem('user_role', 'Admin');
    // }
    console.log('SIDEBAR');
    this.getDashBoardDta();
  }

  constructor(
    public sharedService: SharedService,
    private keycloakService: KeycloakService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
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
            this.userRole = result['response'].userDetails.role[0].roleName;
            this.inbox = result['response'].inbox;
            this.outbox = result['response'].outBox;
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.unitName = result['response'].userDetails.unit;
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
