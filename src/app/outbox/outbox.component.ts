import { Component, OnInit } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../services/constants/constants.service';
import { DatePipe } from '@angular/common';
import {SharedService} from "../services/shared/shared.service";

class OutboxList {
  serial: number | undefined;
  type: string | undefined;
  createDate: string | undefined | null;
  createBy: string | undefined;
  unitName: string | undefined;
  route: string | undefined;
  groupId:  string | undefined;
}
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
})
export class OutboxComponent implements OnInit {
  p: number = 1;
  constructor(
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private httpService: ApiCallingServiceService,
    private router: Router,
    private cons: ConstantsService
  ) {}
  outboxList: OutboxList[] = [];
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getOutboxList();
  }
  redirect(li: OutboxList) {

    if (li.groupId != null || li.groupId != undefined) {
      localStorage.setItem('group_id', li.groupId);

    }

    if (li.type == 'CB') {
      this.sharedService.sharedValue = li.groupId;
      this.sharedService.redirectedFrom = 'outbox';
      this.router.navigate(['/contingent-bill-aprover']);
    } else if (li.type == 'BG') {
      this.router.navigate(['/budget-approval']);
      this.sharedService.redirectedFrom = 'outbox';
    }
  }

  private getOutboxList() {
    this.httpService.getApi(this.cons.api.outboxlist).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        console.log(result['response']);
        let list: any = result['response'];
        if (list != null) {
          for (let i = 0; i < list.length; i++) {
            const entry: OutboxList = {
              serial: i + 1,
              type: list[i].isBgOrCg,
              createDate: this.convertEpochToDateTime(list[i].createdOn),
              createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              route: list[i].isBgOrCg == 'CG'
                ? '/contingent-bill-aprover'
                : '/budget-approval',
              groupId: list[i].groupId
            };
            this.outboxList.push(entry);
          }
          console.log(this.outboxList);
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
