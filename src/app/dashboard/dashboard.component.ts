import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {ConstantsService} from '../services/constants/constants.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CommonService} from '../services/common/common.service';
import {ApiCallingServiceService} from '../services/api-calling/api-calling-service.service';
import Swal from 'sweetalert2';

import {FormControl, FormGroup,} from '@angular/forms';
import {ChartConfiguration} from 'chart.js';
import {SharedService} from '../services/shared/shared.service';
import {KeycloakService} from "keycloak-angular";
import * as readline from "readline";

class UnitWiseExpenditureList {
  unit: any;
  financialYear: any;
  subhead: any;
  allocated: any;
  expenditure: any;
  lastCbDate: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'ng2-charts-demo';
  public showUnitGraph:boolean=false;
  public showSubheadGraph:boolean=false;

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };


  public barChartDataUnitwise: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'RHQ1', 'RHQ2', 'RHQ3', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 50, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 50, 48, 40, 19, 86, 27, 500 ], label: 'Series B' }
    ]
  };








  budgetFinYears: any[] = [];
  Units: any[] = [];
  subHeads: any[] = [];

  dasboardData: any;
  unitWiseExpenditureList: UnitWiseExpenditureList[] = [];

  allunits: any[] = [];

  budgetListData: any[] = [];

  submitted = false;
  q:number=1;
  p: number = 1;
  length: number = 0;
  userAuthorised:boolean=false;
  formdata = new FormGroup({
    majorHead:new FormControl(),
    rupeeUnit:new FormControl(),
    finYear: new FormControl(),
    subHead: new FormControl(),
    unit: new FormControl(),
    subHeadType: new FormControl(),
    allocationType: new FormControl(),
  });

  updateBudgetFormData = new FormGroup({
    transactionId: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    minorHead: new FormControl(),
    fundAvailable: new FormControl(),
    preAllocation: new FormControl(),
    allocationType: new FormControl(),
    revisedAmount: new FormControl(),
    balanceFund: new FormControl(),
  });
  private unitId: any;
  subHeadType: any;
  tableData: any;
  amountType :any;
  amountUnits :any;
  amountUnit :any;
   subHeadsResponse: any;
  selectedSubhead: any;
  allocationType2: any[]=[];

  ngOnInit(): void {
    // ngOnInit(): void {
    debugger;
    this.userExit();

    $.getScript('assets/main.js');
  }
  constructor(
    private keycloakService: KeycloakService,
    public sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private common: CommonService,
  ) {}
  // vaibhav

  async getBudgetFinYear() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getBudgetFinYear)).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  unitwiseUnit='';
  subheadwiseUnit='';

  async userExit() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.userExit)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          if (result['response']) {
            this.userAuthorised=true;
            this.getMajorDataNew();
            this.getDashBoardDta();
            this.getCgUnitData();
            this.getBudgetFinYear();
            this.getSubHeadsData();
            this.getinbox();
            this.getSubHeadType();
            this.getAllocationTypeData();
            this.getAmountType();
          } else {
            this.redirectUri();
          }
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

  async getAmountType() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.showAllAmountUnit)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountType = result['response'];
          this.amountUnits = this.amountType[0];
          this.amountUnit = this.amountUnits.amountType;
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

  async getCgUnitData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getCgUnitHierarchy)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allunits = result['response'];
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

  async getAllCgUnitData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getAllCgUnitData)).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  async getSubHeadsData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getSubHeadsData)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.subHeads = result['response'];
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

  async getDashBoardDta() {
    this.SpinnerService.show();

    (await this.apiService.postApi(this.cons.api.getDashBoardDta, null)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.setAllocationType(result['response'].budgetFinancialYear);
          this.sharedService.dashboardData = result['response'];
          this.dasboardData = result['response']; //
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
            // this.getCgUnitData();
          var roles = result['response'].userDetails.role[0].roleName;
          if (localStorage.getItem('user_role') != roles) {
            window.location.reload();
          }
          localStorage.setItem('user_role', roles);
          localStorage.removeItem('defautAllocationType');
          localStorage.setItem(
            'defautAllocationType',
            this.dasboardData.allocationType.allocType
          );
          this.sharedService.finYear = result['response'].budgetFinancialYear;
          if (this.sharedService.finYear != undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

          if (this.dasboardData.unitWiseExpenditureList != undefined) {
            for (
              let i = 0;
              i < this.dasboardData.unitWiseExpenditureList.length;
              i++
            ) {
              const dataEntry: UnitWiseExpenditureList = {
                unit: this.dasboardData.unitWiseExpenditureList[i].unit.descr,
                financialYear:
                  this.dasboardData.unitWiseExpenditureList[i].financialYearId
                    .finYear,
                subhead:
                  this.dasboardData.unitWiseExpenditureList[i].subHead
                    .subHeadDescr,
                allocated:
                  this.dasboardData.unitWiseExpenditureList[i].allocatedAmount,
                expenditure: 0,
                lastCbDate:
                  this.dasboardData.unitWiseExpenditureList[i].lastCBDate,
              };
              this.unitWiseExpenditureList.push(dataEntry);
            }
          }
          this.unitId = result['response'].userDetails.unitId;
          if (this.unitId == '001321') {
            this.getAllCgUnitData();
          }
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

  async redirectUri() {
    this.common.warningAlert(
      'Warning',
      'You are not authorized to access this application...!',
      'warning'
    );
    await this.waitWithAsync(2000); // Wait for 2 seconds
    localStorage.removeItem('userCurrentUnit');
    localStorage.removeItem('userCurrentUnitName');
    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
    this.keycloakService.logout();
    window.location.replace(this.cons.serverRedirectUrl);
    return;
  }

  async waitWithAsync(milliseconds: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
  }

  async getinbox() {
    this.SpinnerService.show();

    (await this.apiService.getApi(this.cons.api.updateInboxOutBox)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
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

  async searchData() {
    this.unitWiseExpenditureList = [];
    this.SpinnerService.show();

    (await this.apiService.postApi(this.cons.api.getDashBoardDta, null)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.dasboardData = result['response'];
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          if(this.dasboardData.unitWiseExpenditureList!=undefined){
            for (
              let i = 0;
              i < this.dasboardData.unitWiseExpenditureList.length;
              i++
            ) {
              const dataEntry: UnitWiseExpenditureList = {
                unit: this.dasboardData.unitWiseExpenditureList[i].unit.descr,
                financialYear:
                this.dasboardData.unitWiseExpenditureList[i].financialYearId
                  .finYear,
                subhead:
                this.dasboardData.unitWiseExpenditureList[i].subHead
                  .subHeadDescr,
                allocated:
                this.dasboardData.unitWiseExpenditureList[i].allocatedAmount,
                expenditure: 0,
                lastCbDate:
                this.dasboardData.unitWiseExpenditureList[i].lastCBDate,
              };

              this.unitWiseExpenditureList.push(dataEntry);
            }
            for (let i = 0; i < this.unitWiseExpenditureList.length; i++) {
              if (
                this.formdata.get('finYear')?.value.finYear !=
                this.unitWiseExpenditureList[i].financialYear ||
                this.formdata.get('unit')?.value.descr !=
                this.unitWiseExpenditureList[i].unit ||
                this.formdata.get('subHead')?.value.subHeadDescr !=
                this.unitWiseExpenditureList[i].subhead
              ) {
                this.unitWiseExpenditureList.pop();
              }
            }
          }
          // console.log('DATA>>>>>>>'+this.dasboardData);
          // this.draw();
          this.SpinnerService.hide(); // ;
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



  confirmRedirectModel() {
    Swal.fire({
      title: 'You are not authorized..!',
      text: 'Please contact to System Admin.',
      icon: 'warning',
      // showCancelButton: true,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.redirectUri();
      }
    });
  }

  confirmModel(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(data);
      }
    });
  }

  async finallySubmit(data: any) {
    this.SpinnerService.show();
    (await this.apiService
      .postApi(this.cons.api.getDashBoardDta, data))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();

          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.sharedService.archive = result['response'].archived;
            this.sharedService.approve = result['response'].approved;
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.budgetListData[this.mainIndexValue].allocationAmount =
              this.changeRevisedAmount;
            this.updateBudgetFormData.reset();
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
  mainIndexValue: any;

  changeRevisedAmount: any;

  updateBudgetAllocationFund(updateBudgetFormDataValue: any) {
    // this.budgetListData.splice(index, 1);

    this.changeRevisedAmount = updateBudgetFormDataValue.revisedAmount;

    let submitJson = {
      transactionId: updateBudgetFormDataValue.transactionId,
      amount: updateBudgetFormDataValue.revisedAmount,
    };

    this.confirmModel(submitJson);
  }

  async getSubHeadType() {
    (await this.apiService.getApi(this.cons.api.getSubHeadType)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.subHeadType = result['response'];
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

  async getTableData(formDataValue: any) {

    this.SpinnerService.show();
    this.tableData=undefined;
    (await this.apiService
      .getApi(
        this.cons.api
          .getSubHeadWiseExpenditureByUnitIdFinYearIdAllocationTypeIdSubHeadTypeId +
        '/' +
        formDataValue.unit.unit +
        '/' +
        formDataValue.finYear.serialNo +
        '/' +
        formDataValue.subHeadType.subHeadTypeId +
        '/' +
        formDataValue.allocationType.allocTypeId + '/' + formDataValue.rupeeUnit.amountTypeId + '/' + formDataValue.majorHead.majorHead
      ))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.tableData = result['response'][0].grTotalObjResp;
            this.totalUAllocated=result['response'][0].sumAlloc;
            this.totalUBalance=result['response'][0].sumBal;
            this.totalUExpenditure=result['response'][0].sumExp;
            this.totalUExpenditurePer=result['response'][0].perBal;
            if(this.tableData[0]!=undefined)
              this.unitwiseUnit=this.tableData[0].amountIn;
            this.showUnitGraph=true;
            this.setUnitWiseGraph(this.tableData);

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

  allocationType: any[] = [];
  majorDataNew: any[] = [];
  totalUAllocated: any;
  totalUExpenditure: any;
  totalUBalance: any;
  totalUExpenditurePer: any;
  totalSAllocated: any;
  totalSExpenditure: any;
  totalSBalance: any;
  totalSExpenditurePer: any;

  async getMajorDataNew() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getMajorData)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.majorDataNew = result['response'].subHead;
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

  async getAllocationTypeData() {
    this.SpinnerService.show();
    (await this.apiService.getApi(this.cons.api.getAllocationTypeData)).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
          this.allocationType2=result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
        //
        // if (e['status'] == '401') {
        //   this.redirectUri();
        // }
      },
      complete: () => console.info('complete'),
    });
  }

  async getSubHead(formdata: any) {
    this.SpinnerService.show();
    let json={
      majorHead:formdata.majorHead.majorHead,
      budgetHeadType:formdata.subHeadType.subHeadTypeId
    };
    let url =this.cons.api.getAllSubHeadByMajorHead;
    (await this.apiService.postApi(url, json)).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        this.subHeads = result['response'];
        this.SpinnerService.hide();
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  async getSubheadWiseTableData(formdata: any) {
    this.selectedSubhead=formdata.subHead;
    this.subHeadsResponse=undefined;
    let json={
      subHeadId:formdata.subHead.budgetCodeId,
      finYearId:formdata.finYear.serialNo,
      allocationTypeId:formdata.allocationType.allocTypeId,
      amounttypeId:formdata.rupeeUnit.amountTypeId
    }
    let url =this.cons.api.getDashBordSubHeadwiseExpenditure;
    debugger;
    (await this.apiService.postApi(url, json)).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        debugger;
        this.subHeadsResponse = result['response'][0].grTotalObj;
        this.totalSAllocated=result['response'][0].sumAlloc;
        this.totalSBalance=result['response'][0].sumBal;
        this.totalSExpenditure=result['response'][0].sumExp;
        this.totalSExpenditurePer=result['response'][0].perBal;
        this.subheadwiseUnit=this.subHeadsResponse[0].amountIn;
        this.showSubheadGraph=true;
        this.setSubheadWiseGraph(this.subHeadsResponse);
        this.SpinnerService.hide();
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );

  }

  onPageChange2(event: any) {
    this.q = event.page;
  }

  private setUnitWiseGraph(resultElement: any) {
    let headName:string[]=[];
    let allocation:number[]=[];
    let expenditure:number[]=[];
    for(let entry of resultElement){
      if(Number(entry.allocatedAmount)==0)
        continue;
      headName.push(entry.budgetHead.subheadShort);
      allocation.push(Number(entry.allocatedAmount.replaceAll(',','')));
      expenditure.push(Number(entry.expenditureAmount.replaceAll(',','')));
    }

    this.barChartDataUnitwise= {
      labels: headName,
      datasets: [
        { data: allocation, label: 'Allocation',backgroundColor: '#0b5394', },
        { data: expenditure, label: 'Expenditure',backgroundColor: '#7f0000', }
      ]
    };

  }

  private setSubheadWiseGraph(subHeadsResponse: any) {
    let unitName:string[]=[];
    let allocation:number[]=[];
    let expenditure:number[]=[];
    debugger;
    // const x:string="123,345";
    //
    for(let entry of subHeadsResponse){
      if(Number(entry.allocatedAmount)==0){
        continue;
      }
      unitName.push(entry.unitNameShort);
      // unitName.push(entry.unitName);

      allocation.push(Number(entry.allocatedAmount.replaceAll(',','')));
      expenditure.push(Number(entry.expenditureAmount.replaceAll(',','')));
    }

    this.barChartData= {
      labels: unitName,
      datasets: [
        { data: allocation, label: 'Allocation',backgroundColor: '#0b5394', },
        { data: expenditure, label: 'Expenditure',backgroundColor: '#7f0000', }
      ]

    };

  }

  private setAllocationType(finYear:any) {
    this.allocationType=[]
    for(let allocation of this.allocationType2){
      if(finYear.serialNo==allocation.finYear){
        this.allocationType.push(allocation);
      }
    }

  }

  stAllocationType() {
    for(let finyear of this.budgetFinYears){
      if(this.formdata.get('finYear')?.value.serialNo==finyear.serialNo){
        this.setAllocationType(finyear);
      }
    }
  }

  protected readonly localStorage = localStorage;
}
