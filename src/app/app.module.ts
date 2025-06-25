import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { NavbarComponent } from './layout/component/navbar/navbar.component';
import { SidebarComponent } from './layout/component/sidebar/sidebar.component';
import { FooterComponent } from './layout/component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { EvaluationComponent } from './rolepage/auditor/evaluation/evaluation.component';
import { ReportComponent } from './rolepage/auditor/report/report.component';
import { PrequalificationComponent } from './rolepage/auditee/prequalification/prequalification.component';
import { ProfileComponent } from './rolepage/auditee/profile/profile.component';
import { FormsModule } from '@angular/forms'; // Tambahkan ini
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserManagementComponent } from './rolepage/admin/user-management/user-management.component'; // Import HttpClientModule
import { AuthInterceptor } from './services/auth.interceptor';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { AuditorProfileComponent } from './rolepage/auditor/auditor-profile/auditor-profile.component';
import { KriteriaComponent } from './rolepage/auditor/kriteria/kriteria.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuditorLaporanSementaraComponent } from './rolepage/auditor/laporan-sementara/laporan-sementara.component';
import { EvaluationTabComponent } from './rolepage/auditor/evaluation-tab/evaluation-tab.component';
import { LaporanSementaraPdfComponent } from './rolepage/auditor/laporan-sementara-pdf/laporan-sementara-pdf.component';
import { SafePipe } from './safe.pipe'; // Sesuaikan path
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NcrFormComponent } from './rolepage/auditee/ncr-form/ncr-form.component';
import { DashboardLayoutComponent } from './rolepage/auditee/dashboard-layout/dashboard-layout.component';
import { CommonModule } from '@angular/common';
import { LaporanSementaraComponent } from './rolepage/auditee/laporan-sementara/laporan-sementara.component';
@NgModule({
  declarations: [
    AppComponent,
    AuditorLaporanSementaraComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    EvaluationComponent,
    ReportComponent,
    PrequalificationComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    UserManagementComponent,
    ChangePasswordComponent,
    AuditorProfileComponent,
    KriteriaComponent,
    LaporanSementaraComponent,
    EvaluationTabComponent,
    LaporanSementaraPdfComponent,
    SafePipe,
    NcrFormComponent,
    DashboardLayoutComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
