import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { DatePipe } from '@angular/common';
import { SharedService } from '../services/shared/shared.service';
class InboxList {
  serial: number | undefined;
  type: string | undefined;
  createDate: string | undefined | null;
  createBy: string | undefined;
  unitName: string | undefined;
  groupId: string | undefined;
}
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  inboxList: InboxList[] = [];
  p: number = 1;
  constructor(
    private datePipe: DatePipe,
    private apiService: ApiCallingServiceService,
    private router: Router,
    private cons: ConstantsService,
    private sharedService: SharedService
  ) {}
  public userRole: any;
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.userRole = localStorage.getItem('user_role');
    if (this.userRole == 'sys_Admin') {
      this.router.navigateByUrl('/dashboard');
    }
    this.getInboxList();
  }
  redirect(li: InboxList) {

    if (li.groupId != null || li.groupId != undefined) {
      localStorage.setItem('group_id', li.groupId);

    }

    if (li.type == 'CB') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.redirectedFrom = 'inbox';
      this.router.navigate(['/contingent-bill-aprover']);
      // window.location.href =;
    } else if (li.type == 'BG') {
      this.router.navigate(['/budget-approval']);
      this.sharedService.redirectedFrom = 'inbox';
      // window.location.href = '/budget-approval';
    }
  }

  private getInboxList() {
    this.apiService.getApi(this.cons.api.inboxlist).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        console.log(result['response']);
        let list: any = result['response'];
        if (list != null) {
          for (let i = 0; i < list.length; i++) {
            const entry: InboxList = {
              serial: i + 1,
              type: list[i].isBgOrCg,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              //   this.datePipe.transform(
              //   new Date(list[i].createdOn),
              //   'dd-MM-yyyy'
              // ),
              createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              groupId: list[i].groupId,
            };
            this.inboxList.push(entry);
          }
          console.log(this.inboxList);
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
