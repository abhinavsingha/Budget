import { Component } from '@angular/core';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { BudgetRevisionUnitList } from '../model/budget-revision-unit-list';
import { UploadDocuments } from '../model/upload-documents';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

class tableData {
  checked:boolean=false;
  financialYear:any;
  unit:any;
  subHead:any;
  allocationType:any;
  amount:any;
  revisedAmount:any;

}

class revision {
  budgetFinanciaYearId:any;
  toUnitId:any;
  subHeadId:any;
  amount:any;
  revisedAmount:any;
  allocationTypeId:any;
}

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent {
  budgetFinYears: any[] = [];
  subHeads: any[] = [];
  allunits: any[] = [];
  selectedunits: any[] = [];
  budgetRevisionUnitList: any[] = [];
  allocationType: any[] = [];
  budgetAllocationArray: any[] = [];
  submitted = false;
  p: number = 1;
  length: number = 0;

  formdata = new FormGroup({
    finYear: new FormControl('Select Financial Year', Validators.required),
    subHead: new FormControl(),
    majorHead: new FormControl(),
    minorHead: new FormControl(),
    allocationType: new FormControl(),
    fundAvailable: new FormControl(),
    currentAllocation: new FormControl(),
    balanceFund: new FormControl(),
    remarks: new FormControl('', Validators.required),
    reallocateFund: new FormControl(),
  });
   majorHeadData: any;
   minorHeadData: any;
   allRevisedUnits: any;
   budgetRevisionUnitList2: any[]=[];

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getSubHeadsData();
     this.getCgUnitData();
    this.getNewEmptyEntries();
    this.getUnitDatas();
    this.getMajorHead();
    this.getAvailableFundData();
    this.getAllocationTypeData()
    this.uploadDocuments.push(new UploadDocuments());
    $.getScript('assets/main.js');
  }

  constructor(
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  newFormGroup() {
    this.formdata = new FormGroup({
      finYear: new FormControl('Select Financial Year', Validators.required),
      subHead: new FormControl(),
      majorHead: new FormControl(),
      minorHead: new FormControl(),
      allocationType: new FormControl(),
      fundAvailable: new FormControl(),
      currentAllocation: new FormControl(),
      balanceFund: new FormControl(),
      reallocateFund: new FormControl(),
      remarks: new FormControl('', Validators.required),
    });
  }

  getNewEmptyEntries() {
    this.budgetRevisionUnitList.push(new BudgetRevisionUnitList());
  }

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        this.formdata.patchValue({
          finYear: this.budgetFinYears[0],
        });
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getAvailableFundData() {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAvailableFundData)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.formdata.patchValue({
            fundAvailable: result['response'].fundAvailable,
            reallocateFund: '0.0',
            balanceFund: '0.0',
          });
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

  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  private getMajorHead() {
    // const userJson = {userRoleId: "ICGS Delhi", userName: "kya hai ye", userUnitId: "000015"}
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          localStorage.setItem('newToken', result['response']['token']);
          this.majorHeadData = result['response'].subHead;
          this.minorHeadData = result['response'].subHead;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.log('error');
      },
      complete: () => console.info('complete'),
    });
  }

  getAvailableFund(event: any, formDataValue: any) {
    for(let i=0;i<this.subHeads.length;i++){
      if(this.subHeads[i]==this.formdata.get('subHead')?.value){
        for(let j=0;j<this.majorHeadData.length;j++) {
          if (this.subHeads[i].majorHead == this.majorHeadData[j].majorHead)
            this.formdata.get('majorHead')?.setValue(this.majorHeadData[j]);

          if (this.subHeads[i].minorHead == this.minorHeadData[j].minorHead)
            this.formdata.get('minorHead')?.setValue(this.minorHeadData[j]);
        }
      }

    }

    //Step1:-> Selected Major Data and Minor Data automatically
    // this.formdata.patchValue({
    //   majorHead: event.majorHead,
    //   minorHead: event.minorHead,
    // });

    // this.budgetRevisionUnitList[index].isSelected = true;
    // this.budgetRevisionUnitList[index].existingAmount = 30;

    // this.totalExistingAmount =
    //   this.totalExistingAmount +
    //   this.budgetRevisionUnitList[index].existingAmount;
    //Step2-> Get Allocation Fund By API by SubHead and Financial Year

    //Step3-> Get All Unit By SubHead Selected
    // this.selectedunits = structuredClone(this.allunits);
    // debugger;
    // for (var i = 0; i < this.selectedunits.length; i++) {
    //   let subHeadWiseUnit = new SubHeadWiseUnitList();
    //   subHeadWiseUnit.id = 0;
    //   subHeadWiseUnit.amount = 0;
    //   subHeadWiseUnit.isSelected = false;
    //   subHeadWiseUnit.unit = this.selectedunits[i].descr;
    //   this.subHeadWiseUnitList.push(subHeadWiseUnit);
    // }





  }

  moveDataToNextGrid(formDataValue: any) {
    // this.subHeadWiseUnitList.push(new SubHeadWiseUnitList());
    this.budgetRevisionUnitList.splice(0, 0, new BudgetRevisionUnitList());
  }

  uploadDocuments: any[] = [];
  unitForDocuments: any[] = [];
  getUnitDatas() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.unitForDocuments = result['response'];
    });
  }
  file: any;

  onChangeFile(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  uploadFileResponse: any;
  uploadFile(index: any) {
    const formData = new FormData();
    formData.append('file', this.file);

    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          // this.newSubcList = [];
          this.uploadFileResponse = '';
          // this.newSubcArr = [];
          this.uploadFileResponse = result['response'];
          console.log(
            'upload file data ======= ' +
              JSON.stringify(this.uploadFileResponse) +
              ' =submitJson'
          );

          this.uploadDocuments[index].uploadDocId =
            this.uploadFileResponse.uploadDocId;

          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
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

  deleteFieldValue(index: any) {
    this.uploadDocuments.splice(index, 1);
  }

  addFieldValue() {
    this.uploadDocuments.push(new UploadDocuments());
  }

  revisionAmount(index: any) {
    this.budgetRevisionUnitList2[index].revisiedAmount = parseFloat(this.budgetRevisionUnitList2[index].existingAmount) + this.budgetRevisionUnitList2[index].revisionAmount;
    this.getTotalAmount();
  }

  totalExistingAmount: any = 0.0;
  totlaRevisionAmount: any = 0.0;
  totalRevisiedAmount: any = 0.0;

  private populateRevisionData() {
    for(let i=0;i<this.allRevisedUnits.length;i++){
      const entry:BudgetRevisionUnitList= {
        id: undefined,
        unit: this.allRevisedUnits[i].unit,
        existingAmount: parseFloat(this.allRevisedUnits[i].existingAmount),
        revisionAmount: undefined,
        revisiedAmount: parseFloat(this.allRevisedUnits[i].existingAmount),
        isSelected: false
      }
      this.budgetRevisionUnitList2.push(entry);
    }
    this.getTotalAmount();
  }

  getAvailableFundFindByUnitIdAndFinYearId($event: any, i: number) {
    const finYear=this.formdata.get('finYear')?.value
    let formData={};
      if(finYear!=null){
      formData={
        unitId:this.budgetRevisionUnitList[i].unit.unit,
        finYearId:JSON.parse(finYear).serialNo
      }

    this.apiService.postApi(this.cons.api.getAvailableFundFindByUnitIdAndFinYearId, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          // this.newSubcList = [];

          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
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
  tabledata:tableData[]=[];
  masterChecked: boolean=false;
  saveDataToTable() {
    for(let i=0;i<this.budgetRevisionUnitList2.length;i++){
      if(this.budgetRevisionUnitList2[i].revisionAmount!=undefined&&!this.budgetRevisionUnitList2[i].isSelected){
        const data:tableData= {
          checked:false,
          financialYear: this.formdata.get('finYear')?.value,
          unit: this.budgetRevisionUnitList2[i].unit,
          subHead: this.formdata.get('subHead')?.value,
          allocationType: this.formdata.get('allocationType')?.value,
          amount: parseFloat(this.budgetRevisionUnitList2[i].existingAmount),
          revisedAmount: parseFloat(this.budgetRevisionUnitList2[i].revisionAmount)
        }
        this.tabledata.push(data);
        // this.budgetRevisionUnitList2.splice(i, 1);
        // i--;
        this.budgetRevisionUnitList2[i].isSelected=true;
      }

    }
    this.getTotalAmount();

  }

  selectAll() {
    for(let i=0;i<this.tabledata.length;i++){
      this.tabledata[i].checked=this.masterChecked;
      console.log(this.tabledata[i].checked);
    }
    console.log(this.masterChecked);
  }

  deleteTableData() {
    for(let i=this.tabledata.length-1;i>=0;i--){
      if(this.tabledata[i].checked){
        for(let j=0;i<this.budgetRevisionUnitList2.length;j++){
          if(this.tabledata[i].unit.unit==this.budgetRevisionUnitList2[j].unit.unit){
            this.budgetRevisionUnitList2[j].isSelected=false;
            this.tabledata.splice(i,1);
            break;
          }
        }
      }
    }
    this.getTotalAmount()
  }
  getTotalAmount(){
    this.totalExistingAmount = 0.0;
    this.totlaRevisionAmount = 0.0;
    this.totalRevisiedAmount = 0.0;
    for(let i=0;i<this.budgetRevisionUnitList2.length;i++){
      if(!this.budgetRevisionUnitList2[i].isSelected){
        this.totalExistingAmount=this.totalExistingAmount+this.budgetRevisionUnitList2[i].existingAmount
        this.totalRevisiedAmount=this.totalRevisiedAmount+this.budgetRevisionUnitList2[i].revisiedAmount
        if(this.budgetRevisionUnitList2[i].revisionAmount!=undefined){
          this.totlaRevisionAmount=this.totlaRevisionAmount+this.budgetRevisionUnitList2[i].revisionAmount
        }
      }
    }
  }
  getAllocationTypeData() {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getAllocationTypeData)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }
  saveRevisionData(){
    const requestJson:revision[]=[];
    for(let i=0;i<this.tabledata.length;i++){
    const entry:revision= {
      budgetFinanciaYearId: this.tabledata[i].financialYear.serialNo,
      toUnitId: this.tabledata[i].unit.unit,
      subHeadId: this.tabledata[i].subHead.budgetCodeId,
      amount: this.tabledata[i].amount,
      revisedAmount: this.tabledata[i].revisedAmount,
      allocationTypeId: this.tabledata[i].allocationType.allocTypeId
    }
    requestJson.push(entry);
    }
    this.apiService.postApi(this.cons.api.saveBudgetRevisionData, requestJson).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          // this.newSubcList = [];

          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
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
  getBudgetRevisionData(formDataValue: any){
    debugger;
    let submitJson = {
      budgetFinancialYearId: formDataValue.finYear.serialNo,
       subHead: formDataValue.subHead.budgetCodeId,
      allocationTypeId: formDataValue.allocationType.allocTypeId
    };
    this.apiService
      .postApi(this.cons.api.getBudgetRevisionData, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.allRevisedUnits = result['response'];
            this.populateRevisionData();
            // this.subHeadFilterDatas = result['response'].subHeads;
            // this.tableData.splice(indexValue, 1);
            // if (this.subHeadFilterDatas != undefined) {
            //   for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
            //     this.subHeadFilterDatas[i].amount = undefined;
            //   }
            // }
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


