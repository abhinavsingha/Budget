import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {FormBuilder} from "@angular/forms";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {SharedService} from "../services/shared/shared.service";

class InboxList {
  isType:string|undefined;
  serial: number | undefined;
  type: undefined;
  createDate: string | undefined | null;
  // createBy: string | undefined;
  unitName: string | undefined;
  groupId: string | undefined;
  status: string | undefined;
  type1:any;
}


@Component({
  selector: 'app-approved',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  list: any;
  private authDocPath: any;
  inboxList: any[]=[];
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
  isShow=false;
  showDataTable(){
    this.isShow=true;
  }
  ngOnInit(): void {
    this.sharedService.updateInbox();
   this.getApproved();

  }

  p: number = 1;

  private getApproved() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.inboxlist).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list = result['response'].archivedList;
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
              isType='Budget Receipt';
            }
            else if(list[i].isBgOrCg=="CB"){
              isType='Contingent Bill';
            }
            else if(list[i].isBgOrCg=="CDA"){
              isType='CDA Update';
            }else if(list[i].isBgOrCg=="CDAI"){
              isType='CDA Entry';
            }
            else if(list[i].isBgOrCg=="SBG"){
              isType='Lower Unit Budget Allocation';
            }
            const entry: InboxList = {
              serial: i + 1,
              isType: isType,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
              status: list[i].status,
              type: list[i].isBgOrCg,
              type1: list[i].type
            };
            this.inboxList.push(entry);
          }
        }
        // debugger;
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  // redirect(entry: any) {
  //
  //   // debugger;
  //   localStorage.setItem('isInboxOrOutbox','approved');
  //   localStorage.setItem('type',entry.isType);
  //   this.sharedService.sharedValue = entry.groupId;
  //   this.sharedService.redirectedFrom = 'approved';
  //   this.router.navigate(['/budget-approval']);
  // }
  redirect(entry: any) {
    // debugger;
    this.sharedService.isRevision=entry.isRevision;
    localStorage.setItem('isInboxOrOutbox','approved');
    this.sharedService.redirectedFrom='approved';
    localStorage.setItem('type',entry.isType);
    localStorage.setItem('group_id',entry.groupId);
    this.sharedService.sharedValue = entry.groupId;

    this.sharedService.redirectedFrom = 'approved';
    // debugger;
    if(entry.type=='BG'||entry.type=='BR'){
      if(entry.isType=='Budget Revision')
      {
        this.sharedService.revisionStatus=entry.status;
        this.router.navigate(['/revision-approval']);
      }
      else
        this.router.navigate(['/budget-approval']);

    }
    else if (entry.isType == 'Lower Unit Budget Allocation') {
      debugger;
      if (entry.status == 'Approved') {

        this.sharedService.reject=false;
        this.router.navigate(['/budget-approved']);
      } else if (entry.status == 'Fully Approved') {
        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (entry.status == 'Pending') {
        this.sharedService.reject=false;
        this.router.navigate(['/budget-approval']);
      } else if (entry.status == 'Rejected') {
        this.sharedService.msgId=entry.mangeInboxId;
        this.sharedService.reject=true;
        this.router.navigate(['/budget-approval']);

      }

      // window.location.href = '/budget-approval';
    }
    else if(entry.type=='RR'){
      this.router.navigate(['/budget-rebase']);
      // this.common.successAlert('Rebase','Unit rebase detail','');
    }
    else if (entry.isType == 'CDA Update') {
      localStorage.setItem('cdaType','update');
      this.sharedService.sharedValue =entry.groupId;
      this.sharedService.msgId=entry.mangeInboxId;
      this.router.navigate(['/cda-parking-history']);
    } else if (entry.isType == 'CDA Entry') {
      localStorage.setItem('cdaType','entry');
      this.sharedService.sharedValue =entry.groupId;
      this.sharedService.msgId=entry.mangeInboxId;
      this.router.navigate(['/cda-parking-history']);
    }

    else
      this.router.navigate(['/contingent-bill-aprover'])
  }

  getAuthDoc(entry: any) {
    // debugger;
    this.apiService.getApi(this.cons.api.getApprovedFilePath+'/'+entry.groupId+'/'+entry.type).subscribe((res) => {
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
          if (result['message'] == 'success') {
          this.openPdfUrlInNewTab(result['response'].pathURL);
          // console.log(result['result'].pathURL);
          }
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
