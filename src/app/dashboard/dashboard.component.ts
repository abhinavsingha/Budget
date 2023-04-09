import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';



import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
class UnitWiseExpenditureList{
  unit:any;
  financialYear:any;
  subhead:any;
  allocated:any;
  expenditure:any;
  lastCbDate:any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
  // vaibhav
  budgetFinYears: any[] = [];
  Units: any[] = [];
  subHeads: any[] = [];

dasboardData:any;
unitWiseExpenditureList:UnitWiseExpenditureList[]=[];

  allCBUnits: any[] = [];

  submitted = false;

  p: number = 1;
  length: number = 0;



  formdata = new FormGroup({
    finYear: new FormControl('Select Financial Year', Validators.required),
    subHead: new FormControl(),})






  ngOnInit(): void {

    // ngOnInit(): void {
      this.getBudgetFinYear();
      this.getSubHeadsData();
      this.getCgUnitData();
      this.getDashBoardDta();

    $.getScript('assets/main.js');}
  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}
  // vaibhav




  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }


  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allCBUnits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }


  getSubHeadsData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadsData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.subHeads = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta,null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.dasboardData = result['response'];
          for(let i=0;i<this.dasboardData.unitWiseExpenditureList.length;i++){
            // let unit='';
            // let finyear='';
            // for(let j=0;j<this.allCBUnits.length;j++){
            //   if(this.dasboardData.unitWiseExpenditureList[i].unit==this.allCBUnits[j].unit){
            //     unit=this.allCBUnits[j].descr;
            //   }
            // }
            // for(let j=0;j<this.budgetFinYears.length;j++){
            //   if(this.dasboardData.unitWiseExpenditureList[i].financialYearId==this.budgetFinYears[j].serialNo){
            //     finyear=this.budgetFinYears[j].finYear;
            //   }
            // }
            const dataEntry:UnitWiseExpenditureList= {
              unit: this.dasboardData.unitWiseExpenditureList[i].unit,
              financialYear: this.dasboardData.unitWiseExpenditureList[i].financialYearId,
              subhead: this.dasboardData.unitWiseExpenditureList[i].subHead,
              allocated: this.dasboardData.unitWiseExpenditureList[i].allocatedAmount,
              expenditure: 0,
              lastCbDate: this.dasboardData.unitWiseExpenditureList[i].lastCBDate
            }
            this.unitWiseExpenditureList.push(dataEntry);
          }

          console.log('DATA>>>>>>>'+this.dasboardData);
          this.draw();
          debugger;
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



  draw():void {

    Chart.register(...registerables);
//     const data = {
//       labels: ['OE','SM','WS','OT','DT','RT','PU','PL','AP','MW', 'PS', 'ME', 'IT'],
//       datasets: [{
//         label: 'Expenditure(Lakhs)',
//         backgroundColor: 'rgba(60,141,188,0.9)',
//         borderColor: 'rgba(60,141,188,0.8)',
//         pointRadius: false,
//         pointColor: '#3b8bba',
//         pointStrokeColor: 'rgba(60,141,188,1)',
//         pointHighlightFill: '#fff',
//         pointHighlightStroke: 'rgba(60,141,188,1)',
//         data: [58, 68, 40, 59, 86, 67, 90, 70, 75, 70, 80, 55, 66]
//       },
//     {
//       label: 'Allocated(Lakhs)',
//       backgroundColor: 'rgba(210, 214, 222, 1)',
//       borderColor: 'rgba(210, 214, 222, 1)',
//       pointRadius: false,
//       pointColor: 'rgba(210, 214, 222, 1)',
//       pointStrokeColor: '#c1c7d1',
//       pointHighlightFill: '#fff',
//       pointHighlightStroke: 'rgba(220,220,220,1)',
//       data: [58, 45, 50, 39, 46, 57, 60, 50, 65, 60, 60, 35, 46]
//
//     }
//     ]
// };
    const data = {
      labels: this.dasboardData.subHeadWiseExpenditure.subhead,
      datasets: [{
        label: 'Expenditure(Lakhs)',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: this.dasboardData.subHeadWiseExpenditure.expenditureSubHead
      },
        {
          label: 'Allocated(Lakhs)',
          backgroundColor: 'rgba(210, 214, 222, 1)',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: this.dasboardData.subHeadWiseExpenditure.allocatedSubHead

        }
      ]
    };
const options = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false
  },
  scales: {
    y: {
      beginAtZero: true,
      display: true
    }
  }
}
const config: ChartConfiguration = {
  type: 'bar',
  data: data,
  options: options
}
const chartItem: ChartItem = document.getElementById('my-chart') as ChartItem
new Chart(chartItem, config)



// const data2 = {
//   labels: ['CGHQ','RHQ(W)','RHQ(NW)','RHQ(NE)','RHQ(E)','RHQ(A&N)'],
//   datasets: [{
//     label: 'Expenditure(Lakhs)',
//     backgroundColor: 'rgba(60,141,188,0.9)',
//     borderColor: 'rgba(60,141,188,0.8)',
//     pointRadius: false,
//     pointColor: '#3b8bba',
//     pointStrokeColor: 'rgba(60,141,188,1)',
//     pointHighlightFill: '#fff',
//     pointHighlightStroke: 'rgba(60,141,188,1)',
//     data: [58, 68, 40, 59, 86, 67]
//   },
// {
//   label: 'Allocated(Lakhs)',
//   backgroundColor: 'rgba(210, 214, 222, 1)',
//   borderColor: 'rgba(210, 214, 222, 1)',
//   pointRadius: false,
//   pointColor: 'rgba(210, 214, 222, 1)',
//   pointStrokeColor: '#c1c7d1',
//   pointHighlightFill: '#fff',
//   pointHighlightStroke: 'rgba(220,220,220,1)',
//   data: [38, 45, 50, 39, 46, 57]
//
// }
// ]
// };
    const data2 = {
      labels: this.dasboardData.unitWiseExpenditure.unitWise,
      datasets: [{
        label: 'Expenditure(Lakhs)',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data:this.dasboardData.unitWiseExpenditure.expenditureUnit
      },
        {
          label: 'Allocated(Lakhs)',
          backgroundColor: 'rgba(210, 214, 222, 1)',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: this.dasboardData.unitWiseExpenditure.allocatedUnit

        }
      ]
    };
const options2 = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false
  },
  scales: {
    y: {
      beginAtZero: true,
      display: true
    }
  }
}
const config2: ChartConfiguration = {
  type: 'bar',
  data: data2,
  options: options2
}

const chartItem2: ChartItem = document.getElementById('my-chart2') as ChartItem
new Chart(chartItem2, config2)
}

}
