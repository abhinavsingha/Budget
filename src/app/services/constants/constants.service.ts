import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}

  serverRedirectUrl = 'https://icg.net.in/'; //For Production Server
  serviceUrl = 'https://icg.net.in/cgbudget/'; //Production server
  // serviceUrl = 'https://icg.net.in/budget/'; //UAT server
  // serviceUrl = 'http://10.3.8.81:1111/';
  // serviceUrl = 'http://172.20.10.2:1111/';
  // serviceUrl = 'http://192.168.2.13:1111/';
  // serviceUrl = 'http://192.168.43.200:1111/';
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

    getCgUnitWithoutMOD:
      this.serviceUrl + 'budgetAllocation/getCgUnitWithoutMOD',

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

    getCdaDataUnitWise: this.serviceUrl + 'cdaParkingController/getCdaDataunitwise',

    saveCdaParkingData:
      this.serviceUrl + 'cdaParkingController/saveCdaParkingData',

    updateCdaParkingData:this.serviceUrl + 'cdaParkingController/updateCda',
      // this.serviceUrl + 'cdaParkingController/updateCdaParkingData',

    getAllUser: this.serviceUrl + 'mangeUser/getAllUser',

    getUserInfo: 'https://icg.net.in/cghrdata/getAllData/getUserInfo',

    getAllRole: this.serviceUrl + 'mangeRoleController/getAllRole',

    createUser: this.serviceUrl + 'mangeUser/createUser',

    userExit: this.serviceUrl + 'mangeUser/userExit',

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

    saveUnitRebase: this.serviceUrl + 'unitRebaseController/saveUnitRebase',

    getDashBoardDta: this.serviceUrl + 'dashBoard/getDashBoardDta',

    getUiData: this.serviceUrl + 'dashBoard/getUiData',

    fileDownload: this.serviceUrl + 'fileUpload/getFilePath/',

    approveContingentBill:
      this.serviceUrl + 'contingentBillController/approveContingentBill',

    getAlGroupId: this.serviceUrl + 'budgetAllocation/getAlGroupId',

    getAllGroupIdAndUnitId:
      this.serviceUrl + 'budgetAllocation/getAllGroupIdAndUnitId',


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

    updateRecipetSave: this.serviceUrl + 'budgetRecipet/updateRecipetSave',

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

    getBEREAllocationReport:
      this.serviceUrl + 'reportController/getBEREAllocationReport',

    showAllAmountUnit: this.serviceUrl + 'dashBoard/showAllAmountUnit',

    getSubHeadType: this.serviceUrl + 'budgetAllocation/getSubHeadType',

    getModData: this.serviceUrl + 'budgetRecipet/getModData',

    getCdaDataList: this.serviceUrl + 'cdaParkingController/getCdaDataList',

    getContingentBillReport:
      this.serviceUrl + 'reportController/getContingentBillReport',

    getUnitRebaseReport:
      this.serviceUrl + 'reportController/getUnitRebaseReport',

    updateInboxOutBox: this.serviceUrl + 'dashBoard/updateInboxOutBox',


    getAllRevisionGroupId:
      this.serviceUrl + 'budgetAllocation/getAllRevisionGroupId',

    getAllCgUnitData: this.serviceUrl + 'budgetAllocation/getAllCgUnitData',

    getMainBEAllocationReport:
      this.serviceUrl + 'reportController/getMainBEAllocationReport',

    getApprovedFilePath: this.serviceUrl + 'fileUpload/getApprovedFilePath',

    getSubHeadWiseExpenditureByUnitIdFinYearIdAllocationTypeIdSubHeadTypeId:
      this.serviceUrl +
      'dashBoard/getSubHeadWiseExpenditureByUnitIdFinYearIdAllocationTypeIdSubHeadTypeId',

    saveBudgetAllocationSubHeadWise:
      this.serviceUrl + 'budgetAllocation/saveBudgetAllocationSubHeadWise',

    getApprovedList: this.serviceUrl + 'inboxOutbox/getApprovedList',

    getApprovedListData: this.serviceUrl + 'inboxOutbox/getApprovedListData',

    getAllCda: this.serviceUrl + 'budgetRecipet/getAllCda',

    getAllIsShipCgUnitData:
      this.serviceUrl + 'unitRebaseController/getAllIsShipCgUnitData',

    getAllocationByFinYear:
      this.serviceUrl + 'budgetAllocation/getAllocationByFinYear',

    updateAllocation: this.serviceUrl + 'budgetAllocation/updateAllocation',
    getRevisedAllocationReport:
      this.serviceUrl + 'reportController/getRevisedAllocationReportPdf',
    getRevisedAllocationAprReport:
      this.serviceUrl + 'reportController/getRevisedAllocationAprReport',
    getAllocationReportDoc:
      this.serviceUrl + 'reportController/getAllocationReportDoc',
    getCdaParkingReportDoc:
      this.serviceUrl + 'reportController/getCdaParkingReportDoc',
    getUserManual: this.serviceUrl + 'fileUpload/getUserManual', getReceiptReport: this.serviceUrl +'reportController/getReceiptReport',
    getMAAllocationReport: this.serviceUrl +'reportController/getMAAllocationReport',
    getConsolidateReceiptReport: this.serviceUrl +'reportController/getConsolidateReceiptReport',
    getDashBordSubHeadwiseExpenditure: this.serviceUrl+'dashBoard/getDashBordSubHeadwiseExpenditure',
    getReservedFund: this.serviceUrl+'reportController/getReservedFund',
    getAllGroupIdAndUnitIdRevisionCase: this.serviceUrl+'budgetAllocation/getAllGroupIdAndUnitIdRevisionCase',
    getMaxSectionNumber: this.serviceUrl+'contingentBillController/getMaxSectionNumber',
    saveBudgetAllocationSubHeadWiseEdit: this.serviceUrl+'budgetAllocation/saveBudgetAllocationSubHeadWiseEdit',
    getReceiptReportRevision: this.serviceUrl+'reportController/getReceiptReportRevision',
    getContingentBillAll: this.serviceUrl+'reportController/getContingentBillAll',
    getUnitRebaseNotificationData: this.serviceUrl+'unitRebaseController/getUnitRebaseNotificationData',


    saveAuthDataRevision: this.serviceUrl+'budgetAllocation/saveAuthDataRevisionSaveCbAsAllocation',
    saveBudgetRevisionData:this.serviceUrl + 'budgetAllocation/saveBudgetRevision',
    approveRevisionBudgetOrReject:this.serviceUrl + 'budgetAllocation/approveRevisionBudgetOrReject',
    saveCdaParkingDataForRebase: this.serviceUrl+'cdaParkingController/saveCdaParkingDataForRebase',
    updateMsgStatusMain: this.serviceUrl+'inboxOutbox/updateMsgStatusMain',
    getOldCdaDataForRebase: this.serviceUrl+'cdaParkingController/getOldCdaDataForRebase',
    getAllSubHeadList: this.serviceUrl+'budgetAllocation/getAllSubHeadList',
    getIsShipCgUnit: this.serviceUrl+'unitRebaseController/getIsShipCgUnit',
    budgetApprove: this.serviceUrl + 'budgetAllocation/budgetApprove',
    budgetReject: this.serviceUrl + 'budgetAllocation/budgetReject',
    moveToArchive: this.serviceUrl+'inboxOutbox/moveToArchive',
    getRevisionReportExcel: this.serviceUrl+'reportController/getRevisionReportExcel',
    getReceiptReportNew: this.serviceUrl+'reportController/getRevisedAllocationAprReportDoc',
    transferCbBill: this.serviceUrl+'contingentBillController/transferCbBill',
    cdaHistoryData: this.serviceUrl+'cdaParkingController/getCdaHistoryData',
    getAllBillCdaAndAllocationSummery: this.serviceUrl+'cdaParkingController/getAllBillCdaAndAllocationSummery',
    getAllBillCdaAndAllocationSummeryUnit: this.serviceUrl+'cdaParkingController/getAllBillCdaAndAllocationSummeryunit',
    inboxListMain: this.serviceUrl + 'inboxOutbox/getInboxListMain',
    outBoxListMain: this.serviceUrl + 'inboxOutbox/getOutBoxListMain',
    archiveListMain: this.serviceUrl + 'inboxOutbox/getArchiveListMain',
    approvedListMain: this.serviceUrl + 'inboxOutbox/getApprovedListMain'


  };
}
