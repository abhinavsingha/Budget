import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared/shared.service";

class InboxList {
  unit_sub: any;
  isType: string | undefined;
  serial: number | undefined;
  type: undefined;
  createDate: string | undefined | null;
  unitName: string | undefined;
  groupId: string | undefined;
  status: string | undefined;
  isCda: boolean = false;
  isRevision: any;
}


@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss']
})
export class ApprovedComponent implements OnInit {
  list: any;
  inboxList: any[] = [];
  p: number = 1;
  searchKey: string = '';
  private authDocPath: any;
  itemsPerPage: any = 20; // Initialize with default value 20

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
    this.sharedService.msgId=undefined;

  }

  redirect(entry: any) {
    localStorage.setItem('notification','false');
    // debugger;
    this.sharedService.isRevision = entry.isRevision;
    localStorage.setItem('isInboxOrOutbox', 'approved');
    this.sharedService.redirectedFrom = 'approved';
    localStorage.setItem('type', entry.isType);
    localStorage.setItem('group_id', entry.groupId);
    this.sharedService.sharedValue = entry.groupId;
    // debugger;
    if (entry.type == 'BG' || entry.type == 'BR') {
      if (entry.isType == 'Budget Revision') {

        this.router.navigate(['/revision-approval']);
      } else
        this.router.navigate(['/budget-approval']);

    } else if (entry.type == 'RR') {
      this.router.navigate(['/budget-rebase']);
      // this.common.successAlert('Rebase','Unit rebase detail','');
    } else
      this.router.navigate(['/contingent-bill-aprover'])
  }

  async getAuthDoc(entry: any) {
    // debugger;
    (await
        // debugger;
        await this.apiService.getApi(this.cons.api.getApprovedFilePath + '/' + entry.groupId + '/' + entry.type)
    ).subscribe((res) => {
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

  async viewFile(file: string) {
    (await this.apiService
      .getApi(this.cons.api.fileDownload + file))
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

  search() {

  }

  private async getApproved() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.approvedListMain)).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        let list = result['response'].approvedList;
        if (list.length > 0) {
          let isType = '';
          for (let i = 0; i < list.length; i++) {
            if (list[i].isBgOrCg == "BG") {
              if (list[i].remarks == "Budget Revision")
                isType = 'Budget Revision';
              else
                isType = 'Budget Allocation';
            } else if (list[i].isBgOrCg == "RR") {
              isType = 'Budget Rebase';
            } else if (list[i].isBgOrCg == "UR") {
              isType = 'Budget Revised';
            } else if (list[i].isBgOrCg == "BR") {
              isType = 'Budget Receipt';
            } else if (list[i].isBgOrCg == "CB") {
              isType = 'Contingent Bill';
            }
            if (list[i].isCda == null) {
              list[i].isCda = true;
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
              unit_sub: list[i].type,
              type: list[i].isBgOrCg,
              isCda: list[i].isCda,
              isRevision: list[i].isRevision
            };
            this.inboxList.push(entry);
          }
        }
        debugger;
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

  protected readonly Number = Number;
    protected readonly localStorage = localStorage;
}
