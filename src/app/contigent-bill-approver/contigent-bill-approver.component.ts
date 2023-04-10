import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SharedService } from '../services/shared/shared.service';
import Swal from 'sweetalert2';

interface cb {
  authGroupId: any;
  onAccountOf: any;
  authorityDetails: any;
  contingentBilId: any;
  budgetHeadID: any;
  authUnitId: any;
  cbUnitId: any;
  uploadFileDate: any;
  finSerialNo: any;
  progressiveAmount: any;
  fileNo: any;
  fileDate: any;
  minorHead: any;
  cbUnit: any;
  finYearName: any;
  majorHead: any;
  subHead: any;
  amount: any;
  file: any;
  cbNo: any;
  cbDate: any;
  remarks: any;
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
}
class updateRequest {
  status: any;
  groupId: any;
  remarks: any;
}
@Component({
  selector: 'app-contigent-bill-approver',
  templateUrl: './contigent-bill-approver.component.html',
  styleUrls: ['./contigent-bill-approver.component.scss'],
})
export class ContigentBillApproverComponent implements OnInit {
  p: number = 1;
  finYearData: any;
  cbUnitData: any;
  majorHeadData: any;
  minorHeadData: any;
  majorHead: any;
  subHeadData: any;
  budgetAllotted: any;
  expenditure: any;
  constructor(
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private datePipe: DatePipe,
    private sharedService: SharedService
  ) {}
  selectedCb: any;
  cbList: cb[] = [];
  disabled: boolean = true;
  formdata = new FormGroup({
    budgetAllocated: new FormControl(),
    minorHead: new FormControl(), //
    cbUnit: new FormControl(), //
    finYearName: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    amount: new FormControl('0'),
    file: new FormControl(),
    cbNo: new FormControl(),
    cbDate: new FormControl(),
    remarks: new FormControl(),
    authority: new FormControl(),
    authorityUnit: new FormControl(),
    date: new FormControl(),
    firmName: new FormControl(),
    invoiceNo: new FormControl(),
    invoiceDate: new FormControl(),
    invoiceFile: new FormControl(),
    returnRemarks: new FormControl(),
  });
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getContingentBill();
    this.getMajorHead();
    this.getFinancialYear();
    this.getCgUnitData();
  }
  private getContingentBill() {
    this.cbList = [];
    this.apiService.getApi(this.cons.api.getCb).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        console.log(result['response']);
        let getCbList = result['response'];

        for (let i = 0; i < getCbList.length; i++) {
          let url =
            this.cons.api.getAvailableFund + '/' + getCbList[i].cbUnitId.cbUnit;
          this.apiService.getApi(url).subscribe(
            (res) => {
              let result: { [key: string]: any } = res;
              this.budgetAllotted = result['response'].fundAvailable;
            },
            (error) => {
              console.log(error);
              this.SpinnerService.hide();
              //remove after test
              this.budgetAllotted = 0;
              this.formdata
                .get('budgetAllocated')
                ?.setValue(this.budgetAllotted);
            }
          );
          const entry: cb = {
            authGroupId: getCbList[i].authoritiesList[0].authGroupId,
            onAccountOf: getCbList[i].onAccountOf,
            authorityDetails: getCbList[i].authorityDetails,
            authUnitId: getCbList[i].authoritiesList[0].authUnit,
            cbUnitId: getCbList[i].cbUnitId.cbUnit,
            uploadFileDate: getCbList[i].fileDate,
            finSerialNo: getCbList[i].finYear.serialNo,
            progressiveAmount: getCbList[i].progressiveAmount,
            fileDate: getCbList[i].fileDate,
            minorHead: getCbList[i].budgetHeadID.minorHead,
            cbUnit: getCbList[i].cbUnitId.descr,
            finYearName: getCbList[i].finYear.finYear,
            majorHead: getCbList[i].budgetHeadID.majorHead,
            subHead: getCbList[i].budgetHeadID.subHeadDescr,
            amount: getCbList[i].cbAmount,
            cbNo: getCbList[i].cbNo,
            cbDate: this.datePipe.transform(
              new Date(getCbList[i].cbDate),
              'yyyy-MM-dd'
            ),
            remarks: getCbList[i].remarks,
            authority: getCbList[i].authoritiesList[0].authority,
            authorityUnit: getCbList[i].authoritiesList[0].authUnit,
            date: this.datePipe.transform(
              new Date(getCbList[i].authoritiesList[0].authDate),
              'yyyy-MM-dd'
            ),
            firmName: getCbList[i].vendorName,
            invoiceNo: getCbList[i].invoiceNO,
            invoiceDate: getCbList[i].invoiceDate,
            invoiceFile: getCbList[i].invoiceUploadId.uploadID,
            returnRemarks: getCbList[i].authoritiesList[0].remarks,
            status: getCbList[i].status,
            budgetAllocated: this.budgetAllotted,
            checked: false,
            fileNo: getCbList[i].fileID,
            file: getCbList[i].authoritiesList[0].docId,
            budgetHeadID: getCbList[i].budgetHeadID,
            contingentBilId: getCbList[i].cbId,
          };
          if (entry.authGroupId == this.sharedService.sharedValue)
            this.cbList.push(entry);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getFinancialYear() {
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.getBudgetFinYear)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.finYearData = result['response'];
      });
  }
  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe((res) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = res;
      this.cbUnitData = result['response'];
    });
  }
  getMajorHead() {
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
      error: (e) => {},
      complete: () => console.info('complete'),
    });
  }
  getCheckedRows(cbNo: any) {
    this.cbList.forEach((cbEntry) => {
      if (cbEntry.cbNo == cbNo && cbEntry.checked == false) {
        cbEntry.checked = true;
        this.updateFormdata(cbEntry);
      } else if (cbEntry.cbNo == cbNo && cbEntry.checked == true)
        cbEntry.checked = false;
      if (cbEntry.checked) console.log(cbEntry.cbNo + ' ');
    });
  }
  private updateFormdata(cbEntry: cb) {
    for (let i = 0; i < this.majorHeadData.length; i++) {
      let major = this.majorHeadData[i];
      if (major.majorHead == cbEntry.majorHead) {
        this.formdata.get('majorHead')?.setValue(cbEntry.majorHead);
        this.majorHead = major;
        if (this.subHeadData == undefined) {
          this.SpinnerService.show();
          let url =
            this.cons.api.getAllSubHeadByMajorHead +
            '/' +
            this.majorHead.majorHead;
          this.apiService.getApi(url).subscribe((results) => {
            let result: { [key: string]: any } = results;
            this.subHeadData = result['response'];
            for (let i = 0; i < this.subHeadData.length; i++) {
              let sub = this.subHeadData[i];
              if (sub.subHeadDescr == cbEntry.subHead) {
                this.formdata.get('subHead')?.setValue(sub);
              }
            }
            this.SpinnerService.hide();
          });
        }
      }
    }
    this.formdata.get('budgetAllocated')?.setValue(cbEntry.budgetAllocated);

    this.formdata.get('amount')?.setValue(cbEntry.amount);
    this.getBudgetAllotted();

    this.formdata.get('cbNo')?.setValue(cbEntry.cbNo);
    this.formdata.get('cbDate')?.setValue(cbEntry.cbDate);
    this.formdata.get('remarks')?.setValue(cbEntry.remarks);
    this.formdata.get('authority')?.setValue(cbEntry.authority);
    this.formdata.get('date')?.setValue(cbEntry.date);
    this.formdata.get('firmName')?.setValue(cbEntry.firmName);
    this.formdata.get('invoiceNo')?.setValue(cbEntry.invoiceNo);
    this.formdata.get('invoiceDate')?.setValue(cbEntry.invoiceDate);
    this.formdata.get('invoiceFile')?.setValue(cbEntry.invoiceFile);
    this.formdata.get('returnRemarks')?.setValue(cbEntry.returnRemarks);
    for (let i = 0; i < this.minorHeadData.length; i++) {
      if (this.minorHeadData[i].minorHead == cbEntry.minorHead) {
        this.formdata.get('minorHead')?.setValue(this.minorHeadData[i]);
      }
    }
    for (let i = 0; i < this.cbUnitData.length; i++) {
      if (this.cbUnitData[i].descr == cbEntry.cbUnit)
        this.formdata.get('cbUnit')?.setValue(this.cbUnitData[i]);
      if (this.cbUnitData[i].unit == cbEntry.authorityUnit)
        this.formdata.get('authorityUnit')?.setValue(this.cbUnitData[i]);
    }
    for (let i = 0; i < this.finYearData.length; i++) {
      if (this.finYearData[i].finYear == cbEntry.finYearName)
        this.formdata.get('finYearName')?.setValue(this.finYearData[i]);
    }
    this.formdata.get('file')?.setValue(cbEntry.file);
  }
  getBudgetAllotted() {
    this.budgetAllotted = 0;
    this.formdata.get('budgetAllocated')?.setValue(this.budgetAllotted);
    this.getExpenditure();
  }
  private getExpenditure() {
    this.expenditure = 0;
    const proggressive = document.getElementById(
      'Proggressive'
    ) as HTMLInputElement;
    proggressive.setAttribute('value', this.expenditure.toString());
    this.updateExpenditure();
  }
  updateExpenditure() {
    this.expenditure = this.expenditure + this.formdata.get('amount')?.value;
    const proggressive = document.getElementById(
      'Proggressive'
    ) as HTMLInputElement;
    proggressive.setAttribute('value', this.expenditure.toString());
    const balance = document.getElementById('BalanceFund') as HTMLInputElement;
    balance.setAttribute(
      'value',
      (this.budgetAllotted - this.expenditure).toString()
    );
  }

  confirmModel() {
    Swal.fire({
      title: 'Are you sure you want to Approve this Batch?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveCb();
      }
    });
  }
  approveCb() {
    for (let i = 0; i < this.cbList.length; i++) {
      // if(this.cbList[i].cbNo==this.formdata.get('cbNo')?.value){
      this.cbList[i].status = 'Approved';
    }

    const update: updateRequest = {
      status: this.cbList[0].status,
      groupId: this.cbList[0].authGroupId,
      remarks: undefined,
    };
    this.apiService
      .postApi(this.cons.api.approveContingentBill, update)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.getContingentBill(),
      });
    this.cbList = [];
    this.getContingentBill();
    // }
    // }
    console.log(this.cbList);
  }

  confirmRejectModel() {
    Swal.fire({
      title: 'Are you sure you want to Reject this Batch?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveCb();
      }
    });
  }
  returnCb() {
    for (let i = 0; i < this.cbList.length; i++) {
      // if(this.cbList[i].cbNo==this.formdata.get('cbNo')?.value){
      this.cbList[i].status = 'Rejected';
    }
    const update: updateRequest = {
      status: this.cbList[0].status,
      groupId: this.cbList[0].authGroupId,
      remarks: this.formdata.get('returnRemarks')?.value,
    };
    this.apiService
      .postApi(this.cons.api.approveContingentBill, update)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => this.getContingentBill(),
      });
    // }
    // }
    console.log(this.cbList);
  }

  viewFile() {
    this.apiService
      .getApi(this.cons.api.fileDownload + this.formdata.get('file')?.value)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          console.log(result['response']);
        },
        (error) => {
          console.log(error);
          this.SpinnerService.hide();
        }
      );
  }
}
