import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BudgetAllocationComponent } from './budget-allocation/budget-allocation.component';
import { BudgetUpdateComponent } from './budget-update/budget-update.component';
import { BudgetDeleteComponent } from './budget-delete/budget-delete.component';
import { InboxComponent } from './inbox/inbox.component';
import { OutboxComponent } from './outbox/outbox.component';
import { BudgetApproverComponent } from './budget-approver/budget-approver.component';
import { LoginComponent } from './login/login.component';
import { NewContigentBillComponent } from './new-contigent-bill/new-contigent-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { BudgetAllocationReportComponent } from './budget-allocation-report/budget-allocation-report.component';
import { ContigentBillApproverComponent } from './contigent-bill-approver/contigent-bill-approver.component';
import { BudgetAllocationSubheadwiseComponent } from './budget-allocation-subheadwise/budget-allocation-subheadwise.component';
import { RevisionComponent } from './revision/revision.component';
import { CdaParkingComponent } from './cda-parking/cda-parking.component';
import { RecieptComponent } from './reciept/reciept.component';
import { UnitRebaseComponent } from './unit-rebase/unit-rebase.component';
import { CdaParkingReportComponent } from './cda-parking-report/cda-parking-report.component';
import { CbVerificationComponent } from './cb-verification/cb-verification.component';
import { ApprovedBudgetComponent } from './approved-budget/approved-budget.component';
import { ManageUserRoleComponent } from './manage-user-role/manage-user-role.component';
import {RevisionApprovalComponent} from "./revision-approval/revision-approval.component";

const routes: Routes = [
  // { path: '', component: LoginComponent },
  // { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: DashboardComponent },
  { path: 'budget-allocation', component: BudgetAllocationComponent },
  { path: 'budget-update', component: BudgetUpdateComponent },
  { path: 'budget-delete', component: BudgetDeleteComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'outbox', component: OutboxComponent },
  { path: 'budget-approval', component: BudgetApproverComponent },
  { path: 'new-contigent-bill', component: NewContigentBillComponent },
  { path: 'manage-users', component: ManageUserComponent },
  {
    path: 'budget-allocation-report',
    component: BudgetAllocationReportComponent,
  },
  {
    path: 'contingent-bill-aprover',
    component: ContigentBillApproverComponent,
  },
  {
    path: 'cb-verification',
    component: CbVerificationComponent,
  },
  {
    path: 'budget-allocation-subheadwise',
    component: BudgetAllocationSubheadwiseComponent,
  },
  {
    path: 'revision',
    component: RevisionComponent,
  },
  {
    path: 'revision-approval',
    component: RevisionApprovalComponent,
  },
  {
    path: 'cda-parking',
    component: CdaParkingComponent,
  },
  // {
  //   path: '',
  //   component: RecieptComponent,
  // },
  {
    path: 'reciept',
    component: RecieptComponent,
  },
  {
    path: 'unit-rebase',
    component: UnitRebaseComponent,
  },
  { path: 'cda-parking-report', component: CdaParkingReportComponent },
  { path: 'budget-approved', component: ApprovedBudgetComponent },
  { path: 'manage-user-role', component: ManageUserRoleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
