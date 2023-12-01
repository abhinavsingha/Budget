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
import Swal from "sweetalert2";
import {SharedService} from "../services/shared/shared.service";

class tableData {
  manipulate:any;
  manipulate2:any;
  cdaDetails:any;
  isAllocated:any;
  checked: boolean = false;
  financialYear: any;
  unit: any;
  subHead: any;
  allocated:any;
  allocationType: any;
  amount: any;
  revisedAmount: any;
  amountType:any;
  bal:any;
  expenditure:any;
}

class revision {
  isAutoAssignAllocation:any;
  cdaParkingId:any;
  isAllocated:any;
  budgetFinanciaYearId: any;
  toUnitId: any;
  subHeadId: any;
  amount: any;
  revisedAmount: any;
  allocationTypeId: any;
  remark: any;
  amountTypeId:any;
  remainingAmount:any;
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
    subHeadType:new FormControl(),
    majorHead: new FormControl(),

    minorHead: new FormControl(),
    allocationType: new FormControl(),
    fundAvailable: new FormControl(),
    currentAllocation: new FormControl(),
    balanceFund: new FormControl(),
    remarks: new FormControl('', Validators.required),
    reallocateFund: new FormControl(),
    amountType:new FormControl(),
  });
  majorHeadData: any;
  minorHeadData: any;
  allRevisedUnits: any;
  budgetRevisionUnitList2: any[] = [];
  private allocationDta: any;
  unitId: any;
  totalManipulate: any=0.0;
  totalManipulate2: any=0.0;
  loginIndex: any;
  newRevisionAmount: number=0;
  private localIndex: any;
  cdaDetails: any;
  private flag: boolean=true;
  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}
  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getCgUnitData();
    this.getSubHeadType()
    this.getNewEmptyEntries();
    this.getUnitDatas();
    this.getDashBoardDta()
    this.getMajorHead();
    this.getAllocationTypeData();
    this.getAmountType();
    this.uploadDocuments.push(new UploadDocuments());
    $.getScript('assets/main.js');
  }



  newFormGroup() {
    this.formdata = new FormGroup({
      subHeadType:new FormControl(),
      finYear: new FormControl('Select Financial Year', Validators.required),
      subHead: new FormControl(),
      majorHead: new FormControl(),
      minorHead: new FormControl(),
      allocationType: new FormControl(),
      fundAvailable: new FormControl(),
      currentAllocation: new FormControl(),
      balanceFund: new FormControl(),
      amountType:new FormControl(),
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
        // this.formdata.patchValue({
        //   finYear: this.budgetFinYears[0],
        // });
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  amountType: any;
  getAmountType(){
    this.apiService
      .getApi(this.cons.api.showAllAmountUnit)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.amountType = result['response'];

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
  getAvailableFundData(data:any) {
    this.formdata.get('amountType')?.reset();
    this.tabledata=[];
    this.budgetRevisionUnitList2=[];
    this.totalRevisiedAmount=0.0;
    this.totalExistingAmount=0.0;
    this.totlaRevisionAmount =0.0;
    if(this.formdata.get('subHead')?.value==undefined)
      return;
    for (let i = 0; i < this.subHeads.length; i++) {
      if (this.subHeads[i] == this.formdata.get('subHead')?.value) {
        for (let j = 0; j < this.majorHeadData.length; j++) {
          if (this.subHeads[i].majorHead == this.majorHeadData[j].majorHead)
            this.formdata.get('majorHead')?.setValue(this.majorHeadData[j]);

          if (this.subHeads[i].minorHead == this.minorHeadData[j].minorHead)
            this.formdata.get('minorHead')?.setValue(this.minorHeadData[j]);
        }
      }
    }
    this.SpinnerService.show();
    let submitJson = {
      finYearId: data.finYear.serialNo,
      subHeadId: data.subHead.budgetCodeId,
      allocationTypeId: data.allocationType.allocTypeId,
    };

    this.apiService
      .postApi(
        this.cons.api.getAvailableFundFindByUnitIdAndFinYearId,
        submitJson
      )
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.formdata.get('fundAvailable')?.setValue(parseFloat(result['response'].fundAvailable).toFixed(4));
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

  getSubHeadsData() {
    this.formdata.get('subHead')?.reset();
    this.formdata.get('amountType')?.reset();
    this.formdata.get('fundAvailable')?.reset();
    this.formdata.get('balanceFund')?.reset();
    this.formdata.get('reallocateFund')?.reset();
    this.tabledata=[];
    this.budgetRevisionUnitList2=[];
    this.totalRevisiedAmount=0.0;
    this.totalExistingAmount=0.0;
    this.totlaRevisionAmount =0.0;

    this.SpinnerService.show();
    let json={
      budgetHeadType:this.formdata.get('subHeadType')?.value.subHeadTypeId,
      majorHead:this.formdata.get('majorHead')?.value.majorHead
    }
    this.apiService.postApi(this.cons.api.getAllSubHeadByMajorHead,json).subscribe((res) => {
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
          // console.log(
          //   'upload file data ======= ' +
          //     JSON.stringify(this.uploadFileResponse) +
          //     ' =submitJson'
          // );

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
    debugger;
    this.localIndex=index;
    this.budgetRevisionUnitList2[this.loginIndex].revisionAmount=0.0;
    if(this.budgetRevisionUnitList2[index].revisionAmount==undefined)
      this.budgetRevisionUnitList2[index].revisionAmount=0.0000.toFixed(4);

    debugger;
    if(Number(this.budgetRevisionUnitList2[index].existingAmount)==0&&Number(this.budgetRevisionUnitList2[index].expenditure)>0&&(Number(this.budgetRevisionUnitList2[index].revisionAmount)*Number(this.formdata.get('amountType')?.value.amount))<Number(this.budgetRevisionUnitList2[index].expenditure))
    {
      this.common.warningAlert('Allocation cannot be less than Expenditure','Allocation cannot be less than Expenditure: '+((parseFloat(this.budgetRevisionUnitList2[index].expenditure))/parseFloat(this.formdata.get('amountType')?.value.amount)).toFixed(4)+this.formdata.get('amountType')?.value.amountType,'')
      return;

    }


    if((parseFloat(this.budgetRevisionUnitList2[index].remAmount)+parseFloat(this.budgetRevisionUnitList2[index].revisionAmount)<0)&&(Number(this.budgetRevisionUnitList2[index].existingAmount)!=0)){
      Swal.fire('Cannot withdraw more than existing amount');
      this.budgetRevisionUnitList2[index].revisionAmount=undefined;
      return;
    }
    if(this.formdata.get('amountType')?.value==null||this.formdata.get('amountType')?.value==undefined){
      Swal.fire('Select Rupee in');
      this.budgetRevisionUnitList2[index].revisionAmount=undefined;
      return;
    }
    if(this.budgetRevisionUnitList2[index].unit.unit==this.dasboardData.userDetails.unitId){
      this.userUnitRE=this.budgetRevisionUnitList2[index].revisionAmount;
    }
    this.budgetRevisionUnitList2[index].revisiedAmount = (parseFloat(this.budgetRevisionUnitList2[index].existingAmount)+parseFloat(this.budgetRevisionUnitList2[index].revisionAmount)).toFixed(4);
    this.budgetRevisionUnitList2[index].manipulate2 = (parseFloat(this.budgetRevisionUnitList2[index].manipulate)+parseFloat(this.budgetRevisionUnitList2[index].revisionAmount)).toFixed(4);
    this.budgetRevisionUnitList2[index].revisionAmount=parseFloat(this.budgetRevisionUnitList2[index].revisionAmount).toFixed(4);
    debugger;
    if(parseFloat(this.budgetRevisionUnitList2[index].manipulate2)<parseFloat(this.budgetRevisionUnitList2[index].expenditure)/parseFloat(this.formdata.get('amountType')?.value.amount)){
      this.budgetRevisionUnitList2[index].revisionAmount=0
      this.common.warningAlert('Allocation cannot be less than Expenditure','Allocation cannot be less than Expenditure: '+((parseFloat(this.budgetRevisionUnitList2[index].expenditure))/parseFloat(this.formdata.get('amountType')?.value.amount)).toFixed(4)+this.formdata.get('amountType')?.value.amountType,'')
      this.revisionAmount(index);
    }
    this.getTotalAmount();
  }

  totalExistingAmount: any = 0.0;
  totlaRevisionAmount: any = 0.0;
  totalRevisiedAmount: any = 0.0;
  totalRemainingAmount: any = 0.0;


  private populateRevisionData() {
    //debugger;
    for (let i = 0; i < this.allRevisedUnits.length; i++) {
      const entry: BudgetRevisionUnitList = {
        expenditure:this.allRevisedUnits[i].expenditureAmount,
        cdaTransData:this.allRevisedUnits[i].cdaTransData,
        id: undefined,
        unit: this.allRevisedUnits[i].unit,
        existingAmount: (parseFloat(this.allRevisedUnits[i].allocationAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount).toFixed(4),
        revisionAmount: undefined,
        revisiedAmount: (parseFloat(this.allRevisedUnits[i].allocationAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount).toFixed(4),
        isSelected: false,
        amountType: this.allRevisedUnits[i].amountType,
        remainingAmount:(parseFloat(this.allRevisedUnits[i].balAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount).toFixed(4),
        manipulate:this.allRevisedUnits[i].manipulate,
        manipulate2:this.allRevisedUnits[i].manipulate,
        remAmount:(parseFloat(this.allRevisedUnits[i].remainingAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount).toFixed(4),
      };
      this.budgetRevisionUnitList2.push(entry);
    }
    this.getTotalAmount();
  }
  tabledata: tableData[] = [];
  masterChecked: boolean = false;
  saveDataToTable() {
    if(!this.flag){
      return;
    }
    this.showSubmit=true;
    const alloc = {
      allocationType: this.formdata.get('allocationType')?.value.allocDesc,
      allocationTypeId: this.formdata.get('allocationType')?.value.allocTypeId,
    };
    // if (this.formdata.get('allocationType')?.value.allocType == 'BE') {
    //   alloc.allocationType = 'Revised BE';
    //   alloc.allocationTypeId = 'ALL_106';
    // } else {
    //   alloc.allocationType = 'Revised RE';
    //   alloc.allocationTypeId = 'ALL_107';
    // }

    for (let i = 0; i < this.budgetRevisionUnitList2.length; i++) {
      if (
        this.budgetRevisionUnitList2[i].revisionAmount != undefined &&
        !this.budgetRevisionUnitList2[i].isSelected
      ) {
        let data: tableData= {
          manipulate: undefined,
          manipulate2: undefined,
          cdaDetails: undefined,
          checked: false,
          financialYear: undefined,
          unit: undefined,
          subHead: undefined,
          allocationType: undefined,
          amount: undefined,
          revisedAmount: undefined,
          amountType: undefined,
          bal: undefined,
          isAllocated: undefined,
          allocated: undefined,
          expenditure: undefined
        }
        if(this.budgetRevisionUnitList2[i].revisionAmount<0){
          data = {
            cdaDetails:this.budgetRevisionUnitList2[i].cdaTransData,
            isAllocated: 0,
            checked: false,
            financialYear: this.formdata.get('finYear')?.value,
            unit: this.budgetRevisionUnitList2[i].unit,
            subHead: this.formdata.get('subHead')?.value,
            allocationType: {allocationTypeId:this.formdata.get('allocationType')?.value.allocTypeId,allocationType:this.formdata.get('allocationType')?.value.allocType},
            amountType: this.budgetRevisionUnitList2[i].amountType,
            amount: (parseFloat(this.budgetRevisionUnitList2[i].existingAmount)-parseFloat(this.budgetRevisionUnitList2[i].revisionAmount)).toFixed(4),
            allocated: parseFloat(this.budgetRevisionUnitList2[i].existingAmount).toFixed(4),
            revisedAmount: parseFloat(this.budgetRevisionUnitList2[i].revisionAmount).toFixed(4),
            bal:parseFloat(this.budgetRevisionUnitList2[i].manipulate2).toFixed(4),
            manipulate:parseFloat(this.budgetRevisionUnitList2[i].manipulate).toFixed(4),
            manipulate2:parseFloat(this.budgetRevisionUnitList2[i].manipulate2).toFixed(4),
            expenditure:parseFloat(this.budgetRevisionUnitList2[i].expenditure).toFixed(4),
          };
        }
        else{
          data = {
            expenditure:parseFloat(this.budgetRevisionUnitList2[i].expenditure).toFixed(4),
            cdaDetails:this.budgetRevisionUnitList2[i].cdaTransData,
            isAllocated: 1,
            checked: false,
            financialYear: this.formdata.get('finYear')?.value,
            unit: this.budgetRevisionUnitList2[i].unit,
            subHead: this.formdata.get('subHead')?.value,
            allocationType: alloc,
            allocated: parseFloat(this.budgetRevisionUnitList2[i].existingAmount).toFixed(4),
            manipulate:parseFloat(this.budgetRevisionUnitList2[i].manipulate).toFixed(4),
            manipulate2:parseFloat(this.budgetRevisionUnitList2[i].manipulate2).toFixed(4),
            amountType: this.budgetRevisionUnitList2[i].amountType,
            amount: (parseFloat(this.budgetRevisionUnitList2[i].existingAmount)-parseFloat(this.budgetRevisionUnitList2[i].revisionAmount)).toFixed(4),
            revisedAmount: parseFloat(
              this.budgetRevisionUnitList2[i].revisionAmount
            ).toFixed(4),
            bal:parseFloat(
              this.budgetRevisionUnitList2[i].manipulate2
            ).toFixed(4)
          };
        }
        let sum=0;
        debugger;
        for(let cda of data.cdaDetails){
          if(cda.amount!=undefined)
            sum+=parseFloat(cda.amount);
          else
            cda.amount=0;
        }
        if(sum!=data.revisedAmount&&this.unitId==this.budgetRevisionUnitList2[i].unit.unit)
        {
          this.common.faliureAlert('CDA amount mismatch','CDA amount does not match revision amount','');
          this.tabledata=[];
          for(let entry of this.budgetRevisionUnitList2)
            entry.isSelected=false;
          return;
        }
        debugger;
        this.tabledata.push(data);
        this.budgetRevisionUnitList2[i].isSelected = true;
      }
    }
    this.getTotalAmount();
    //debugger;
  }
  selectAll() {
    for (let i = 0; i < this.tabledata.length; i++) {
      this.tabledata[i].checked = this.masterChecked;
      // console.log(this.tabledata[i].checked);
    }
    // console.log(this.masterChecked);
  }
  deleteTableData() {
    for (let i = this.tabledata.length - 1; i >= 0; i--) {
      if (this.tabledata[i].checked) {
        for (let j = 0; i < this.budgetRevisionUnitList2.length; j++) {
          if (
            this.tabledata[i].unit.unit ==
            this.budgetRevisionUnitList2[j].unit.unit
          ) {
            this.budgetRevisionUnitList2[j].isSelected = false;
            this.tabledata.splice(i, 1);
            break;
          }
        }
      }
    }
    this.getTotalAmount();
  }
  allocation_withdrawl:any;
  userUnitRE:any;
  getTotalAmount() {
    this.totalManipulate=0.0;
    this.totalExistingAmount = 0.0;
    this.totlaRevisionAmount = 0.0;
    this.totalRevisiedAmount = 0.0;
    this.totalRemainingAmount=0.0;
    this.totalManipulate2=0.0;

    debugger;

    for (let i = 0; i < this.budgetRevisionUnitList2.length; i++) {
      if (!this.budgetRevisionUnitList2[i].isSelected) {
        this.totalRemainingAmount=(parseFloat(this.totalRemainingAmount) +
          parseFloat(this.budgetRevisionUnitList2[i].remainingAmount)).toFixed(4);
        this.totalExistingAmount =
          (parseFloat(this.totalExistingAmount) +
          parseFloat(this.budgetRevisionUnitList2[i].existingAmount)).toFixed(4);
        this.totalRevisiedAmount =(
          parseFloat(this.totalRevisiedAmount) +
          parseFloat(this.budgetRevisionUnitList2[i].revisiedAmount)).toFixed(4);
        this.totalManipulate=(parseFloat(this.totalManipulate)+parseFloat(this.budgetRevisionUnitList2[i].manipulate)).toFixed(4);
        this.totalManipulate2=(parseFloat(this.totalManipulate2)+parseFloat(this.budgetRevisionUnitList2[i].manipulate2)).toFixed(4);
        if (this.budgetRevisionUnitList2[i].revisionAmount != undefined) {
          this.totlaRevisionAmount =(
            parseFloat(this.totlaRevisionAmount) +
            parseFloat(this.budgetRevisionUnitList2[i].revisionAmount)).toFixed(4);
        }
      }
    }
    this.totalExistingAmount=parseFloat(this.totalExistingAmount).toFixed(4);

    if(this.userUnitRE!=undefined){
      this.allocation_withdrawl=(parseFloat(this.totlaRevisionAmount)-parseFloat(this.userUnitRE)).toFixed(4);
    }else
      this.allocation_withdrawl=(parseFloat(this.totlaRevisionAmount)).toFixed(4);
    this.formdata.get('reallocateFund')?.setValue(parseFloat(this.allocation_withdrawl).toFixed(4));
    if(((parseFloat(this.formdata.get('fundAvailable')?.value)-parseFloat(this.allocation_withdrawl)*parseFloat(this.formdata.get('amountType')?.value.amount)))<0){
      this.common.warningAlert('Unit Out of Funds','Revision is exceeding unit funds','')
      this.flag=false;
    }
    else{
      this.flag=true;
    }
    this.formdata.get('balanceFund')?.setValue((parseFloat(this.formdata.get('fundAvailable')?.value)-parseFloat(this.allocation_withdrawl)*parseFloat(this.formdata.get('amountType')?.value.amount)).toFixed(4));
    this.autoCalcHomeUnitRevision(this.localIndex);
  }
  autoCalcHomeUnitRevision(index:any){
    this.budgetRevisionUnitList2[this.loginIndex].revisionAmount=(parseFloat(this.totlaRevisionAmount)*-1).toFixed(4);
    this.budgetRevisionUnitList2[this.loginIndex].manipulate2=(parseFloat(this.budgetRevisionUnitList2[this.loginIndex].revisionAmount)+parseFloat(this.budgetRevisionUnitList2[this.loginIndex].manipulate)).toFixed(4);

    if(this.budgetRevisionUnitList2[this.loginIndex].manipulate2<0){
      this.common.warningAlert('Unit out of Funds','Cannot withdraw more than available','');
      this.budgetRevisionUnitList2[index].revisionAmount=0;
      this.budgetRevisionUnitList2[this.loginIndex].manipulate2=this.budgetRevisionUnitList2[this.loginIndex].manipulate;
      debugger;
      this.revisionAmount(index);

    }
    else{
      this.totalManipulate2=parseFloat(this.totalManipulate2)+parseFloat(this.budgetRevisionUnitList2[this.loginIndex].revisionAmount);
      this.newRevisionAmount=parseFloat(this.totlaRevisionAmount)+parseFloat(this.budgetRevisionUnitList2[this.loginIndex].revisionAmount);
    }
    this.totalManipulate2=0.0;
    for (let i = 0; i < this.budgetRevisionUnitList2.length; i++) {
      if (!this.budgetRevisionUnitList2[i].isSelected)
      this.totalManipulate2=(parseFloat(this.totalManipulate2)+parseFloat(this.budgetRevisionUnitList2[i].manipulate2)).toFixed(4);
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
          this.allocationDta = result['response'];
          // for (let i = this.allocationType.length - 1; i >= 0; i--) {
          //   if (
          //     this.allocationType[i].allocType != 'BE' &&
          //     this.allocationType[i].allocType != 'RE'
          //   ) {
          //     this.allocationType.splice(i, 1);
          //   }
          // }
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }
  showSubmit:boolean=true;
  saveRevisionData() {
    this.showSubmit=false;
    const requestJson: revision[] = [];
    if(this.tabledata.length==0){
      this.common.faliureAlert('No entry found','Add atlest one entry','');
      return;
    }
    // let revisionType=2;
    for (let i = 0; i < this.tabledata.length; i++) {
      // if(this.tabledata[i].unit.unit==this.unitId){
      //   debugger;
      //   if(parseFloat(this.tabledata[i].revisedAmount)>0)
      //     revisionType=2;
      //   else if(parseFloat(this.tabledata[i].revisedAmount)<0)
      //     revisionType=1;
      // }
      let cdapark:any[]=[]
      for(let cda of this.tabledata[i].cdaDetails){
        const cdaP={
          cdaParkingId:cda.cdaParkingId,
          cdaAmount:cda.amount,
          allocatedAmount:cda.totalParkingAmount,
          allocatedAmountType:this.formdata.get('amountType')?.value.amountTypeId,
        }
        cdapark.push(cdaP)

      }
      const entry: revision = {
        isAutoAssignAllocation:0,
        cdaParkingId:cdapark,
        isAllocated:this.tabledata[i].isAllocated,
        budgetFinanciaYearId: this.tabledata[i].financialYear.serialNo,
        toUnitId: this.tabledata[i].unit.unit,
        subHeadId: this.tabledata[i].subHead.budgetCodeId,
        amount:this.tabledata[i].allocated,
        // amount: this.tabledata[i].amount,//allocation
        // revisedAmount: this.tabledata[i].revisedAmount,//additional/withdrawal
         revisedAmount: this.tabledata[i].revisedAmount,//additional/withdrawal
        allocationTypeId: this.tabledata[i].allocationType.allocationTypeId,
        amountTypeId:this.formdata.get('amountType')?.value.amountTypeId,
        remark: this.formdata.get('remarks')?.value,
        // remainingAmount:this.tabledata[i].manipulate
        remainingAmount:this.tabledata[i].manipulate
      };
      requestJson.push(entry);
      if(this.tabledata[i].revisedAmount<0){
        const entry1: revision = {
          isAutoAssignAllocation:1,
          cdaParkingId:cdapark,
          isAllocated:this.tabledata[i].isAllocated,
          budgetFinanciaYearId: this.tabledata[i].financialYear.serialNo,
          toUnitId: this.tabledata[i].unit.unit,
          subHeadId: this.tabledata[i].subHead.budgetCodeId,
          amount:this.tabledata[i].allocated,
          revisedAmount: Number(Number(this.tabledata[i].allocated)+Number(this.tabledata[i].revisedAmount)),
          allocationTypeId: this.tabledata[i].allocationType.allocationTypeId,
          amountTypeId:this.formdata.get('amountType')?.value.amountTypeId,
          remark: this.formdata.get('remarks')?.value,
          remainingAmount:this.tabledata[i].manipulate
        };
        requestJson.push(entry1);
      }
    }
    const req = {
      // revisionType:revisionType,
      budgetRequest: requestJson,
    };
    debugger;

      this.apiService
        .postApi(this.cons.api.saveBudgetRevisionData, req)
        .subscribe({
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
              this.updateInbox();
              const delayMilliseconds = 3000;

              setTimeout(() => {
                // Reload the page
                window.location.reload();
              }, delayMilliseconds);
            } else {
              this.common.faliureAlert('Please try later', result['message'], '');
              this.showSubmit=true;
            }
          },
          error: (e) => {
            this.SpinnerService.hide();
            this.showSubmit=true;
            console.error(e);
            this.common.faliureAlert('Error', e['error']['message'], 'error');
          },
          complete: () => console.log("done"),
        });


  }
  updateInbox(){
    this.apiService
      .getApi(this.cons.api.updateInboxOutBox)
      .subscribe({
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
  dasboardData:any;
  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          this.dasboardData = result['response'];
          this.formdata.get('allocationType')?.setValue(this.dasboardData.allocationType);
          // console.log('DATA>>>>>>>' + this.dasboardData);
          this.sharedService.finYear=result['response'].budgetFinancialYear;
          this.unitId = result['response'].userDetails.unitId;
          if(this.sharedService.finYear!=undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

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
  getBudgetRevisionData(formDataValue: any) {
    this.budgetRevisionUnitList2=[];
    this.tabledata=[];
    if(formDataValue.finYear==null||formDataValue.finYear==undefined||formDataValue.subHead==undefined||formDataValue.subHead==null||
      formDataValue.allocationType.allocTypeId==undefined||formDataValue.allocationType.allocTypeId==null){
      Swal.fire('Enter missing Values');
      return;
    }
    let submitJson = {
      unitId:this.dasboardData.userDetails.unitId,
      budgetFinancialYearId: formDataValue.finYear.serialNo,
      subHead: formDataValue.subHead.budgetCodeId,
      allocTypeId: formDataValue.allocationType.allocTypeId,
    };
    this.apiService
      .postApi(this.cons.api.getBudgetRevisionData, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.allRevisedUnits = result['response'];

            let alloc=0.0;

            for(let i=0;i<this.allRevisedUnits.length;i++){

              if(this.allRevisedUnits[i].unit.unit!=this.unitId){
                alloc=alloc + (parseFloat(this.allRevisedUnits[i].allocationAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount);
                this.allRevisedUnits[i].manipulate=(parseFloat(this.allRevisedUnits[i].allocationAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount).toFixed(4);
              }
            }
            for(let i=0;i<this.allRevisedUnits.length;i++){

              if(this.allRevisedUnits[i].unit.unit==this.unitId){
                this.cdaDetails=this.allRevisedUnits[i].cdaTransData;
                this.allRevisedUnits[i].manipulate=(parseFloat(this.allRevisedUnits[i].allocationAmount)*parseFloat(this.allRevisedUnits[i].amountType.amount)/this.formdata.get('amountType')?.value.amount-alloc).toFixed(4);
                this.loginIndex=i;
              }
            }

            // this.subHeadFilterDatas = result['response'].subHeads;
            // this.tableData.splice(indexValue, 1);
            // if (this.subHeadFilterDatas != undefined) {
            //   for (let i = 0; i < this.subHeadFilterDatas.length; i++) {
            //     this.subHeadFilterDatas[i].amount = undefined;
            //   }
            // }
            this.populateRevisionData();
            //debugger;
            this.setAmountType()
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
  amountUnit:string='';
  setAmountType() {
    this.amountUnit=this.formdata.get('amountType')?.value.amountType;
    this.getTotalAmount()
  }
  resetAllocationType() {
    this.formdata.get('allocationType')?.reset();
  }
  subHeadType: any;
  getSubHeadType(){
    this.apiService
      .getApi(this.cons.api.getSubHeadType)
      .subscribe({
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
  clearsubhead() {
    this.formdata.get('subHeadType')?.reset();
    this.formdata.get('subHead')?.reset();
    this.formdata.get('amountType')?.reset();
    this.formdata.get('fundAvailable')?.reset();
    this.formdata.get('balanceFund')?.reset();
    this.formdata.get('reallocateFund')?.reset();
    this.tabledata=[];
    this.budgetRevisionUnitList2=[];
    this.totalRevisiedAmount=0.0;
    this.totalExistingAmount=0.0;
    this.totlaRevisionAmount =0.0;
    this.totalRemainingAmount=0.0;

  }
  dataManipulate(){

  }

  checkTotal() {
    //debugger;
    this.budgetRevisionUnitList2[this.loginIndex].cdaTransData;
    let sum =0
    for(let cda of this.cdaDetails){
      if(cda.amount!=undefined){
        sum =sum + parseFloat(cda.amount);
      }
      else{
        cda.amount=0;
      }
    }
    if(sum!=this.budgetRevisionUnitList2[this.loginIndex].revisionAmount){
      this.common.warningAlert('CDA amount mismatch','CDA total does not match the amount','');
    }
  }
  confirmModel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveRevisionData();
      }
    });
  }

}
