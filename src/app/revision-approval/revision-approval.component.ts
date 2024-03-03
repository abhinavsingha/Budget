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
import * as FileSaver from "file-saver";
import {HttpClient} from "@angular/common/http";
import * as Papa from "papaparse";
import {DatePipe} from "@angular/common";
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
  amountUnit: string='';
  constructor(
    // private matDialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    public sharedService: SharedService,
    private http: HttpClient,
    private datePipe: DatePipe
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
  finYear: any[]=[];
  subHead: any[]=[];
  majorHead: any[]=[];
  minorHead: any[]=[];
  allocationType: any;
  status:boolean=false;
  filename:string='Select Document';
  oldBudgetDataLists: any;
  ngOnInit(): void {
    this.sharedService.updateInbox();
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
    debugger;
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
          if(localStorage.getItem('move')=='1'){
            localStorage.removeItem('move')
            this.finallyMoveArchive(this.sharedService.msgId);
          }
          else
            localStorage.removeItem('move');
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
          if(this.budgetDataLists[0].returnRemarks!=undefined)
            this.formdata.get('returnRemark')?.setValue(this.budgetDataLists[0].returnRemarks);
          this.amountUnit=this.budgetDataLists[0].amountUnit.amountType;
          for(let data of this.budgetDataLists){
            data.bal=(parseFloat(data.allocationAmount)+parseFloat(data.revisedAmount)).toFixed(4);
          }
          this.oldBudgetDataLists=result['response'].oldBudgetRevision;
          for(let data of this.oldBudgetDataLists){
            data.bal=(parseFloat(data.allocationAmount)+parseFloat(data.revisedAmount)).toFixed(4);
          }
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
      remarks: formDataValue.returnRemark,
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
      remarks: formDataValue.returnRemark,
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
      // console.log(file);
      const formData = new FormData();
      // console.log(this.formdata.get('file')?.value);
      formData.append('file', file);
      debugger;
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
        // console.log(result['response'].pathURL);
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

  confirm(){

  }

  confirmModel(formDataValue: any) {
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
        this.save(formDataValue);
      }
    });
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
      .postApi(this.cons.api.saveAuthDataRevision, newSubmitJson)
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
      let table:any= {
        Financial_Year: this.budgetDataLists[i].finYear.finYear.replaceAll(',',' '),
        Unit: this.budgetDataLists[i].toUnit.descr.replaceAll(',',' '),
        Subhead: this.budgetDataLists[i].subHead.subHeadDescr.replaceAll(',',' '),
        Type: this.budgetDataLists[i].allocTypeId.allocType.replaceAll(',',' '),
        Allocated_Fund: this.budgetDataLists[i].allocationAmount.replaceAll(',',' ')+' ' +this.budgetDataLists[i].amountUnit.amountType,
        AdditionalOrWithdrawal: this.budgetDataLists[i].revisedAmount.replaceAll(',',' ')+' ' +this.budgetDataLists[i].amountUnit.amountType,
        Revised:(parseFloat(this.budgetDataLists[i].allocationAmount)+parseFloat(this.budgetDataLists[i].revisedAmount))+' ' +this.budgetDataLists[i].amountUnit.amountType
      }
      tableData.push(table);
    }
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
  downloadCsv1() {
    let tableData=[];
    let totalR=0.0;
    let totalA=0.0;
    let totalRE=0.0;
    debugger;
    for(let i=0;i<this.budgetDataLists.length;i++){
      if(parseFloat(this.budgetDataLists[i].revisedAmount.replaceAll(',',' '))==0||this.budgetDataLists[i].toUnit.unit==this.userUnitId)
        continue;
      let table:any= {
        Financial_Year: this.budgetDataLists[i].finYear.finYear.replaceAll(',',' '),
        Unit: this.budgetDataLists[i].toUnit.descr.replaceAll(',',' '),
        Subhead: this.budgetDataLists[i].subHead.subHeadDescr.replaceAll(',',' '),
        Type: this.budgetDataLists[i].allocTypeId.allocType.replaceAll(',',' '),
        Allocated_Fund: this.budgetDataLists[i].allocationAmount.replaceAll(',',' '),
        AdditionalOrWithdrawal: this.budgetDataLists[i].revisedAmount.replaceAll(',',' '),
        Revised:Number((parseFloat(this.budgetDataLists[i].allocationAmount)+parseFloat(this.budgetDataLists[i].revisedAmount))).toFixed(4)
      }
      totalA=totalA+parseFloat(this.budgetDataLists[i].allocationAmount);
      totalR=totalR+(parseFloat(this.budgetDataLists[i].allocationAmount)+parseFloat(this.budgetDataLists[i].revisedAmount));
      totalRE=totalRE+(parseFloat(this.budgetDataLists[i].revisedAmount));
      tableData.push(table);
    }
    let table:any= {
      Financial_Year: '',
      Unit: '',
      Subhead: '',
      Type: 'Total',
      Allocated_Fund: Number(totalA).toFixed(4),
      AdditionalOrWithdrawal: Number(totalRE).toFixed(4),
      Revised:Number(totalR).toFixed(4)
    };

    tableData.push(table);
    table= {
      Financial_Year: '',
      Unit: '',
      Subhead: '',
      Type: 'Grand Total',
      Allocated_Fund: Number(totalA).toFixed(4),
      AdditionalOrWithdrawal: Number(totalRE).toFixed(4),
      Revised:Number(totalR).toFixed(4)
    }
    tableData.push(table)
    const columns = [
      'Financial_Year',
      'Unit',
      'Subhead',
      'Type',
      'Allocated_Fund' + ' in ' + this.budgetDataLists[0].amountUnit.amountType,
      'AdditionalOrWithdrawal'+' in ' + this.budgetDataLists[0].amountUnit.amountType,
      'Revised'+' in '+this.budgetDataLists[0].amountUnit.amountType
    ];
    const column = ['Financial_Year',
      'Unit',
      'Subhead',
      'Type',
      'Allocated_Fund',
      'AdditionalOrWithdrawal',
      'Revised'
    ];
    const filename = 'RevisionAllocation.csv';
    this.generateCSV(tableData, columns, filename, column);
  }
  generateCSV(
    data: any[],
    columns: string[],
    filename: string,
    column: string[]
  ) {
    const csvData: any[][] = [];

    // Add column names as the first row
    csvData.push(columns);

    // Add data rows
    data.forEach((item) => {
      const row: string[] = [];
      column.forEach((colmn) => {
        row.push(item[colmn]);
      });
      csvData.push(row);
    });

    // Convert the array to CSV using PapaParse
    const csv = Papa.unparse(csvData);

    // Create a CSV file download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for unsupported browsers
      alert('CSV download is not supported in this browser.');
    }
  }

  setLabel() {
    debugger;
    this.filename=this.browseFileInput.nativeElement.value;
  }

  downloadPDF() {
    this.apiService
      .getApi(this.cons.api.getRevisedAllocationReport+'/'+localStorage.getItem('group_id'))
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
            );
            // console.log(result['response']);
          }
          // else if(result['message'] =='PENDING RECORD NOT FOUND'){
          //   this.apiService.getApi(this.cons.api.getRevisedAllocationAprReport+'/'+localStorage.getItem('group_id'))
          //     .subscribe({
          //       next: (v: object) => {
          //         this.SpinnerService.hide();
          //         let result: { [key: string]: any } = v;
          //         if (result['message'] == 'success') {
          //           this.downloadPdf(
          //             result['response'][0].path,
          //             result['response'][0].fileName
          //           );
          //         } else {
          //           this.common.faliureAlert(
          //             'Please try later',
          //             result['message'],
          //             ''
          //           );
          //         }
          //       },
          //       error: (e) => {
          //         this.SpinnerService.hide();
          //         console.error(e);
          //         this.common.faliureAlert('Error', e['error']['message'], 'error');
          //       },
          //       complete: () => console.info('complete'),
          //     });
          //
          // }
          else {
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
  downloadPdf(pdfUrl: string, fileName: any): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, fileName);
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }
  checkDate(formdata:any,field:string) {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const cbDate = this.datePipe.transform(
      new Date(formdata.authDate),
      'yyyy-MM-dd'
    );
    if (cbDate != null && date != null) {
      if (cbDate > date) {
        Swal.fire('Date cannot be a future date');
        this.formdata.get(field)?.reset();
        // console.log('date= ' + this.formdata.get('cbDate')?.value);
      }
    }
    let flag:boolean=this.common.checkDate(this.formdata.get(field)?.value);
    if(!flag){
      this.common.warningAlert('Invalid Date','Enter date of this fiscal year only','');
      this.formdata.get(field)?.reset();
    }
  }
  private finallyMoveArchive(msgId:string) {
    this.apiService
      .getApi(this.cons.api.moveToArchive +'/'+msgId)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;

        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
}
