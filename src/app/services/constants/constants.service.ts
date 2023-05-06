import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}

  // serviceUrl = 'https://icg.net.in/budget/'; //prod
  // serviceUrl = 'http://488e-203-153-42-234.ngrok.io/'; //dev
  // serviceUrl = 'http://192.168.1.131:1111/'; //dev
  serviceUrl = 'https://icg.net.in/budget/';
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
      this.serviceUrl + 'budgetAllocation/getAllocationType',

    getDashboardData: this.serviceUrl + 'dashBoard/getDashBoardDta',
    saveContingentBill:
      this.serviceUrl + 'contingentBillController/saveContingentBill',

    updateContingentBill:
      this.serviceUrl + 'contingentBillController/updateContingentBill',

    getCdaData: this.serviceUrl + 'cdaParkingController/getCdaData',

    saveCdaParkingData:
      this.serviceUrl + 'cdaParkingController/saveCdaParkingData',

    updateCdaParkingData:
      this.serviceUrl + 'cdaParkingController/updateCdaParkingData',

    getAllUser: this.serviceUrl + 'mangeUser/getAllUser',

    getUserInfo: 'https://icg.net.in/cghrdata/getAllData/getUserInfo',

    getAllRole: this.serviceUrl + 'mangeRoleController/getAllRole',

    createUser: this.serviceUrl + 'mangeUser/createUser',

    budgetAllocationReport:
      this.serviceUrl + 'budgetAllocation/budgetAllocationReport',

    getAllocationReport:
      this.serviceUrl + 'reportController/getAllocationReport',

    budgetDelete: this.serviceUrl + 'budgetAllocation/budgetDelete',

    updateBudgetAllocation:
      this.serviceUrl + 'budgetAllocation/updateBudgetAllocation',

    inboxlist: this.serviceUrl + 'inboxOutbox/getInboxList',

    outboxlist: this.serviceUrl + 'inboxOutbox/getOutBoxList',

    getCb: this.serviceUrl + 'contingentBillController/getContingentBill',

    getAllStation: this.serviceUrl + 'unitRebaseController/getAllStation',

    saveRebase: this.serviceUrl + 'unitRebaseController/saveUnitRebase',

    getDashBoardDta: this.serviceUrl + 'dashBoard/getDashBoardDta',

    getUiData: this.serviceUrl + 'dashBoard/getUiData',

    fileDownload: this.serviceUrl + 'fileUpload/getFilePath/',

    approveContingentBill:
      this.serviceUrl + 'contingentBillController/approveContingentBill',

    getAlGroupId: this.serviceUrl + 'budgetAllocation/getAlGroupId',

    getAllGroupIdAndUnitId:
      this.serviceUrl + 'budgetAllocation/getAllGroupIdAndUnitId',

    approveBudgetOrReject:
      this.serviceUrl + 'budgetAllocation/approveBudgetOrReject',

    getAllocationReportRevised:
      this.serviceUrl + 'reportController/getAllocationReportRevised',

    updateUserRole: this.serviceUrl + 'mangeUser/updateUserRole',

    getCbRevisedReport: this.serviceUrl + 'reportController/getCbRevisedReport',

    updateFinalStatus:
      this.serviceUrl + 'contingentBillController/updateFinalStatus',

    getFilterData: this.serviceUrl + 'budgetFilterApi/getFilterData',

    saveFilterData: this.serviceUrl + 'budgetFilterApi/saveFilterData',

    deleteDataByPid: this.serviceUrl + 'budgetFilterApi/deleteDataByPid',

    deleteData: this.serviceUrl + 'budgetFilterApi/deleteData',

    getAvailableFundData:
      this.serviceUrl + 'budgetAllocation/getAvailableFundData',

    getBudgetRevisionData:
      this.serviceUrl + 'budgetAllocation/getBudgetRevisionData',

    getCdaParkingReport:
      this.serviceUrl + 'reportController/getCdaParkingReport',

    getBudgetReciptFilter:
      this.serviceUrl + 'budgetRecipet/getBudgetReciptFilter',

    budgetRecipetSave: this.serviceUrl + 'budgetRecipet/budgetRecipetSave',

    getBudgetRecipt: this.serviceUrl + 'budgetRecipet/getBudgetRecipt',

    getCdaUnitList: this.serviceUrl + 'cdaParkingController/getCdaUnitList',

    verifyContingentBill:
      this.serviceUrl + 'contingentBillController/verifyContingentBill',

    getCgUnitDataWithPurposeCode:
      this.serviceUrl + 'budgetAllocation/getCgUnitDataWithPurposeCode',

    getAllUnitRebaseData:
      this.serviceUrl + 'unitRebaseController/getAllUnitRebaseData',

    getAvailableFundFindByUnitIdAndFinYearId:
      this.serviceUrl +
      'budgetAllocation/getAvailableFundFindByUnitIdAndFinYearId',

    saveBudgetRevisionData:
      this.serviceUrl + 'budgetAllocation/saveBudgetRevision',

    saveAuthData: this.serviceUrl + 'budgetAllocation/saveAuthData',

    deActivateUser: this.serviceUrl + 'mangeUser/deActivateUser',

    getUnitWiseAllocationReport:
      this.serviceUrl + 'reportController/getUnitWiseAllocationReport',

    getSubHeadWiseAllocationReport:
      this.serviceUrl + 'reportController/getSubHeadWiseAllocationReport',

    getBEAllocationReport:
      this.serviceUrl + 'reportController/getBEAllocationReport',

    getREAllocationReport:
      this.serviceUrl + 'reportController/getREAllocationReport',

    showAllAmountUnit: this.serviceUrl + 'dashBoard/showAllAmountUnit',

    getSubHeadType: this.serviceUrl + 'budgetAllocation/getSubHeadType',

    getModData: this.serviceUrl + 'budgetRecipet/getModData',

    getCdaDataList: this.serviceUrl + 'cdaParkingController/getCdaDataList', getContingentBillReport: this.serviceUrl+'reportController/getContingentBillReport',
    updateInboxOutBox: this.serviceUrl+'dashBoard/updateInboxOutBox'

  };
}
