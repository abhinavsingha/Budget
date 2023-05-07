import { Component } from '@angular/core';
import {MultiCdaParking} from "../model/multi-cda-parking";
import * as $ from "jquery";
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared/shared.service";

@Component({
  selector: 'app-revision-approval',
  templateUrl: './revision-approval.component.html',
  styleUrls: ['./revision-approval.component.scss']
})
export class RevisionApprovalComponent {
  constructor(
    // private matDialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    public sharedService: SharedService
  ) {}
  isInboxAndOutbox: any;
  type:any;
  userRole:any;
  budgetDataList:any;
  formdata = new FormGroup({
    finYear:new FormControl(),
    subHead:new FormControl(),
    majorHead:new FormControl(),
    minorHead:new FormControl(),
    allocationType:new FormControl(),
    remarks: new FormControl(),
    authUnit:new FormControl(),
    auth:new FormControl(),
    authDate:new FormControl(),
    doc:new FormControl(),
    returnRemark:new FormControl(),
  });
  finYear: any;
  subHead: any;
  majorHead: any;
  minorHead: any;
  allocationType: any;

  ngOnInit(): void {
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
      this.getAlGroupId(localStorage.getItem('group_id'));
    }
    this.getDashBoardDta();
    $.getScript('assets/js/adminlte.js');
  }
  getAlGroupId(groupId: any) {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAlGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataList = result['response'].budgetResponseist;
          this.finYear=this.budgetDataList[0].finYear;
          this.formdata.get('finYear')?.setValue(this.budgetDataList[0].finYear);
          this.subHead=this.budgetDataList[0].subHead;
          this.formdata.get('subHead')?.setValue(this.budgetDataList[0].subHead);
          this.majorHead=this.budgetDataList[0].subHead;
          this.minorHead=this.budgetDataList[0].subHead;

          this.formdata.get('majorHead')?.setValue(this.budgetDataList[0].subHead);
          this.formdata.get('minorHead')?.setValue(this.budgetDataList[0].subHead);
          this.allocationType=this.budgetDataList[0].allocTypeId;
          this.formdata.get('allocationType')?.setValue(this.budgetDataList[0].allocTypeId);
          this.formdata.get('remarks')?.setValue(this.budgetDataList[0].remarks);



          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
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


}
