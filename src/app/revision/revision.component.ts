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

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getBudgetFinYear();
    this.getSubHeadsData();
    // this.getCgUnitData();
    this.getNewEmptyEntries();
    this.getUnitDatas();
    this.getAvailableFundData();
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
    this.budgetRevisionUnitList.push(new BudgetRevisionUnitList());
    this.budgetRevisionUnitList.push(new BudgetRevisionUnitList());
    this.budgetRevisionUnitList.push(new BudgetRevisionUnitList());
  }

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

  getAvailableFund(event: any, formDataValue: any) {
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

    debugger;
    let submitJson = {
      budgetFinancialYearId: formDataValue.finYear.serialNo,
      subHead: event.budgetCodeId,
    };

    this.apiService
      .postApi(this.cons.api.getBudgetRevisionData, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.allunits = result['response'];
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
    this.budgetRevisionUnitList[index].revisiedAmount =
      this.budgetRevisionUnitList[index].existingAmount +
      this.budgetRevisionUnitList[index].revisionAmount;

    this.totlaRevisionAmount =
      this.totlaRevisionAmount +
      this.budgetRevisionUnitList[index].revisionAmount;
  }

  totalExistingAmount: any = 0.0;
  totlaRevisionAmount: any = 0.0;
  totalRevisiedAmount: any = 0.0;
}
