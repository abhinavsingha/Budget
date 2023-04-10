import { Component, OnInit } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../services/constants/constants.service';
import { DatePipe } from '@angular/common';

class OutboxList {
  serial: number | undefined;
  type: string | undefined;
  createDate: string | undefined | null;
  createBy: string | undefined;
  unitName: string | undefined;
  route: string | undefined;
}
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
})
export class OutboxComponent implements OnInit {
  p: number = 1;
  constructor(
    private datePipe: DatePipe,
    private httpService: ApiCallingServiceService,
    private router: Router,
    private cons: ConstantsService
  ) {}
  outboxList: OutboxList[] = [];
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
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
              createDate: this.datePipe.transform(
                new Date(list[i].createdOn),
                'dd-MM-yyyy'
              ),
              createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              route:
                list[i].isBgOrCg == 'CG'
                  ? '/contingent-bill-aprover'
                  : '/budget-approval',
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
}
