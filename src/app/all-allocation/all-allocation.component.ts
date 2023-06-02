import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {SharedService} from "../services/shared/shared.service";

@Component({
  selector: 'app-all-allocation',
  templateUrl: './all-allocation.component.html',
  styleUrls: ['./all-allocation.component.scss']
})
export class AllAllocationComponent implements OnInit {
  budgetFinYears: any;
  allocationType: any;
  formdata = new FormGroup({
    finyear: new FormControl()
  });
  index: number=0;
  model:boolean=false;
  allocTypeId: any;
  allocDesc: any;
  createdOn: any;
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
  ngOnInit(): void {
    this.getFinancialYear();
  }
  getAllocationTypeData(formdata:any) {
    debugger;
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllocationByFinYear+'/'+formdata.finyear.serialNo).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.model=true;
          this.allocationType = result['response'];
          for(let alloc of this.allocationType){
            alloc.createdOn=this.convertEpochToDateTime(alloc.createdOn)
          }
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

  getFinancialYear() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    var comboJson = null;
    // console.log(JSON.stringify(comboJson) + ' ======');
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      this.SpinnerService.hide();

      let result: { [key: string]: any } = res;
      this.budgetFinYears = result['response'];
    });
  }

  isSelect(i: number) {
    this.index=i;
    this.allocTypeId=this.allocationType[i].allocTypeId;
    this.allocDesc=this.allocationType[i].allocDesc;
    this.createdOn=this.allocationType[i].createdOn;
  }

  saveData() {
    debugger;
    this.SpinnerService.show();
    let json={
      allocTypeId:this.allocTypeId,
      allocDesc:this.allocDesc
    };
    debugger;
    this.apiService.postApi(this.cons.api.updateAllocation,json).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
         this.common.successAlert('Success','DATA UPDATED SUCCESSFULLY','');
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
  }
}
