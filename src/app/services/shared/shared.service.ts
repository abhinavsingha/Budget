import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiCallingServiceService} from "../api-calling/api-calling-service.service";
import {ConstantsService} from "../constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../common/common.service";

@Injectable()
export class SharedService {

  public sharedValue: string|undefined; // Property to hold the shared value
  public redirectedFrom: string|undefined;
  public inbox:any;
  public rejectedBillCount:any;
  public outbox:any;
  public roleHeading: any;
  public status:boolean=false;
  public finYear: any;
  public dashboardData:any;
  private outboxResponse: any;
  public allocationType: any;
  public approve: any;
  public archive: any;
  public isRevision: any;
  public revisionStatus:any;
  public reject: boolean=false;
  public allocationData: any[]=[];
  public msgId: any;
  public userRole: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
  ) {}
  public async inboxOutbox(){
    (await this.apiService.getApi(this.cons.api.updateInboxOutBox)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.outboxResponse=result['response'];
          this.inbox = result['response'].inbox;
          this.outbox = result['response'].outBox;
          this.rejectedBillCount = result['response'].rejectedBillCount;

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
    return this.outboxResponse;
  }
  public async getAllocationTypeData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getAllocationTypeData)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
          this.SpinnerService.hide();
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
    return this.allocationType;
  }

  async updateInbox(){
    (await this.apiService
      .getApi(this.cons.api.updateInboxOutBox))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.inbox = result['response'].inbox;
            this.outbox = result['response'].outBox;
            this.approve=result['response'].approved;
            this.archive=result['response'].archived;
            this.rejectedBillCount=result['response'].rejectedBillCount;
            // console.log(result['response']);
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.info('complete update inbox'),
      });
  }
}
