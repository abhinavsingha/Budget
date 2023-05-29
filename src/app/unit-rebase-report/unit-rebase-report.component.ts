import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { CommonService } from '../services/common/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-unit-rebase-report',
  templateUrl: './unit-rebase-report.component.html',
  styleUrls: ['./unit-rebase-report.component.scss'],
})
export class UnitRebaseReportComponent {
  formdata!: FormGroup;

  constructor(
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private common: CommonService
  ) {
    this.formdata = formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
  }

  downloadRebaseReport(formdata: any) {
    // var fromDateInMilliseconds = new Date(formdata.fromDate).getTime();
    this.SpinnerService.show();
    debugger;
    this.apiService
      .getApi(
        this.cons.api.getUnitRebaseReport +
          '/' +
          formdata.fromDate +
          '/' +
          formdata.toDate
      )
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          this.formdata.reset();
          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.downloadPdf(
              result['response'][0].path,
              result['response'][0].fileName
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
}
