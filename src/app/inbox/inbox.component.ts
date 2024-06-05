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
  isRebase:string|undefined;
  isType:string|undefined;
  serial: number | undefined;
  type: undefined;
  createDate: string | undefined | null;
  // createBy: string | undefined;
  unitName: string | undefined;
  groupId: string | undefined;
  status: string | undefined;
  isCda:any;
  isRevision: any;
  mangeInboxId:any;
  fromUnit:any;
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
    this.sharedService.updateInbox();
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
    if(li.isRebase=='1'){
      this.updateMsgStatusMain(li);
    }
    debugger;
    this.sharedService.isRevision=li.isRevision;
    localStorage.setItem('isInboxOrOutbox', 'inbox');
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
      debugger;
      localStorage.setItem('notification','false');
      if (li.status == 'Approved') {
        this.sharedService.reject=false;

        this.router.navigate(['/budget-approved']);
      } else if (li.status == 'Fully Approved') {

        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Pending') {
        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Rejected') {
        this.sharedService.msgId=li.mangeInboxId;
        this.sharedService.reject=true;
        this.router.navigate(['/budget-approval']);
      }

      // window.location.href = '/budget-approval';
    }
    else if (li.isType == 'Lower Unit Budget Allocation') {
      debugger;
      localStorage.setItem('notification','true');
      this.finallyMoveArchive(li);
      if (li.status == 'Approved') {

        this.sharedService.reject=false;
        this.router.navigate(['/budget-approved']);
      } else if (li.status == 'Fully Approved') {
        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Pending') {
        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (li.status == 'Rejected') {
        this.sharedService.msgId=li.mangeInboxId;
        this.sharedService.reject=true;
        this.router.navigate(['/budget-approval']);

      }

      // window.location.href = '/budget-approval';
    }
    else if (li.isType == 'CDA Update') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.msgId=li.mangeInboxId;
      localStorage.setItem('cdaType','update');
      this.router.navigate(['/cda-parking-history']);
      localStorage.setItem('cdaUnitId',li.fromUnit.unit);
    }
    else if (li.isType == 'CDA Parked') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.msgId=li.mangeInboxId;
      localStorage.setItem('cdaType','entry');
      this.router.navigate(['/cda-parking-history']);
      localStorage.setItem('cdaUnitId',li.fromUnit.unit);
    }
    else if (li.isType == 'Budget Receipt') {
      this.sharedService.msgId=li.mangeInboxId;
      this.sharedService.reject=false;
      this.sharedService.sharedValue = li.groupId;
      this.router.navigate(['/budget-approval']);
      this.sharedService.redirectedFrom = 'inbox';
    }
    else if(li.isType == 'Budget Revision'||li.isType == 'Budget Revised By Lower Unit'){
      if(li.isType == 'Budget Revision'){
        localStorage.setItem('notification','false');
      }else{
        localStorage.setItem('notification','true');
      }
      this.sharedService.revisionStatus=li.status;
      if(li.status=='Fully Approved')
        this.sharedService.status=true;
      if(li.isType == 'Budget Revision')
        localStorage.setItem('move','0');
      else if(li.isType == 'Budget Revised By Lower Unit')
      {
        localStorage.setItem('move','1');
        this.sharedService.msgId=li.mangeInboxId;
      }
      this.router.navigate(['/revision-approval']);

    }
    else if(li.isType=='Budget Rebase'){

      this.router.navigate(['/budget-rebase']);
    }
  }

  private inboxlist() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.inboxListMain).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list: any = result['response'].inboxList;

        if (list.length > 0) {
          let isType='';
          for (let i = 0; i < list.length; i++) {
            isType='';
            if(list[i].isRebase==null){
              list[i].isRebase='0';
            }
            if(list[i].isBgOrCg=="BG"){
              if(list[i].remarks=="Budget Revision")
                isType='Budget Revision';
              else
                isType='Budget Allocation';
            }
            else if(list[i].isBgOrCg=="BR"){
              isType='Budget Receipt';
            }
            else if(list[i].isBgOrCg=="CB"){
              isType='Contingent Bill';
            }
            else if(list[i].isBgOrCg=="RR"){
              isType='Budget Rebase';
            }
            else if(list[i].isBgOrCg=="UR"){
              isType='Budget Revised';
            }else if(list[i].isBgOrCg=="BGR"){
              isType='Budget Revised By Lower Unit';
            }
            else if(list[i].isBgOrCg=="CDA"){
              isType='CDA Update';
            }
            else if(list[i].isBgOrCg=="SBG"){
              isType='Lower Unit Budget Allocation';
            }
            else if(list[i].isBgOrCg=="CDAI"){
              isType='CDA Parked';
            }
            const entry: InboxList = {
              fromUnit:list[i].fromUnit,
              isRebase:list[i].isRebase,
              mangeInboxId: list[i].mangeInboxId,
              isCda: list[i].isCda,
              serial: i + 1,
              isType: isType,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
              status: list[i].status,
              type: list[i].type,
              isRevision: list[i].isRevision,
            };
            this.inboxList.push(entry);
            // debugger;
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
    else if(li.isType=='Budget Receipt')
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

   updateMsgStatusMain(li:any) {
    let msgId=li.mangeInboxId;
    this.apiService
      .getApi(this.cons.api.updateMsgStatusMain +'/'+msgId)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          if (result['message'] == 'success') {
            window.location.reload();
          }
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
     //
  }

  moveApproved(li: InboxList) {
    Swal.fire({
      title: 'Are you sure you want to move to Approved?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallyMoveApprove(li);
      }
    });
  }

  private finallyMoveApprove(li: InboxList) {
    this.apiService
      .getApi(this.cons.api.updateMsgStatusMain +'/'+li.mangeInboxId)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          window.location.reload();
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }

  moveArchive(li: InboxList) {
    Swal.fire({
      title: 'Are you sure you want to move to Approved?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallyMoveArchive(li);
      }
    });

  }

  private finallyMoveArchive(li: InboxList) {
    this.apiService
      .getApi(this.cons.api.moveToArchive +'/'+li.mangeInboxId)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          // window.location.reload();
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
}
