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
    $('.collapse').hide();
    $('.collapse2').hide();
    // this.userRole = localStorage.getItem('user_role');
    // console.log('Role of user == ' + this.userRole);
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload');
    //   location.reload();
    // } else {
    //   localStorage.removeItem('foo');
    //   localStorage.setItem('user_role', 'Admin');
    // }
    this.getDashBoardDta();
    $.getScript('assets/plugins/bootstrap/js/bootstrap.bundle.min.js');
    
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

  dropMenu() {
    if ($('.collapse').hasClass('show')) {
      $('.collapse').removeClass('show');
      $('.drop-budget').removeClass('menu-open');
      $('.collapse').hide();
    } else {
      $('.collapse').show();
      $('.collapse').addClass('show');
      $('.drop-budget').addClass('menu-open');
    }
  }

  dropMenuReport() {
    
    if ($('.collapse2').hasClass('show')) {
      $('.collapse2').removeClass('show');
      $('.drop-report').removeClass('menu-open');
      $('.collapse2').hide();
    } else {
      $('.collapse2').show();
      $('.collapse2').addClass('show');
      $('.drop-report').addClass('menu-open');
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
    this.keycloakService.logout();
  }

  unitId: any;
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
            this.sharedService.inbox=result['response'].inbox;
            this.sharedService.outbox=result['response'].outbox;
            this.sharedService.archive=result['response'].archive;
            this.sharedService.approve=result['response'].approve;
            // this.sharedService.inbox = result['response'].inbox;
            // this.sharedService.outbox = result['response'].outBox;
            this.unitName = result['response'].userDetails.unit;
            this.unitId = result['response'].userDetails.unitId;
            localStorage.setItem(
              'userCurrentUnit',
              result['response'].userDetails.unitId
            );
            localStorage.setItem(
              'userCurrentUnitName',
              result['response'].userDetails.unit
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
}
