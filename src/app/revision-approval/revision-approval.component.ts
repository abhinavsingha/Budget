import {Component, ViewChild} from '@angular/core';
import * as $ from "jquery";
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared/shared.service";
import Swal from "sweetalert2";
@Component({
  selector: 'app-revision-approval',
  templateUrl: './revision-approval.component.html',
  styleUrls: ['./revision-approval.component.scss']
})
export class RevisionApprovalComponent {
  @ViewChild('browseFileInput') browseFileInput: any;
  unitData: any;
  private userUnitId: any;
  currentUnit: any;
  browse: any;
  amountUnit: string|undefined;
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
  budgetDataLists:any;
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
  p: number = 1;
  finYear: any;
  subHead: any;
  majorHead: any;
  minorHead: any;
  allocationType: any;
  status:boolean=false;
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
      .getApi(this.cons.api.getAllRevisionGroupId + '/' + groupId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          debugger;
          this.budgetDataLists = result['response'].budgetResponseist;
          this.finYear=this.budgetDataLists[0].finYear;
          this.formdata.get('finYear')?.setValue(this.budgetDataLists[0].finYear);
          this.subHead=this.budgetDataLists[0].subHead;
          this.formdata.get('subHead')?.setValue(this.budgetDataLists[0].subHead);
          this.majorHead=this.budgetDataLists[0].subHead;
          this.minorHead=this.budgetDataLists[0].subHead;
          if(this.budgetDataLists[0].status=='Approved')
            this.status=true;
          this.formdata.get('majorHead')?.setValue(this.budgetDataLists[0].subHead);
          this.formdata.get('minorHead')?.setValue(this.budgetDataLists[0].subHead);
          this.allocationType=this.budgetDataLists[0].allocTypeId;
          this.formdata.get('allocationType')?.setValue(this.budgetDataLists[0].allocTypeId);
          this.formdata.get('remarks')?.setValue(this.budgetDataLists[0].remarks);
          this.amountUnit=this.budgetDataLists[0].amountUnit.amountType;


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
            this.userUnitId=result['response'].userDetails.unitId;
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
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
  approveForm(formDataValue: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveFormFinally(formDataValue);
      }
    });
  }
  approveFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let submitJson = {
      authGroupId: this.budgetDataLists[0].authGroupId,
      status: 'Approved',
      remarks: formDataValue.remarks,
    };
    this.apiService
      .postApi(this.cons.api.approveRevisionBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.formdata.reset();
            this.updateInbox();
            this.router.navigateByUrl('/inbox');
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

  returnFormFinally(formDataValue: any) {
    this.SpinnerService.show();
    let submitJson = {
      authGroupId: this.budgetDataLists[0].authGroupId,
      status: 'Rejected',
      remarks: formDataValue.remarks,
    };
    this.apiService
      .postApi(this.cons.api.approveRevisionBudgetOrReject, submitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.updateInbox();
            this.formdata.reset();
            this.router.navigateByUrl('/inbox');
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
  getCgUnitData() {
    this.SpinnerService.show();
    var comboJson = null;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.unitData = result['response'];
        // if(this.userUnitId==undefined){
        //   var newSubmitJson = null;
        //   this.apiService
        //     .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
        //     .subscribe({
        //       next: (v: object) => {
        //         this.SpinnerService.hide();
        //         let result: { [key: string]: any } = v;
        //         if (result['message'] == 'success') {
        //           debugger;
        //           this.userUnitId=result['response'].userDetails.unitId;
        //
        //         } else {
        //           this.common.faliureAlert('Please try later', result['message'], '');
        //         }
        //       },
        //       error: (e) => {
        //         this.SpinnerService.hide();
        //         console.error(e);
        //         this.common.faliureAlert('Error', e['error']['message'], 'error');
        //       },
        //       complete: () => console.info('complete'),
        //     });
        // }
        for(let i=0;i<this.unitData.length;i++){
          if(this.userUnitId=='001321'){
            if(this.unitData[i].unit=='000225')
            {
              this.currentUnit=this.unitData[i];
              this.formdata.get('authUnit')?.setValue(this.currentUnit);
            }
          }
          else{
            if(this.unitData[i].unit==this.userUnitId){
              this.currentUnit=this.unitData[i];
              this.formdata.get('authUnit')?.setValue(this.currentUnit);
            }
          }
        }
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  upload() {
      const file: File = this.browseFileInput.nativeElement.files[0];
      console.log(file);
      const formData = new FormData();
      console.log(this.formdata.get('file')?.value);
      formData.append('file', file);
      this.SpinnerService.show();
      this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.common.successAlert(
              'File Uploaded',
              result['response']['msg'],
              'success'
            );
            this.browse = result['response'].uploadDocId;
            this.SpinnerService.hide();
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
            this.SpinnerService.hide();
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.SpinnerService.hide(),
      });

  }
  viewFile(file: string) {
    this.apiService.getApi(this.cons.api.fileDownload + file).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        this.openPdfUrlInNewTab(result['response'].pathURL);
        console.log(result['response'].pathURL);
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
  save(formDataValue: any) {
    let newSubmitJson = {
      authDate: formDataValue.authDate,
      remark: formDataValue.returnRemark,
      authUnitId: formDataValue.authUnit.unit,
      authDocId: this.browse,
      authGroupId: localStorage.getItem('group_id'),
    };
    this.apiService
      .postApi(this.cons.api.saveAuthData, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.router.navigate(['/dashboard']);
            this.getDashBoardDta();
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

  generateCsvData(tableData: any[]): string {
    // Extract headers
    const headers = Object.keys(tableData[0]);

    // Extract data rows
    const rows = tableData.map(row => {
      return headers.map(header => {
        return row[header];
      });
    });

    // Combine headers and rows into a CSV string
    const csvContent = headers.join(',') + '\n' +
      rows.map(row => row.join(',')).join('\n');

    return csvContent;
  }

  downloadCsv() {
    let tableData=[];
    let totalR=0.0;
    let totalA=0.0;
    for(let i=0;i<this.budgetDataLists.length;i++){
      // totalA=totalA+(parseFloat(this.budgetDataList[i].allocationAmount)*this.budgetDataList[i].amountUnit.amount);
      // totalR=totalR+(parseFloat(this.budgetDataList[i].balanceAmount)*this.budgetDataList[i].remeningBalanceUnit.amount);
      /*<th>F.Y.</th>
      <th>Unit</th>
      <th>Sub Head</th>
      <th>Type</th>
      <th>Allocated ({{this.amountUnit}})</th>
      <th>Additional/Withdrawal ({{this.amountUnit}})</th>
      <th>Revised ({{this.amountUnit}})</th>*/
      let table:any= {
        Financial_Year: this.budgetDataLists[i].finYear.finYear.replaceAll(',',' '),
        Unit: this.budgetDataLists[i].toUnit.descr.replaceAll(',',' '),
        Subhead: this.budgetDataLists[i].subHead.subHeadDescr.replaceAll(',',' '),
        Type: this.budgetDataLists[i].allocTypeId.allocType.replaceAll(',',' '),
        Allocated_Fund: this.budgetDataLists[i].allocationAmount.replaceAll(',',' ')+' ' +this.budgetDataLists[i].amountUnit.amountType,
        AdditionalOrWithdrawal: this.budgetDataLists[i].revisedAmount.replaceAll(',',' ')+' ' +this.budgetDataLists[i].remeningBalanceUnit.amountType,
        Revised:this.budgetDataLists[i].balanceAmount.replaceAll(',',' ')+' ' +this.budgetDataLists[i].remeningBalanceUnit.amountType
      }
      tableData.push(table);
    }
    // let table:any= {
    //   Financial_Year: '',
    //   To_Unit: '',
    //   From_Unit: '',
    //   Subhead: '',
    //   Type: 'TOTAL',
    //   Remaining_Amount: (parseFloat(totalR.toFixed(4))/10000000).toString() + 'Crore',
    //   Allocated_Fund: (parseFloat(totalA.toFixed(4))/10000000).toString() + 'Crore'
    // }
    // tableData.push(table);
    // Generate CSV content
    const csvContent = this.generateCsvData(tableData);
    // Create Blob object from CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' });
    // Create download link and click it programmatically
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'BudgetRevision.csv';
    link.click();
    // Clean up
    window.URL.revokeObjectURL(link.href);
    document.removeChild(link);
  }



}
