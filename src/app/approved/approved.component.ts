import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ConstantsService} from "../services/constants/constants.service";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {FormBuilder} from "@angular/forms";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {SharedService} from "../services/shared/shared.service";

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss']
})
export class ApprovedComponent implements OnInit {
  list: any;
  private authDocPath: any;
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
  isShow=false;
  showDataTable(){
    this.isShow=true;
  }
  ngOnInit(): void {
   this.getApproved();

  }

  p: number = 1;

  private getApproved() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getApprovedList).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.SpinnerService.hide();
        this.list = result['response'];
        debugger;
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  redirect(entry: any) {
    this.sharedService.sharedValue = entry.groupId;
    this.sharedService.redirectedFrom = 'approved';
    this.router.navigate(['/budget-approval']);

    // this.SpinnerService.show();
    // this.apiService.getApi(this.cons.api.getApprovedListData+'/'+).subscribe((res) => {
    //   let result: { [key: string]: any } = res;
    //   if (result['message'] == 'success') {
    //     this.SpinnerService.hide();
    //     this.list = result['response'];
    //     debugger;
    //   } else {
    //     this.common.faliureAlert('Please try later', result['message'], '');
    //   }
    // });
  }

  getAuthDoc(entry: any) {
    this.apiService.getApi(this.cons.api.getApprovedFilePath+'/'+entry.groupId+'/'+entry.type).subscribe((res) => {
        let result: { [key: string]: any } = res;
        if (result['message'] == 'success') {
          this.SpinnerService.hide();
          this.authDocPath=result['response'].uploadID;
          this.viewFile(this.authDocPath);
          console.log('success');
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      //   error : (e) => {
      //   this.SpinnerService.hide();
      //   console.error(e);
      //   this.common.faliureAlert('Error', e['error']['message'], 'error');
      // }
      //   complete: () => {
      //   console.log("complete");
      // }
    );
  }
  viewFile(file: string) {
    this.apiService
      .getApi(this.cons.api.fileDownload +file)
      .subscribe(
        (res) => {
          let result: { [key: string]: any } = res;
          this.openPdfUrlInNewTab(result['response'].pathURL);
          console.log(result['result'].pathURL);
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
}
