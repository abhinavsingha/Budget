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
  isType:string|undefined;
  serial: number | undefined;
  type: undefined;
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
import {error} from "jquery";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  public userRole: any;

  inboxList: InboxList[] = [];

  p: number = 1;

  // inboxList: any[] = [];

  ngOnInit(): void {
    localStorage.setItem('isInboxOrOutbox', 'Inbox');
    this.userRole = localStorage.getItem('user_role');
    if (this.userRole == 'sys_Admin') {
      this.router.navigateByUrl('/dashboard');
    }

    this.inboxlist();

    $('#cdaParking').hide();
    $('#btnCda').click(function () {
      $('#cdaParking').show();
    });
    $('.modal').on('hidden.bs.modal', function () {
      $('#cdaParking').hide();
    });
    this.sharedService.status=false;
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
    debugger;
    if (li.groupId != null || li.groupId != undefined) {
      localStorage.setItem('group_id', li.groupId);
    }

    if (li.isType != null || li.isType != undefined) {
      localStorage.setItem('type', li.isType);
    }

    if (li.isType == 'Contingent Bill') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.redirectedFrom = 'inbox';
      if (li.status == 'Pending') {
        this.router.navigate(['/cb-verification']);
      } else if (li.status == 'Verified') {
        this.router.navigate(['/contingent-bill-aprover']);
      }
      else if (li.status == 'Fully Approved'||'Approved') {
        this.router.navigate(['/contingent-bill-aprover']);
      }
      // window.location.href =;
    }
    else if (li.isType == 'Budget Allocation') {
      if (li.status == 'Approved') {
        this.router.navigate(['/budget-approved']);
      } else if (li.status == 'Fully Approved') {
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Pending') {
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Rejected') {
        this.router.navigate(['/budget-approval']);
      }
      // window.location.href = '/budget-approval';
    } else if (li.isType == 'Budget Reciept') {
      this.router.navigate(['/budget-approval']);
      this.sharedService.redirectedFrom = 'inbox';
      // window.location.href = '/budget-approval';
    }else if(li.isType == 'Budget Revision'){
      if(li.status=='Fully Approved')
        this.sharedService.status=true;
      this.router.navigate(['/revision-approval']);
    }
  }

  private inboxlist() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.inboxlist).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list: any = result['response'].inboxList;

        if (list.length > 0) {
          let isType='';
          for (let i = 0; i < list.length; i++) {
            if(list[i].isBgOrCg=="BG"){
              if(list[i].remarks=="Budget Revision")
                isType='Budget Revision';
              else
                isType='Budget Allocation';
            }
            else if(list[i].isBgOrCg=="BR"){
              isType='Budget Reciept';
            }
            else if(list[i].isBgOrCg=="CB"){
              isType='Contingent Bill';
            }
            const entry: InboxList = {
              serial: i + 1,
              isType: isType,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              //   this.datePipe.transform(
              //   new Date(list[i].createdOn),
              //   'dd-MM-yyyy'
              // // ),
              // createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
              status: list[i].status,
              type: list[i].type
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
  authDocPath:any;
  getAuthDoc(li: InboxList) {
    let isType;
    if(li.isType=='Budget Allocation')
      isType='BG';
    else if(li.isType=='Budget Revision')
      isType='BG';
    else if(li.isType=='Budget Reciept')
      isType='BR';
    else
      isType='CB';

    this.apiService.getApi(this.cons.api.getApprovedFilePath+'/'+li.groupId+'/'+isType).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        this.authDocPath=result['response'].uploadID;
        this.viewFile(this.authDocPath);
        // console.log('success');
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    },
    //   error : (e) => {
    //   this.SpinnerService.hide();
    //   console.error(e);
    //   this.common.faliureAlert('Error', e['error']['message'], 'error');
    // }
    //   complete: () => {
    //   console.log("complete");
    // }
  );


  }
  viewFile(file: string) {
    this.apiService
      .getApi(this.cons.api.fileDownload +file)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          this.openPdfUrlInNewTab(result['response'].pathURL);
          // console.log(result['result'].pathURL);
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
}
