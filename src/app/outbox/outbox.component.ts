import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { SubHeadWiseUnitList } from '../model/sub-head-wise-unit-list';
import { UploadDocuments } from '../model/upload-documents';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';

import { SharedService } from '../services/shared/shared.service';

class InboxList {
  serial: number | undefined;
  type: string | undefined;
  createDate: string | undefined | null;
  // createBy: string | undefined;
  unitName: string | undefined;
  groupId: string | undefined;
  status: string | undefined;
}

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
})
export class OutboxComponent implements OnInit {
  public userRole: any;

  inboxList: InboxList[] = [];

  p: number = 1;

  ngOnInit(): void {
    localStorage.setItem('isInboxOrOutbox', 'Outbox');

    this.userRole = localStorage.getItem('user_role');
    if (this.userRole == 'sys_Admin') {
      this.router.navigateByUrl('/dashboard');
    }

    this.outboxlist();

    $('#cdaParking').hide();
    $('#btnCda').click(function () {
      $('#cdaParking').show();
    });
    $('.modal').on('hidden.bs.modal', function () {
      $('#cdaParking').hide();
    });
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    private _location: Location,
    private datePipe: DatePipe,
    private sharedService: SharedService
  ) {}

  redirect(li: InboxList) {
    if (li.groupId != null || li.groupId != undefined) {
      localStorage.setItem('group_id', li.groupId);
    }

    if (li.type != null || li.type != undefined) {
      localStorage.setItem('type', li.type);
    }

    if (li.type == 'Contingent Bill') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.redirectedFrom = 'outbox';
      if (li.status == 'Pending') {
        this.router.navigate(['/cb-verification']);
      } else if (li.status == 'Verified') {
        this.router.navigate(['/contingent-bill-aprover']);
      }

      // window.location.href =;
    } else if (li.type == 'Budget Allocation') {
      if (li.status == 'Approved') {
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Fully Approved') {
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Pending') {
        this.router.navigate(['/budget-approval']);
      }
      // this.sharedService.redirectedFrom = 'inbox';
      // window.location.href = '/budget-approval';
    } else if (li.type == 'Budget Allocation') {
      this.router.navigate(['/budget-approval']);
      // this.sharedService.redirectedFrom = 'inbox';
      // window.location.href = '/budget-approval';
    }
  }

  private outboxlist() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.inboxlist).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list: any = result['response'].outList;
        if (list != null) {
          let type='';
          for (let i = 0; i < list.length; i++) {
            if(list[i].isBgOrCg=="BG"){
              type='Budget Allocation';
            }
            else if(list[i].isBgOrCg=="BR"){
              type='Budget Reciept';
            }
            else if(list[i].isBgOrCg=="CB"){
              type='Contingent Bill';
            }
            const entry: InboxList = {
              serial: i + 1,
              type: type,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              //   this.datePipe.transform(
              //   new Date(list[i].createdOn),
              //   'dd-MM-yyyy'
              // // ),
              // createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
              status: list[i].status,
            };
            this.inboxList.push(entry);
          }
        }
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  convertEpochToDateTime(epochTime: number): string {
    const date = new Date(epochTime); // Convert epoch time to milliseconds
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month starts from 0 in JavaScript
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
