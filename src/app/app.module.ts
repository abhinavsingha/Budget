import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
// import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
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
import { ContigentBillApproverComponent } from './contigent-bill-approver/contigent-bill-approver.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BudgetAllocationReportComponent } from './budget-allocation-report/budget-allocation-report.component';
import { BudgetAllocationSubheadwiseComponent } from './budget-allocation-subheadwise/budget-allocation-subheadwise.component';
import { FormsModule } from '@angular/forms';
import { RevisionComponent } from './revision/revision.component';
import { CdaParkingComponent } from './cda-parking/cda-parking.component';
import { RecieptComponent } from './reciept/reciept.component';
import { UnitRebaseComponent } from './unit-rebase/unit-rebase.component';
import { CdaParkingReportComponent } from './cda-parking-report/cda-parking-report.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DatePipe } from '@angular/common';
import { SharedService } from './services/shared/shared.service';
import { SearchPipePipe } from './services/searchPipe/search-pipe.pipe';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CbVerificationComponent } from './cb-verification/cb-verification.component';
import { ApprovedBudgetComponent } from './approved-budget/approved-budget.component';
import { SearchPipeRecieptPipe } from './services/search-pipe-reciept/search-pipe-reciept.pipe';
import { ManageUserRoleComponent } from './manage-user-role/manage-user-role.component';
import { SearchUserPipePipe } from './services/search-user/search-user-pipe.pipe';
import { RevisionApprovalComponent } from './revision-approval/revision-approval.component';

// import { DialogComponent } from './dialog/dialog.component';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatDialogModule } from '@angular/material/dialog';

// function initializeKeycloak(keycloak: KeycloakService) {
//   return () =>
//     keycloak.init({
//       config: {
//         url: 'http://localhost:8080/auth',
//         realm: 'icgrms',
//         clientId: 'budget',
//       },
//       initOptions: {
//         onLoad: 'login-required',
//         flow: 'standard',
//       },
//     });
// }

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        // url: 'http://localhost:8080/auth',
        url: 'https://icg.net.in/auth/',
        realm: 'icgrms',
        clientId: 'budget',
      },
      initOptions: {
        onLoad: 'login-required',
        flow: 'standard',
        checkLoginIframe: false,
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    BudgetAllocationComponent,
    BudgetUpdateComponent,
    BudgetDeleteComponent,
    InboxComponent,
    OutboxComponent,
    BudgetApproverComponent,
    LoginComponent,
    NewContigentBillComponent,
    ManageUserComponent,
    ContigentBillApproverComponent,
    BudgetAllocationReportComponent,
    BudgetAllocationSubheadwiseComponent,
    RevisionComponent,
    RevisionApprovalComponent,
    CdaParkingComponent,
    RecieptComponent,
    UnitRebaseComponent,
    SearchPipePipe,
    CdaParkingReportComponent,
    CbVerificationComponent,
    ApprovedBudgetComponent,
    SearchPipeRecieptPipe,
    ManageUserRoleComponent,
    SearchUserPipePipe,
    // DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    NgxExtendedPdfViewerModule,
    // MatIconModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatDialogModule,
    // MatTableModule,
    // NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
  ],
  providers: [
    SharedService,
    DatePipe,
    SearchPipePipe,
    SearchPipeRecieptPipe,
    SearchUserPipePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

interface NgxSpinnerConfig {
  type?: string;
}
