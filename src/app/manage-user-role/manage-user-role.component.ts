import { Component } from '@angular/core';

import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { SubHeadWiseUnitList } from '../model/sub-head-wise-unit-list';
import { UploadDocuments } from '../model/upload-documents';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {DatePipe, Location} from '@angular/common';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-manage-user-role',
  templateUrl: './manage-user-role.component.html',
  styleUrls: ['./manage-user-role.component.scss'],
})
export class ManageUserRoleComponent {
  public userRole: any;

  name: any;

  roles: any[] = [];

  roleHeading: any;

  usersWithRole: any[] = [];
  cbCreaterList: any[] = [];

  allRoles: any[] = [];

  allUsers: any[] = [];

  userName: String | undefined;

  rank: String | undefined;

  allunits: any[] = [];

  isDisabled: any | undefined = true;

  submitJson: any;

  p: number = 1;

  searchText: any = '';

  formdata = new FormGroup({
    unit: new FormControl(),
    pno: new FormControl(),
    pno1: new FormControl(),
    role: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    userName: new FormControl(),
    rank: new FormControl(),
  });
  currentUserUnit: any;
  userCurrentUnitName: any;
  userName1: any;
  rank1: any;
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
    this.getAllUser();
    this.getAllRole();
    this.getCgUnitDataWithPurposeCode();
    this.getDashBoardDta();

    this.currentUserUnit = localStorage.getItem('userCurrentUnit');

    this.userCurrentUnitName = localStorage.getItem('userCurrentUnitName');
    $.getScript('assets/js/adminlte.js');
  }

  constructor(
    private datePipe:DatePipe,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private _router: Router,
    private _location: Location
  ) {}

  getAllRole() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllRole).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allRoles = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getAllUser() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllUser).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        // this.usersWithRole = result['response'];
        let valueFromAPI: any[] = result['response'];
        for (var i = 0; i < valueFromAPI.length; i++) {
          let userRole: any[] = valueFromAPI[i].role;
          for (var j = 0; j < userRole.length; j++) {
            debugger;
            this.usersWithRole.push({
              unit: valueFromAPI[i].unit,
              rank: valueFromAPI[i].rank,
              name: valueFromAPI[i].fullName,
              pno: valueFromAPI[i].pno,
              fromDate: valueFromAPI[i].fromDate,
              toDate: valueFromAPI[i].toDate,
              role: valueFromAPI[i].role[j].roleName,
              roleId: valueFromAPI[i].role[j].roleId,
              isActive: 1,
              pid: valueFromAPI[i].pid,
            });
            if(valueFromAPI[i].role[j].roleId=="116"){
              this.cbCreaterList.push({
                  unit: valueFromAPI[i].unit
                ,
                rank: valueFromAPI[i].rank,
                name: valueFromAPI[i].fullName,
                pno: valueFromAPI[i].pno,
                fromDate: valueFromAPI[i].fromDate,
                toDate: valueFromAPI[i].toDate,
                role: valueFromAPI[i].role[j].roleName,
                roleId: valueFromAPI[i].role[j].roleId,
                isActive: 1,
                pid: valueFromAPI[i].pid,});
            }
          }
        }

        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  unitID: any = '';

  getUserInfo() {


      this.apiService
        .getApi('https://icg.net.in/cghrdata/getAllData/getAllUserInfo')
        .subscribe((res) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = res;
          if (result['message'] == 'success') {
            this.allUsers = [];
            this.formdata.patchValue({
              pno: undefined,
              userName: undefined,
              rank: undefined,
            });
            this.allUsers = result['response'];
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        });

  }

  getCgUnitDataWithPurposeCode() {
    this.SpinnerService.show();

    this.apiService
      .getApi(this.cons.api.getCgUnitDataWithPurposeCode)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;

        if (result['message'] == 'success') {
          this.allunits = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  setOtherValues(event: any) {
    this.userName = event.name;
    this.rank = event.rank;
  }

  pushDataInMainList(formDataValue: any) {
    this.usersWithRole.push({
      unit: this.userCurrentUnitName,
      rank: formDataValue.pno.rank,
      name: formDataValue.pno.name,
      pno: formDataValue.pno.pno,
      fromDate: formDataValue.fromDate,
      toDate: formDataValue.toDate,
      role: formDataValue.role.roleName,
      isActive: 1,
    });
  }

  saveUserData(formDataValue: any) {
    let submitJson = {
      unitId: this.currentUserUnitNew,
      unit: this.currentUserUnitNameNew,
      pid: formDataValue.pno.pid,
      pno: formDataValue.pno.pno,
      fullName: formDataValue.pno.name,
      rank: formDataValue.pno.rank,
      userName: formDataValue.pno.userName,
      roleId: formDataValue.role.roleId,
      fromDate: formDataValue.fromDate,
      toDate: formDataValue.toDate,
    };

    this.confirmModel(submitJson, formDataValue);
  }

  confirmModel(data: any, formDataValue: any) {
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
        this.finallySubmit(data, formDataValue);
      }
    });
  }

  finallySubmit(data: any, formDataValue: any) {
    this.SpinnerService.show();
    var newSubmitJson = data;
    this.apiService.postApi(this.cons.api.createUser, newSubmitJson).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.pushDataInMainList(formDataValue);
          this.refresh();
          this.formdata.reset();
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

  refresh(): void {
    this._router
      .navigateByUrl('/manage-users', { skipLocationChange: true })
      .then(() => {
        this._router.navigate([decodeURI(this._location.path())]);
      });
  }
  cbCreaterNewList:any[]=[]
  deactivateUserRole(user: any, indexValue: any) {
    debugger;
    this.cbCreaterNewList=[];
    if(user.role=='CB Creator'){
      for(let userCb of this.cbCreaterList){
        if(userCb.pno!=user.pno){
          this.cbCreaterNewList.push(userCb);
        }
      }
      debugger;
      this.transfer=true;
    }

    else{
      this.deactivateUserRoleConfirmModel(user, indexValue - 1);
    }
  }
  closeTransferModal(){
    this.transfer=false;
  }

  deactivateUserRoleConfirmModel(data: any, formDataValue: any) {
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
        this.deactivateUserRoleFinallySubmit(data, formDataValue);
      }
    });
  }

  deactivateUserRoleFinallySubmit(data: any, indexValue: any) {
    debugger;
    this.SpinnerService.show();
    this.apiService
      .getApi(this.cons.api.deActivateUser + '/' + data.pid+'/'+data.roleId)
      .subscribe((res) => {
        let result: { [key: string]: any } = res;

        if (result['message'] == 'success') {
          this.usersWithRole.splice(indexValue, 1);
          this.SpinnerService.hide();
          this.common.faliureAlert('Request Successful', result['message'], '');
          window.location.reload();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      });
  }

  currentUserUnitNew: any;
  currentUserUnitNameNew: any;
  transfer: boolean=false;
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
            // ;

            this.currentUserUnitNew = result['response'].userDetails.unitId;
            this.currentUserUnitNameNew = result['response'].userDetails.unit;

            // this.userRole = result['response'].userDetails.unitId;
            this.getUserInfo();
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
  checkDate(formdata:any,field:string) {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const cbDate = this.datePipe.transform(
      new Date(this.formdata.get(field)?.value),
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
  setOtherValues1(event: any) {
    this.userName1 = event.name;
    this.rank1 = event.rank;
  }
}
