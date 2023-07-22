import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import * as $ from 'jquery';
// import { UploadDocuments } from '../model/upload-documents';

class newCb {
  sanction:any;
  gst:any;
  cbFilePath:any;
  label: string = '';
  isFlag: any;
  cbId: any;
  onAccOf: any;
  authDetail: any;
  contingentBilId: any;
  budgetHeadID: any;
  authUnitId: any;
  unitId: any;
  uploadFileDate: any;
  finSerialNo: any;
  progressiveAmount: any;
  fileNo: any;
  fileDate: any;
  minorHead: any;
  unit: any;
  finYearName: any;
  majorHead: any;
  subHead: any;
  amount: any;
  file: any;
  cbNo: any;
  cbDate: any;
  // remarks: any;
  authority: any;
  authorityUnit: any;
  date: any;
  firmName: any;
  invoiceNo: any;
  invoiceDate: any;
  invoiceFile: any;
  returnRemarks: any;
  status: any;
  checked?: boolean;
  budgetAllocated: any;
  authorityId: any;
  invoicePath: any;
  authGroupId: any;
  cdaParkingId:any;
}

class submitCb {
  oldCbId:any;
  gst:any;
  cdaParkingId:any;
  allocationTypeId: any;
  invoiceDocId: any;
  authorityDetails: any;
  onAccountOf: any;
  invoiceUploadId: any;
  budgetFinancialYearId: any;
  cbAmount: any;
  cbNumber: any;
  unit: any;
  cbDate: any;
  fileDate: any;
  fileNumber: any;
  docUploadDate: any;
  progressiveAmount: any;
  budgetHeadId: any;
  remark: any;
  vendorName: any;
  invoiceNo: any;
  invoiceDate: any;
  authList: authList[] | undefined;
  contingentBilId: any;
  sectionNumber:any;
}

class authList {
  authDocId: any;
  authority: any;
  authUnitId: any;
  authDate: any;
  authorityId: any;
  remarks: any;
}

@Component({
  selector: 'app-new-contigent-bill',
  templateUrl: './new-contigent-bill.component.html',
  styleUrls: ['./new-contigent-bill.component.scss'],
})
export class NewContigentBillComponent implements OnInit {
  @ViewChild('browseFileInput') browseFileInput: any;
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  @ViewChild('uploadFileInput') uploadFileInput: any;
  p: number = 1;
  approvedPresent: boolean = false;
  finYearData: any;
  subHeadData: any;
  unitData: any;
  minorHeadData: any;
  majorHeadData: any;
  subHead: any;
  majorHead: any;
  minorHead: any;
  fundAvailable: any;
  cbList: newCb[] = [];
  formData = new FormGroup({
    uploadFile: new FormControl(),
  });
  formdata = new FormGroup({
    gst:new FormControl(),
    onAccOf: new FormControl(
      'Quarterly payment(3rd Qtr) towars hiring of Designer/Developer IT Manpower(Project SDOT)'
    ),
    authDetail: new FormControl(
      'S1.10.1 of Shedule-10 of DFPCG-2017 vide Govt. of India, Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017'
    ),
    subHeadType: new FormControl(),
    amount: new FormControl(),
    progressive: new FormControl(),
    balance: new FormControl(),
    fileNo: new FormControl(),
    fileDate: new FormControl(),
    budgetAllocated: new FormControl(),
    minorHead: new FormControl(), //
    unit: new FormControl(), //
    finYearName: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    file: new FormControl(),
    cbNo: new FormControl(),
    cbDate: new FormControl(),
    // remarks: new FormControl(),
    authority: new FormControl(),
    authorityUnit: new FormControl(),
    date: new FormControl(),
    firmName: new FormControl(),
    invoiceNo: new FormControl(),
    invoiceDate: new FormControl(),
    invoiceFile: new FormControl(),
    returnRemarks: new FormControl(),
  });
  budgetAllotted: any;
  billAmount: number = 0;
  expenditure: number = 0;
  selectedFile: File | any = null;
  fileName = '';
  invoice: any;
  browse: any;
  private uploadFileDate: any;
  private invoicePath: any;
  masterChecked: boolean = false;
  dasboardData: any;
  allocation: any;
  FundAllotted: any;
  label: string = 'Choose File';
  cdaData: any;
  private sanctionCount:number=0;
  showUpdate: boolean=false;
  showSave: boolean=true;
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private http: HttpClient,
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');
    this.getMajorHead();
    this.getFinancialYear();
    this.getCgUnitData();
    this.getCBData();
    this.getDashBoardDta();
    this.getSubHeadType();
    this.getSanctionNumber();
  }

  addToList() {
    const undefinedValues: string[] = [];
    Object.keys(this.formdata.controls).forEach((key) => {
      const control = this.formdata.get(key);
      if (control != null) {
        if (!control.value) {
          if (
            key != 'returnRemarks' &&
            key != 'firmName' &&
            key != 'invoiceFile'
          ) {
            undefinedValues.push(key);
          }
        }
      }
    });
    if (this.invoice == undefined) {
      undefinedValues.push('invoiceFile');
    }
    let cdatabledata=[];
    for(let cda of this.cdaData){
      const x={
        cdaParkingId:cda.cdaParkingId,
        cdaAmount:cda.amount
      }
      if(cda.amount!=undefined||cda.amount>0)
      cdatabledata.push(x);
    }
    debugger;
    if(!this.amountEqualCda){
      this.common.warningAlert('cda amount not equal to bill amount','','');
      return;
    }
    if (undefinedValues.length == 0) {
      const cb: newCb = {
        gst:this.formdata.get('gst')?.value,
        isFlag: undefined,
        cbId: undefined,
        onAccOf: this.formdata.get('onAccOf')?.value,
        authDetail: this.formdata.get('authDetail')?.value,
        authUnitId: this.unitId,
        unitId: this.unitId,
        finSerialNo: this.formdata.get('finYearName')?.value.serialNo,
        budgetAllocated: this.formdata.get('budgetAllocated')?.value,
        minorHead: this.formdata.get('minorHead')?.value.minorHead,
        unit: this.unitName,
        finYearName: this.formdata.get('finYearName')?.value.finYear,
        majorHead: this.formdata.get('majorHead')?.value.majorHead,
        subHead: this.formdata.get('subHead')?.value.subHeadDescr,
        amount: this.formdata.get('amount')?.value,
        file: this.browse,
        cbNo: this.formdata.get('cbNo')?.value,
        cbDate: this.formdata.get('cbDate')?.value,
        // remarks: this.formdata.get('remarks')?.value,
        authority: this.formdata.get('authority')?.value,
        sanction: this.formdata.get('authority')?.value,
        authorityUnit: this.unitName,
        date: this.formdata.get('date')?.value,
        firmName: this.formdata.get('firmName')?.value,
        invoiceNo: this.formdata.get('invoiceNo')?.value,
        invoiceDate: this.formdata.get('invoiceDate')?.value,
        invoiceFile: this.invoice,
        returnRemarks: this.formdata.get('returnRemarks')?.value,
        status: 'Pending for Submission',
        checked: false,
        progressiveAmount: this.formdata.get('progressive')?.value,
        fileNo: this.formdata.get('fileNo')?.value,
        fileDate: this.formdata.get('fileDate')?.value,
        uploadFileDate: this.uploadFileDate,
        authorityId: undefined,
        budgetHeadID: '123',
        contingentBilId: undefined,
        invoicePath: this.invoicePath,
        authGroupId: undefined,
        label: '',
        cdaParkingId: cdatabledata,
        cbFilePath: undefined
      };

      let flag = false;
      for (let i = 0; i < this.cbList.length; i++) {
        if (this.cbList[i].cbNo == cb.cbNo) {
          flag = true;
        }
      }
      if (!flag) {
        this.cbList.push(cb);
        this.cleardata(0);
        this.getFinancialYear();
        this.updateInbox();
        // console.log('?????????????'+this.invoiceFileInput);
        const label=document.getElementById("invoice2");
        if(label!=null)
          label.textContent='Choose File';
        this.invoiceFileInput=undefined;
        this.formdata.get('file')?.reset();
        const label1=document.getElementById("browseFile");
        if(label1!=null)
          label1.textContent='Choose File';
        this.browseFileInput=undefined;

        this.common.successAlert('Success', 'Data Added Successfully','success');
        // this.showUpdate=true;
        this.sanctionCount++;
        this.formdata.get('authority')?.setValue(this.sanctionCount);
      } else {
        Swal.fire(
          'Duplicate Entry. Select Update to update previously entered CB'
        );
      }
    } else {
      Swal.fire('Enter missing data');
    }
  }

  getSubHeadType() {
    this.apiService.getApi(this.cons.api.getSubHeadType).subscribe({
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

  getAvailableFundData() {
    if(this.formdata.get('subHead')?.value==undefined)
    {
      Swal.fire('Sub Head cannot be blank.');
      return;
    }
    this.SpinnerService.show();
    let json = {
      budgetHeadId: this.formdata.get('subHead')?.value.budgetCodeId,
      budgetFinancialYearId:this.formdata.get('finYearName')?.value.serialNo,
      unitId:this.unitId
    };
    this.apiService.postApi(this.cons.api.getAvailableFund, json).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.FundAllotted = result['response'];
          this.expenditure = parseFloat(this.FundAllotted.expenditure);
          this.formdata.get('progressive')?.setValue(this.expenditure);
          if (result['response'].fundAvailable == 0) {
            this.budgetAllotted = 0;
            this.formdata.get('budgetAllocated')?.setValue(0);
          } else {
            this.budgetAllotted = (
              parseFloat(result['response'].fundallocated) *
              parseFloat(result['response'].amountUnit.amount)
            ).toFixed(4);
            this.formdata
              .get('budgetAllocated')
              ?.setValue(
                (
                  parseFloat(result['response'].fundallocated) *
                  parseFloat(result['response'].amountUnit.amount)
                ).toFixed(4)
              );
          }
          this.cdaData=result['response'].cdaParkingTrans;
          for(let cda of this.cdaData){
            cda.remainingCdaAmount=Number((parseFloat(cda.remainingCdaAmount)*parseFloat(this.FundAllotted.amountUnit.amount)).toFixed(4));
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
      complete: () => {
        debugger;
        if(this.formdata.get('amount')?.value!=undefined){
        this.updateExpenditure();
      }},
    });
  }

  getCheckedRows(cbNo: any) {
    this.cbList.forEach((cbEntry) => {
      if (cbEntry.cbNo == cbNo && cbEntry.checked == false) {
        cbEntry.checked = true;
        // this.updateFormdata(cbEntry);
      } else if (cbEntry.cbNo == cbNo && cbEntry.checked == true) {
        cbEntry.checked = false;
        this.formdata.reset();
        this.formdata
          .get('onAccOf')
          ?.setValue(
            'Quarterly payment(3rd Qtr) towars hiring of Designer/Developer IT Manpower(Project SDOT)'
          );
        this.formdata
          .get('authDetail')
          ?.setValue(
            'S1.10.1 of Shedule-10 of DFPCG-2017 vide Govt. of India, Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017'
          );
      }
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
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  getFinancialYear() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.finYearData = result['response'];
        // this.formdata.get('finYearName')?.setValue(this.finYearData[0]);
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
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
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }
  unitId: any;
  unitName: any;
  private getDashboardData() {
    this.apiService.postApi(this.cons.api.getDashboardData, null).subscribe(
      (results) => {
        this.SpinnerService.hide();
        // $.getScript('assets/js/adminlte.js');
        let result: { [key: string]: any } = results;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.unitId = result['response'].userDetails.unitId;
          this.unitName = result['response'].userDetails.unit;
          this.formdata.get('unit')?.setValue(this.unitName);
          this.formdata.get('authorityUnit')?.setValue(this.unitName);
        }
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }
  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.finYear=result['response'].budgetFinancialYear;
          if(this.sharedService.finYear!=undefined)
            this.formdata.get('finYearName')?.setValue(this.sharedService.finYear);

          this.dasboardData = result['response'];
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.unitId = result['response'].userDetails.unitId;
          this.unitName = result['response'].userDetails.unit;
          this.formdata.get('unit')?.setValue(this.unitName);
          this.formdata.get('authorityUnit')?.setValue(this.unitName);
          this.allocation = this.dasboardData.allocationType;
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          // console.log('DATA>>>>>>>' + this.dasboardData);
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

  private getCBData() {
    this.apiService.getApi(this.cons.api.getCb).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        // console.log(result['response']);
        let getCbList = result['response'];

        for (let i = 0; i < getCbList.length; i++) {
          if(getCbList[i].authoritiesList.length>0) {
            let cdaData=[];
            for(let cda of getCbList[i].cdaData){
              const cdaItr = {
                cdaParkingId:cda.cdaParkingTrans,
                cdaAmount:cda.amount
              };
              cdaData.push(cdaItr);
            }
            const entry: newCb = {
              gst:getCbList[i].gst,
              cdaParkingId: cdaData,
              isFlag: getCbList[i].isFlag,
              cbId: getCbList[i].cbId,
              authUnitId: getCbList[i].authoritiesList[0].authUnit,
              unitId: getCbList[i].cbUnitId.unit,
              uploadFileDate: getCbList[i].fileDate,
              finSerialNo: getCbList[i].finYear.serialNo,
              progressiveAmount: undefined,
              fileDate: getCbList[i].fileDate,
              minorHead: getCbList[i].budgetHeadID.minorHead,
              unit: getCbList[i].cbUnitId.cgUnitShort,
              finYearName: getCbList[i].finYear.finYear,
              majorHead: getCbList[i].budgetHeadID.majorHead,
              subHead: getCbList[i].budgetHeadID.subHeadDescr,
              amount: getCbList[i].cbAmount,
              cbNo: getCbList[i].cbNo,
              cbDate: this.datePipe.transform(
                new Date(getCbList[i].cbDate),
                'yyyy-MM-dd'
              ),
              // remarks: getCbList[i].remarks,
              authority: getCbList[i].authoritiesList[0].authority,
              sanction: getCbList[i].authoritiesList[0].authority,
              authorityUnit: getCbList[i].authoritiesList[0].authUnit,
              date: this.datePipe.transform(
                new Date(getCbList[i].authoritiesList[0].authDate),
                'yyyy-MM-dd'
              ),
              firmName: getCbList[i].vendorName,
              invoiceNo: getCbList[i].invoiceNO,
              invoiceDate: getCbList[i].invoiceDate,
              invoiceFile: getCbList[i].fileID,
              returnRemarks: getCbList[i].remarks,
              status: getCbList[i].status,
              budgetAllocated: undefined,
              checked: false,
              fileNo: getCbList[i].fileID,
              file: getCbList[i].authoritiesList[0].docId,
              budgetHeadID: getCbList[i].budgetHeadID,
              contingentBilId: getCbList[i].cbId,
              authorityId: getCbList[i].authoritiesList[0].authorityId,
              onAccOf: getCbList[i].onAccountOf,
              authDetail: getCbList[i].authorityDetails,
              invoicePath: getCbList[i].invoiceUploadId.pathURL,
              authGroupId: getCbList[i].authoritiesList[0].authGroupId,
              label: '',
              cbFilePath: getCbList[i].cbFilePath
            };
            if (entry.status == 'Approved')
              this.approvedPresent = true;
            else if(entry.status=='Pending'||entry.status=='Rejected')
              // this.showUpdate=true;
            this.cbList.push(entry);
          }

          //     this.SpinnerService.hide();
          //   },
          //   (error) => {
          //     console.error(error);
          //     this.SpinnerService.hide();
          //     //remove after test
          //   }
          // );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  setSubHead() {
    this.showSave=true;
    this.showUpdate=false;
    this.SpinnerService.show();
    this.formdata.get('minorHead')?.setValue(this.majorHead);
    this.SpinnerService.show();
    let json = {
      budgetHeadType: this.formdata.get('subHeadType')?.value.subHeadTypeId,
      majorHead: this.formdata.get('majorHead')?.value.majorHead,
    };
    this.apiService
      .postApi(this.cons.api.getAllSubHeadByMajorHead, json)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          this.subHeadData = result['response'];
          this.SpinnerService.hide();
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }

  updateExpenditure() {
    this.formdata.get('progressive')?.setValue(this.expenditure);
    if (
      this.formdata.get('amount')?.value >
      this.budgetAllotted - parseFloat(this.formdata.get('progressive')?.value)
    ) {
      this.formdata.get('amount')?.reset();
      this.common.warningAlert(
        'CB Amount Exceed Limit',
        'CB amount cannot be greater than Budget Alloted',
        ''
      );
      // Swal.fire("CB amount cannot be greater than Budget Alloted")
      return;
    }
    if (this.formdata.get('amount')?.value == null) {
      this.formdata.get('amount')?.reset();
      Swal.fire('Invalid amount. Enter Number');
    } else if (this.formdata.get('amount')?.value < 0) {
      Swal.fire('Invalid amount. Negative value not allowed');
      this.formdata.get('amount')?.reset();
    } else {
      // this.expenditure = parseFloat(this.expenditure) + this.billAmount;
      this.formdata
        .get('progressive')
        ?.setValue(
          this.expenditure + parseFloat(this.formdata.get('amount')?.value)
        );
      this.formdata
        .get('balance')
        ?.setValue(
          parseFloat(this.formdata.get('budgetAllocated')?.value) -
            (this.expenditure + parseFloat(this.formdata.get('amount')?.value))
        );
    }
  }

  upload(key: string) {
    if (key == 'invoice') {
      const file: File = this.invoiceFileInput.nativeElement.files[0];
      // console.log(file);
      const formData = new FormData();
      // console.log(this.formdata.get('file')?.value);
      formData.append('file', file);
      this.SpinnerService.show();
      this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.invoice = result['response'].uploadDocId;
            this.invoicePath = result['response'].uploadPathUrl;
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
    } else {
      const file: File = this.browseFileInput.nativeElement.files[0];
      // console.log(file);
      const formData = new FormData();
      // console.log(this.formdata.get('file')?.value);
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
            this.uploadFileDate = this.datePipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            // console.log(this.uploadFileDate);
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
  }
  cdaDatacb:any;
  updateFormdata(cbEntry: newCb) {
    this.showUpdate=true;
    this.showSave=false;
    debugger;
    // console.log('cbentry' + cbEntry);
    for (let i = 0; i < this.majorHeadData.length; i++) {
      let major = this.majorHeadData[i];
      if (major.majorHead == cbEntry.majorHead) {
        this.formdata.get('majorHead')?.setValue(cbEntry.majorHead);
        this.majorHead = major;
        if (this.subHeadData == undefined) {
          for (let i = 0; i < this.subHeadType.length; i++) {
            if (
              this.subHeadType[i].subHeadTypeId ==
              cbEntry.budgetHeadID.subHeadTypeId
            ) {
              this.formdata.get('subHeadType')?.setValue(this.subHeadType[i]);
              this.SpinnerService.show();
              this.formdata.get('minorHead')?.setValue(this.majorHead);
              this.SpinnerService.show();
              let json = {
                budgetHeadType:
                  this.formdata.get('subHeadType')?.value.subHeadTypeId,
                majorHead: cbEntry.majorHead,
              };
              this.apiService
                .postApi(this.cons.api.getAllSubHeadByMajorHead, json)
                .subscribe(
                  (res) => {
                    let result: { [key: string]: any } = res;
                    this.subHeadData = result['response'];
                    for (let i = 0; i < this.subHeadData.length; i++) {
                      let sub = this.subHeadData[i];
                      if (sub.subHeadDescr == cbEntry.subHead) {
                        this.formdata.get('subHead')?.setValue(sub);
                        this.SpinnerService.show();
                        let json = {
                          budgetHeadId:
                            this.formdata.get('subHead')?.value.budgetCodeId,
                            budgetFinancialYearId:this.formdata.get('finYearName')?.value.serialNo,
                            unitId:this.unitId
                        };
                        this.apiService
                          .postApi(this.cons.api.getAvailableFund, json)
                          .subscribe({
                            next: (v: object) => {
                              this.SpinnerService.hide();
                              let result: { [key: string]: any } = v;
                              if (result['message'] == 'success') {
                                this.FundAllotted = result['response'];
                                this.expenditure = parseFloat(
                                  this.FundAllotted.expenditure
                                );
                                this.formdata
                                  .get('progressive')
                                  ?.setValue(this.expenditure);
                                this.formdata
                                  .get('budgetAllocated')
                                  ?.setValue(
                                    parseFloat(
                                      this.FundAllotted.fundallocated
                                    ) * this.FundAllotted.amountUnit.amount
                                  );
                                this.budgetAllotted = cbEntry.budgetAllocated;
                                this.formdata
                                  .get('progressive')
                                  ?.setValue(
                                    parseFloat(this.FundAllotted.expenditure)
                                  );
                                this.formdata
                                  .get('balance')
                                  ?.setValue(
                                    parseFloat(
                                      this.FundAllotted.fundAvailable
                                    ) *
                                      this.FundAllotted.amountUnit.amount -
                                      parseFloat(this.FundAllotted.expenditure)
                                  );
                                this.cdaData=result['response'].cdaParkingTrans;
                                for(let cda of this.cdaData){
                                  cda.remainingCdaAmount=parseFloat(cda.remainingCdaAmount)*parseFloat(cda.amountType.amount);
                                  for(let cbEntryItr of cbEntry.cdaParkingId){
                                    if(cda.cdaParkingId==cbEntryItr.cdaParkingId)
                                      cda.amount=cbEntryItr.cdaAmount;
                                  }
                                }
                              } else {
                                this.common.faliureAlert(
                                  'Please try later',
                                  result['message'],
                                  ''
                                );
                              }
                            },
                            error: (e) => {
                              this.SpinnerService.hide();
                              console.error(e);
                              this.common.faliureAlert(
                                'Error',
                                e['error']['message'],
                                'error'
                              );
                            },
                            complete: () => console.info('complete'),
                          });
                      }
                    }
                    this.SpinnerService.hide();
                  },
                  (error) => {
                    console.error(error);
                    this.SpinnerService.hide();
                  }
                );
            }
          }
        } else {
          for (let i = 0; i < this.subHeadData.length; i++) {
            let sub = this.subHeadData[i];
            if (sub.subHeadDescr == cbEntry.subHead) {
              this.formdata.get('subHead')?.setValue(sub);
              let json = {
                budgetHeadId: this.formdata.get('subHead')?.value.budgetCodeId,
                budgetFinancialYearId:this.formdata.get('finYearName')?.value.serialNo,
                unitId:this.unitId
              };
              this.apiService
                .postApi(this.cons.api.getAvailableFund, json)
                .subscribe({
                  next: (v: object) => {
                    this.SpinnerService.hide();
                    let result: { [key: string]: any } = v;
                    if (result['message'] == 'success') {
                      this.FundAllotted = result['response'];
                      this.expenditure = parseFloat(
                        this.FundAllotted.expenditure
                      );
                      this.formdata
                        .get('progressive')
                        ?.setValue(this.expenditure);
                      this.formdata
                        .get('budgetAllocated')
                        ?.setValue(
                          parseFloat(this.FundAllotted.fundallocated) *
                            this.FundAllotted.amountUnit.amount
                        );
                      this.budgetAllotted = cbEntry.budgetAllocated;
                      this.formdata
                        .get('progressive')
                        ?.setValue(parseFloat(this.FundAllotted.expenditure));
                      this.formdata
                        .get('balance')
                        ?.setValue(
                          parseFloat(this.FundAllotted.fundAvailable) *
                            this.FundAllotted.amountUnit.amount -
                            parseFloat(this.FundAllotted.expenditure)
                        );
                      this.cdaData=result['response'].cdaParkingTrans;
                      for(let cda of this.cdaData){
                        cda.remainingCdaAmount=parseFloat(cda.remainingCdaAmount)*parseFloat(cda.amountType.amount);
                        for(let cbEntryItr of cbEntry.cdaParkingId){
                          if(cda.cdaParkingId==cbEntryItr.cdaParkingId)
                            cda.amount=cbEntryItr.cdaAmount;
                        }
                      }

                    } else {
                      this.common.faliureAlert(
                        'Please try later',
                        result['message'],
                        ''
                      );
                    }
                  },
                  error: (e) => {
                    this.SpinnerService.hide();
                    console.error(e);
                    this.common.faliureAlert(
                      'Error',
                      e['error']['message'],
                      'error'
                    );
                  },
                  complete: () => console.info('complete'),
                });
            }
          }
        }
      }
    }

    this.formdata.get('gst')?.setValue(cbEntry.gst);
    this.formdata.get('amount')?.setValue(cbEntry.amount);
    this.formdata.get('unit')?.setValue(this.unitName);
    this.formdata.get('authorityUnit')?.setValue(this.unitName);
    // this.formdata.get('file')?.setValue(cbEntry.file);
    this.formdata.get('cbNo')?.setValue(cbEntry.cbNo);
    this.formdata.get('cbDate')?.setValue(cbEntry.cbDate);
    // this.formdata.get('remarks')?.setValue(cbEntry.remarks);
    this.formdata.get('authority')?.setValue(cbEntry.authority);
    this.formdata.get('date')?.setValue(cbEntry.date);
    this.formdata.get('firmName')?.setValue(cbEntry.firmName);
    this.formdata.get('invoiceNo')?.setValue(cbEntry.invoiceNo);
    this.formdata.get('invoiceDate')?.setValue(cbEntry.invoiceDate);
    this.viewFile(cbEntry.file);
    this.openPdfUrlInNewTab(cbEntry.invoicePath);

    this.formdata.get('returnRemarks')?.setValue(cbEntry.returnRemarks);
    for (let i = 0; i < this.minorHeadData.length; i++) {
      if (this.minorHeadData[i].minorHead == cbEntry.minorHead) {
        this.formdata.get('minorHead')?.setValue(this.minorHeadData[i]);
      }
    }
    for (let i = 0; i < this.finYearData.length; i++) {
      if (this.finYearData[i].finYear == cbEntry.finYearName)
        this.formdata.get('finYearName')?.setValue(this.finYearData[i]);
    }
    this.formdata.get('fileNo')?.setValue(cbEntry.fileNo);
    this.formdata.get('fileDate')?.setValue(cbEntry.fileDate);
    this.formdata.get('onAccOf')?.setValue(cbEntry.onAccOf);
    this.formdata.get('authDetail')?.setValue(cbEntry.authDetail);
  }

  updateList() {
    let flag=false;
    for (let i = 0; i < this.cbList.length; i++) {
      if (this.formdata.get('cbNo')?.value == this.cbList[i].cbNo) {
        flag=true;
        if (
          this.cbList[i].status == 'Pending' ||
          this.cbList[i].status == 'Rejected'
        ) {
          this.cbList[i].progressiveAmount=this.formdata.get('progressive')?.value;
          this.cbList[i].budgetAllocated =
            this.formdata.get('budgetAllocated')?.value;
          this.cbList[i].amount = this.formdata.get('amount')?.value;
          this.cbList[i].authority = this.formdata.get('authority')?.value;
          this.cbList[i].cbDate = this.formdata.get('cbDate')?.value;
          this.cbList[i].date = this.formdata.get('date')?.value;
          this.cbList[i].file = this.formdata.get('file')?.value;
          this.cbList[i].finYearName =
            this.formdata.get('finYearName')?.value.finYear;
          this.cbList[i].firmName = this.formdata.get('firmName')?.value;
          this.cbList[i].invoiceDate = this.formdata.get('invoiceDate')?.value;
          this.cbList[i].invoiceFile = this.formdata.get('invoiceFile')?.value;
          this.cbList[i].invoiceNo = this.formdata.get('invoiceNo')?.value;
          this.cbList[i].majorHead =
            this.formdata.get('majorHead')?.value.majorHead;
          this.cbList[i].minorHead =
            this.formdata.get('minorHead')?.value.minorHead;
          this.cbList[i].returnRemarks =
            this.formdata.get('returnRemarks')?.value;
          this.cbList[i].subHead =
            this.formdata.get('subHead')?.value.subHeadDescr;
          const updateAuthority: authList = {
            authDocId: this.browse,
            authority: this.cbList[i].authority,
            authUnitId: this.cbList[i].authUnitId,
            authDate: this.cbList[i].date,
            authorityId: this.cbList[i].authorityId,
            remarks: this.cbList[i].returnRemarks,
          };
          let sum=0;
            let cdatabledata=[];
            for(let cda of this.cdaData){
              const x={
                cdaParkingId:cda.cdaParkingId,
                cdaAmount:cda.amount
              }
              sum=sum+Number(cda.amount);
              if(cda.amount!=undefined||cda.amount>0)
              cdatabledata.push(x);
            }
            if(sum!=parseFloat(this.cbList[i].amount)){
              this.common.warningAlert('CDA Amount Mismatch','CDA amount not equal to CB amount','');
              return;
            }
            debugger;
            const updateCb: submitCb = {
              sectionNumber: this.cbList[i].authority,
              gst:this.formdata.get('gst')?.value,
              cdaParkingId:cdatabledata,
              allocationTypeId: this.allocation.allocTypeId,
              onAccountOf: 'onAccountOf',
              authorityDetails:
                'Sl. 10.1 of Schedule -10 of DFPCG-2017 vide Govt. of India , Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017',
              budgetHeadId: this.formdata.get('subHead')?.value.budgetCodeId,
              budgetFinancialYearId: this.cbList[i].finSerialNo,
              cbAmount: this.cbList[i].amount,
              cbNumber: this.cbList[i].cbNo,
              unit: this.cbList[i].unitId,
              fileNumber: this.cbList[i].fileNo,
              progressiveAmount: this.cbList[i].progressiveAmount,
              remark: ' ',
              vendorName: this.cbList[i].firmName,
              invoiceNo: this.cbList[i].invoiceNo,
              docUploadDate: this.cbList[i].uploadFileDate,
              fileDate: this.cbList[i].fileDate,
              cbDate: this.cbList[i].cbDate,
              invoiceDate: this.cbList[i].invoiceDate,
              invoiceUploadId: this.invoice,
              invoiceDocId: this.invoice,
              authList: [updateAuthority],
              contingentBilId: this.cbList[i].contingentBilId,
              oldCbId:this.cbList[i].cbId
            };
            let updateList = [updateCb];
            debugger;
            this.apiService
              .postApi(this.cons.api.updateContingentBill, updateList)
              .subscribe({
                next: (v: object) => {
                  let result: { [key: string]: any } = v;
                  if (result['message'] == 'success') {
                    this.cbList[i].status = 'Pending';
                    this.common.successAlert(
                      'Success',
                      result['response']['msg'],
                      'success'
                    );
                    this.showUpdate=false;
                    this.showSave=true;
                    // console.log(result['response']);
                    this.SpinnerService.hide();
                  } else {
                    this.common.faliureAlert(
                      'Please try later',
                      result['message'],
                      ''
                    );
                    this.SpinnerService.hide();
                  }
                },error: (e) => {
                  this.SpinnerService.hide();
                  console.error(e);
                  this.common.faliureAlert('Error', e['error']['message'], 'error');
                }
              });

        }
        else if (this.cbList[i].status == 'Pending for Submission') {
          let cdatabledata=[];
          let sum:any=0;
          for(let cda of this.cdaData){
            const x={
              cdaParkingId:cda.cdaParkingId,
              cdaAmount:cda.amount
            }
            if(cda.amount!=undefined||cda.amount>0) {
              cdatabledata.push(x);
              sum=Number((parseFloat(cda.amount)+parseFloat(sum))).toFixed(4);
            }
          }
          if(parseFloat(sum)!=parseFloat(this.formdata.get('amount')?.value)){
            this.common.warningAlert('CDA Amount Mismatch','CDA amount not equal to CB amount','');
            return;
          }
          let entry: newCb = {
            gst:this.formdata.get('gst')?.value,
            cdaParkingId: cdatabledata,
            isFlag: undefined,
            cbId: undefined,
            authUnitId: this.unitId,
            unitId: this.unitId,
            finSerialNo: this.formdata.get('finYearName')?.value.serialNo,
            budgetAllocated: this.formdata.get('budgetAllocated')?.value,
            minorHead: this.formdata.get('minorHead')?.value.minorHead,
            unit: this.unitName,
            finYearName: this.formdata.get('finYearName')?.value.finYear,
            majorHead: this.formdata.get('majorHead')?.value.majorHead,
            subHead: this.formdata.get('subHead')?.value.subHeadDescr,
            amount: this.formdata.get('amount')?.value,
            file: this.browse,
            cbNo: this.formdata.get('cbNo')?.value,
            cbDate: this.formdata.get('cbDate')?.value,
            authority: this.formdata.get('authority')?.value,
            sanction: this.formdata.get('authority')?.value,
            authorityUnit: this.unitName,
            date: this.formdata.get('date')?.value,
            firmName: this.formdata.get('firmName')?.value,
            invoiceNo: this.formdata.get('invoiceNo')?.value,
            invoiceDate: this.formdata.get('invoiceDate')?.value,
            invoiceFile: this.invoice,
            returnRemarks: this.formdata.get('returnRemarks')?.value,
            status: 'Pending for Submission',
            checked: false,
            progressiveAmount: this.formdata.get('progressive')?.value,
            fileNo: this.formdata.get('fileNo')?.value,
            fileDate: this.formdata.get('fileDate')?.value,
            uploadFileDate: this.uploadFileDate,
            authorityId: undefined,
            budgetHeadID: '123',
            contingentBilId: undefined,
            onAccOf: this.formdata.get('onAccOf')?.value,
            authDetail: this.formdata.get('authDetail')?.value,
            invoicePath: undefined,
            authGroupId: undefined,
            label: '',
            cbFilePath: undefined
          };
          this.cbList[i] = entry;
          this.common.successAlert('Updated','Successfully Updated','');
          this.showSave=true;
          this.showUpdate=false;
          this.formdata.get('authority')?.setValue(this.sanctionCount);
        } else {
          Swal.fire('Cannot be updated');
        }
      }
    }
    if(!flag)
      this.common.faliureAlert(
        'CB No. not found',
        'In case of change of Subhead or Financial Year. Update not allowed',
        ''
      );
  }

  submitList() {
    const submitList: submitCb[] = [];
    for (let i = 0; i < this.cbList.length; i++) {
      if (
        this.cbList[i].checked &&
        this.cbList[i].status == 'Pending for Submission'
      ) {
        let budgetId: string = '';
        for (let j = 0; j < this.subHeadData.length; j++) {
          if (this.subHeadData[j].subHeadDescr == this.cbList[i].subHead)
            budgetId = this.subHeadData[j].budgetCodeId;
        }
        const auth: authList = {
          authDocId: this.cbList[i].file,
          authority: this.cbList[i].authority,
          authUnitId: this.cbList[i].authUnitId,
          authDate: this.cbList[i].date,
          authorityId: undefined,
          remarks: this.cbList[i].returnRemarks,
        };
        const authList: authList[] = [auth];
        let cdatabledata=[];
        for(let cda of this.cdaData){

          const x={
            cdaParkingId:cda.cdaParkingId,
            cdaAmount:cda.amount
          }
          if(cda.amount!=undefined||cda.amount>0)
          cdatabledata.push(x);
        }
        const cb: submitCb = {
          sectionNumber:this.cbList[i].authority,
          oldCbId:undefined,
          gst:this.cbList[i].gst,
          cdaParkingId:cdatabledata,
          onAccountOf: this.cbList[i].onAccOf,
          authorityDetails: this.cbList[i].authDetail,
          budgetHeadId: budgetId,
          budgetFinancialYearId: this.cbList[i].finSerialNo,
          cbAmount: this.cbList[i].amount,
          cbNumber: this.cbList[i].cbNo,
          unit: this.cbList[i].unitId,
          fileNumber: this.cbList[i].fileNo,
          progressiveAmount: this.cbList[i].progressiveAmount,
          remark: ' ',
          vendorName: this.cbList[i].firmName,
          invoiceNo: this.cbList[i].invoiceNo,
          docUploadDate: this.cbList[i].uploadFileDate,
          fileDate: this.cbList[i].fileDate,
          cbDate: this.cbList[i].cbDate,
          invoiceDate: this.cbList[i].invoiceDate,
          invoiceUploadId: this.cbList[i].invoiceFile,
          invoiceDocId: this.cbList[i].invoiceFile,
          authList: authList,
          contingentBilId: undefined,
          allocationTypeId: this.allocation.allocTypeId,
        };
        if (this.cbList[i].status == 'Pending for Submission')
          submitList.push(cb);
      }
    }
    if (submitList.length == 0) {
      Swal.fire('Add more Data');
    } else {
      this.SpinnerService.show();
      this.apiService
        .postApi(this.cons.api.saveContingentBill, submitList)
        .subscribe({
          next: (v: object) => {
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {
              this.SpinnerService.hide();
              this.common.successAlert(
                'Success',
                result['response']['msg'],
                'success'
              );
              this.getDashboardData();
              for (let i = 0; i < submitList.length; i++) {
                for (let j = 0; j < this.cbList.length; j++) {
                  if (submitList[i].cbNumber == this.cbList[j].cbNo) {
                    this.cbList[j].status = 'Pending';
                  }
                }
              }
            } else {
              this.common.faliureAlert(
                'Please try later',
                result['message'],
                ''
              );
              this.SpinnerService.hide();
            }
          },error: (e) => {
            this.SpinnerService.hide();
            console.error(e);
            this.common.faliureAlert('Error', e['error']['message'], 'error');
          }
        });
      this.cleardata(1);
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
        this.submitList();
      }
    });
  }

  downloadBill(cb: any) {
    // console.log(cb);
    let json = {
      cbId: cb.cbId,
    };
    this.SpinnerService.show();
    this.apiService
      .postApi(this.cons.api.getContingentBillReport, json)
      .subscribe(
        (results) => {
          let result: { [key: string]: any } = results;
          this.downloadPdf(result['response'][0].path,result['response'][0].fileName);
        },
        (error) => {
          console.error(error);
          this.SpinnerService.hide();
        }
      );
  }
  docId: any;
  uploadBill(cb: any) {
    const file: File = this.uploadFileInput.nativeElement.files[0];
    // console.log(file);
    const formData = new FormData();
    // console.log(this.formdata.get('file')?.value);
    formData.append('file', file);
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
          this.docId = result['response'].uploadDocId;
          let json = {
            docId: result['response'].uploadDocId,
            groupId: cb.authGroupId,
          };
          this.apiService
            .postApi(this.cons.api.updateFinalStatus, json)
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
                  this.SpinnerService.hide();
                } else {
                  this.common.faliureAlert(
                    'Please try later',
                    result['message'],
                    ''
                  );
                  this.SpinnerService.hide();
                }
              },
              error: (e) => {
                this.SpinnerService.hide();
                console.error(e);
                this.common.faliureAlert(
                  'Error',
                  e['error']['message'],
                  'error'
                );
              },
              complete: () => this.SpinnerService.hide(),
            });

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
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  openPdfUrlInNewTab(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }

  downloadPdf(pdfUrl: string,filename:string): void {
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        //   this.http.get('https://icg.net.in/bmsreport/1681376372803.pdf', { responseType: 'blob' }).subscribe((blob: Blob) => {
        this.SpinnerService.hide();
        FileSaver.saveAs(blob, filename);
      },
      (error) => {
        this.SpinnerService.hide();
        console.error('Failed to download PDF:', error);
      }
    );
  }
  subHeadType: any;

  checkDate(formdate:string,field:string) {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const cbDate = this.datePipe.transform(
      new Date(this.formdata.get(formdate)?.value),
      'yyyy-MM-dd'
    );
    if (cbDate != null && date != null) {
      if (cbDate > date) {
        Swal.fire(field+' cannot be a future date');
        this.formdata.get(formdate)?.reset();
        // console.log('date= ' + this.formdata.get('cbDate')?.value);
      }
    }
  }

  cleardata(key: number) {
    if (key <= 0) this.formdata.get('majorHead')?.reset();
    if (key <= 1) this.formdata.get('subHeadType')?.reset();
    if (key <= 2) this.formdata.get('subHead')?.reset();
    if (key <= 3) this.formdata.get('minorHead')?.reset();
    if (key <= 4) this.formdata.get('amount')?.reset();
    if (key <= 5) this.formdata.get('cbNo')?.reset();
    if (key <= 6) this.formdata.get('cbDate')?.reset();
    if (key <= 8) this.formdata.get('authority')?.reset();
    if (key <= 9) this.formdata.get('date')?.reset();
    if (key <= 10) this.formdata.get('firmName')?.reset();
    if (key <= 11) this.formdata.get('invoiceNo')?.reset();
    if (key <= 12) this.formdata.get('invoiceDate')?.reset();
    if (key <= 13) this.formdata.get('fileNo')?.reset();
    if (key <= 14) this.formdata.get('fileDate')?.reset();
    if (key <= 15)
      this.formdata
        .get('onAccOf')
        ?.setValue(
          'Quarterly payment(3rd Qtr) towars hiring of Designer/Developer IT Manpower(Project SDOT)'
        );
    if (key <= 16)
      this.formdata
        .get('authDetail')
        ?.setValue(
          'S1.10.1 of Shedule-10 of DFPCG-2017 vide Govt. of India, Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017'
        );
  }

  selectAll() {
    for (let i = 0; i < this.cbList.length; i++) {
      this.cbList[i].checked = this.masterChecked;
      // console.log(this.cbList[i].checked);
    }
    // console.log(this.masterChecked);
  }

  getCbNo(formdata: any) {
    const cbCount = this.cbList.length + 1;
    const cbNo =
      this.dasboardData.userDetails.unit +
      '/CB/' +
      formdata.subHead.subheadShort +
      '/' +
      cbCount +
      '/' +
      formdata.finYearName.finYear;
    this.formdata.get('cbNo')?.setValue(cbNo);
  }

  updateInbox() {
    this.apiService.getApi(this.cons.api.updateInboxOutBox).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.approve=result['response'].approved;
          this.sharedService.archive=result['response'].archived;
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

  setLabel(formValue: any, i: any) {
    this.cbList[i].label = formValue.uploadFile;
  }
  amountEqualCda:boolean=false
  checkTotal() {
    this.amountEqualCda=false
    let sum=0.0;
    for(let cda of this.cdaData){
      if(cda.amount!=undefined)
        sum=sum+cda.amount;
    }
    if(sum==parseFloat(this.formdata.get('amount')?.value))
      this.amountEqualCda=true;
    else
      this.amountEqualCda=false;
  }

  private getSanctionNumber() {
    this.apiService.getApi(this.cons.api.getMaxSectionNumber).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.sanctionCount=Number(result['response'].sectionNumber);
          this.formdata.get('authority')?.setValue(this.sanctionCount);

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
    debugger;
  }
}
