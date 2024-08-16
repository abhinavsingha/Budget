import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared/shared.service";

class InboxList {
  fromUnit: any;
  isType: string | undefined;
  serial: number | undefined;
  type: undefined;
  createDate: string | undefined | null;
  unitName: string | undefined;
  groupId: string | undefined;
  status: string | undefined;
  unit_sub: any;
}


@Component({
  selector: 'app-approved',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  list: any;
  inboxList: any[] = [];
  isShow = false;
  p: number = 1;
  searchKey: string = '';
  private authDocPath: any;

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private common: CommonService,
    private router: Router,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.sharedService.updateInbox();
    this.getApproved();

  }

  redirect(entry: any) {
    // debugger;
    this.sharedService.isRevision = entry.isRevision;
    localStorage.setItem('isInboxOrOutbox', 'approved');
    this.sharedService.redirectedFrom = 'approved';
    localStorage.setItem('type', entry.isType);
    localStorage.setItem('group_id', entry.groupId);
    this.sharedService.sharedValue = entry.groupId;
    this.sharedService.redirectedFrom = 'approved';
    if (entry.type == 'BG' || entry.type == 'BR' || entry.type == 'BGR') {
      if (entry.isType == 'Budget Revision' || entry.isType == 'Budget Revised By Lower Unit') {
        this.sharedService.revisionStatus = entry.status;
        if (entry.isType == 'Budget Revision'){
          localStorage.setItem('notification','false');
          localStorage.setItem('move', '0');
        }
        else if (entry.isType == 'Budget Revised By Lower Unit') {
          localStorage.setItem('notification','true');
          localStorage.setItem('move', '1');
          this.sharedService.msgId = entry.mangeInboxId;
        }
        this.router.navigate(['/revision-approval']);
      }
      else{
        localStorage.setItem('notification','false');
        this.router.navigate(['/budget-approval']);

      }


    } else if (entry.isType == 'Lower Unit Budget Allocation') {
      localStorage.setItem('notification','true');
      debugger;
      if (entry.status == 'Approved') {

        this.sharedService.reject = false;
        this.router.navigate(['/budget-approved']);
      } else if (entry.status == 'Fully Approved') {
        this.sharedService.reject = false;
        this.router.navigate(['/budget-approval']);
      } else if (entry.status == 'Pending') {
        this.sharedService.reject = false;
        this.router.navigate(['/budget-approval']);
      } else if (entry.status == 'Rejected') {
        this.sharedService.msgId = entry.mangeInboxId;
        this.sharedService.reject = true;
        this.router.navigate(['/budget-approval']);

      }
    } else if (entry.type == 'RR') {
      this.router.navigate(['/budget-rebase']);
    } else if (entry.isType == 'CDA Update') {
      localStorage.setItem('cdaType', 'update');
      this.sharedService.sharedValue = entry.groupId;
      this.sharedService.msgId = entry.mangeInboxId;
      localStorage.setItem('cdaUnitId', entry.fromUnit.unit);
      this.router.navigate(['/cda-parking-history']);
    } else if (entry.isType == 'CDA Parked') {
      localStorage.setItem('cdaType', 'entry');
      this.sharedService.sharedValue = entry.groupId;
      this.sharedService.msgId = entry.mangeInboxId;
      this.router.navigate(['/cda-parking-history']);
      localStorage.setItem('cdaUnitId', entry.fromUnit.unit);
    } else
      this.router.navigate(['/contingent-bill-aprover'])
  }

  getAuthDoc(entry: any) {
    // debugger;
    this.apiService.getApi(this.cons.api.getApprovedFilePath + '/' + entry.groupId + '/' + entry.type).subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.SpinnerService.hide();
          this.authDocPath = result['response'].uploadID;
          this.viewFile(this.authDocPath);
          // console.log('success');
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
    );
  }

  viewFile(file: string) {
    this.apiService
      .getApi(this.cons.api.fileDownload + file)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          if (result['message'] == 'success') {
            this.openPdfUrlInNewTab(result['response'].pathURL);
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
    const date = new Date(epochTime); // Convert epoch time to millisecond
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month starts from 0 in JavaScript
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  search() {

  }

  private getApproved() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.archiveListMain).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list = result['response'].archivedList;
        if (list.length > 0) {
          let isType = '';
          for (let i = 0; i < list.length; i++) {
            if (list[i].isBgOrCg == "BG") {
              if (list[i].remarks == "Budget Revision")
                isType = 'Budget Revision';
              else
                isType = 'Budget Allocation';
            } else if (list[i].isBgOrCg == "BR") {
              isType = 'Budget Receipt';
            } else if (list[i].isBgOrCg == "CB") {
              isType = 'Contingent Bill';
            } else if (list[i].isBgOrCg == "CDA") {
              isType = 'CDA Update';
            } else if (list[i].isBgOrCg == "CDAI") {
              isType = 'CDA Parked';
            } else if (list[i].isBgOrCg == "SBG") {
              isType = 'Lower Unit Budget Allocation';
            } else if (list[i].isBgOrCg == "BGR") {
              isType = 'Budget Revised By Lower Unit';
            }else if (list[i].isBgOrCg == "UR") {
              isType = 'Budget Revised';
            }else if (list[i].isBgOrCg == "RR") {
              isType = 'Budget Rebase';
            }
            const entry: InboxList = {
              serial: i + 1,
              isType: isType,
              // createDate: this.convertEpochToDateTime(list[i].createdOn),
               // New CerateDate function is added to sort the date as DD-MM-YYYY format 
               createDate: formatDateTime(this.convertEpochToDateTime(list[i].createdOn)), // Custom formatting function
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
              status: list[i].status,
              type: list[i].isBgOrCg,
              unit_sub: list[i].type,
              fromUnit: list[i].fromUnit
            };
            this.inboxList.push(entry);
          }
        }
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });

    // New Function for showing the date format as DD-MM-YYYY.
    // Function to format date and time
    function formatDateTime(dateTimeStr: string) {
      // Separate the date and time parts
      const [datePart, timePart] = dateTimeStr.split(' ');
      
      // Split the date part
      const [year, month, day] = datePart.split('-');
      
      // Format the date as dd-mm-yyyy
      const formattedDate = `${day}-${month}-${year}`;
      
      // Combine the formatted date with the time part
      return `${formattedDate} ${timePart}`;
    }
  }
}
