import {Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConstantsService} from '../services/constants/constants.service';
import {ApiCallingServiceService} from '../services/api-calling/api-calling-service.service';
import {CommonService} from '../services/common/common.service';
import {SharedService} from '../services/shared/shared.service';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-approved-rebase',
  templateUrl: './approved-rebase.component.html',
  styleUrls: ['./approved-rebase.component.scss'],
})
export class ApprovedRebaseComponent implements OnInit {
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  type: any = '';
  p: number = 1;

  formdata = new FormGroup({
    file: new FormControl(),
    date: new FormControl(),
    authority: new FormControl(),
    authUnit: new FormControl(),
    remarks: new FormControl(),
    reportType: new FormControl('Select Report Type')
  });

  isInboxAndOutbox: any;
  unitData: any;
  invoice: any;
  rebaseData: any;
  public userRole: any;

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    public sharedService: SharedService,
    private router: Router,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.sharedService.updateInbox();
    // this.getCgUnitData();
    if (
      localStorage.getItem('isInboxOrOutbox') != null ||
      localStorage.getItem('isInboxOrOutbox') != undefined
    ) {
      this.isInboxAndOutbox = localStorage.getItem('isInboxOrOutbox');
    }
    if (
      localStorage.getItem('type') != null ||
      localStorage.getItem('type') != undefined
    ) {
      this.type = localStorage.getItem('type');
    }
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }

  getDashBoardDta() {
    this.SpinnerService.show();
    var newSubmitJson = null;
    this.apiService
      .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.userRole = result['response'].userDetails.role[0].roleName;
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.sharedService.archive = result['response'].archived;
            this.sharedService.approve = result['response'].approved;
            this.getCgUnitData();
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
  }

  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.unitData = result['response'];
        this.getUnitRebaseNotificationData(localStorage.getItem('group_id'))
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  private getUnitRebaseNotificationData(item: string | null) {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getUnitRebaseNotificationData + '/' + item).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.rebaseData = result['response'];
        for (let li of this.rebaseData) {
          li.dateOfRebase = this.datePipe.transform(
            new Date(li.dateOfRebase),
            'dd/MM/yyyy'
          );
          if (li.lastCbDate != null) {
            li.lastCbDate = this.datePipe.transform(
              new Date(li.lastCbDate),
              'dd/MM/yyyy'
            );
          } else {
            li.lastCbDate = '';
          }
        }
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

    protected readonly localStorage = localStorage;
}
