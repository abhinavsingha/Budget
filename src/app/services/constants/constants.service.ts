import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}

  serviceUrl = 'https://icg.net.in/budget/'; //prod
  // serviceUrl = 'http://488e-203-153-42-234.ngrok.io/'; //dev
  // serviceUrl = 'http://192.168.1.131:1111/'; //dev

  api = {
    getDataBudgetAllocation:
      this.serviceUrl + 'budgetAllocation/getDataBudgetAllocation',
    getAvailableFund: this.serviceUrl + 'budgetAllocation/getAvailableFund',
    fileUpload: this.serviceUrl + 'fileUpload/uploadFile',
    saveBudgetAllocation:
      this.serviceUrl + 'budgetAllocation/saveBudgetAllocation',

    saveBudgetAllocationUnitWise:
      this.serviceUrl + 'budgetAllocation/saveBudgetAllocationUnitWise',

    getUserNameApiUrl:
      'http://localhost:8080/auth/realms/icgrms/protocol/openid-connect/userinfo',

    getMajorData: this.serviceUrl + 'budgetAllocation/getMajorData',

    getBudgetFinYear: this.serviceUrl + 'budgetAllocation/getBudgetFinYear',

    getCgUnitData: this.serviceUrl + 'budgetAllocation/getCgUnitData',

    getAllSubHeadByMajorHead:
      this.serviceUrl + 'budgetAllocation/getAllSubHeadByMajorHead',

    getSubHeadsData: this.serviceUrl + 'budgetAllocation/getSubHeadsData',

    getAllocationTypeData:
      this.serviceUrl + 'budgetAllocation/getAllocationTypeData',

    getDashboardData: this.serviceUrl + 'dashBoard/getDashBoardDta',
    saveContingentBill:
      this.serviceUrl + 'contingentBillController/saveContingentBill',

    updateContingentBill:
      this.serviceUrl + 'contingentBillController/updateContingentBill',

    getCdaData: this.serviceUrl + 'cdaParkingController/getCdaData',

    saveCdaParkingData:
      this.serviceUrl + 'cdaParkingController/saveCdaParkingData',

    getAllUser: this.serviceUrl + 'mangeUser/getAllUser',

    getUserInfo: 'https://icg.net.in/cghrdata/getAllData/getUserInfo',

    getAllRole: this.serviceUrl + 'mangeRoleController/getAllRole',

    createUser: this.serviceUrl + 'mangeUser/createUser',

    budgetAllocationReport:
      this.serviceUrl + 'budgetAllocation/budgetAllocationReport',

    budgetDelete: this.serviceUrl + 'budgetAllocation/budgetDelete',

    updateBudgetAllocation:
      this.serviceUrl + 'budgetAllocation/updateBudgetAllocation',

    inboxlist: this.serviceUrl + 'inboxOutbox/getInboxList',

    outboxlist: this.serviceUrl + 'inboxOutbox/getOutBoxList',

    getCb: this.serviceUrl + 'contingentBillController/getContingentBill',

    getAllStation: this.serviceUrl + 'unitRebaseController/getAllStation',

    saveRebase: this.serviceUrl + 'unitRebaseController/saveRebase',

    getDashBoardDta: this.serviceUrl + 'dashBoard/getDashBoardDta',

    getUiData: this.serviceUrl + 'dashBoard/getUiData',

    fileDownload: this.serviceUrl + 'fileUpload/getFilePath/',
    approveContingentBill:
      this.serviceUrl + 'contingentBillController/approveContingentBill',
  };
}
