import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ReportComponent } from './rolepage/auditor/report/report.component';
import { PrequalificationComponent } from './rolepage/auditee/prequalification/prequalification.component';
import { ProfileComponent } from './rolepage/auditee/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard'; // Buat guard ini
import { UserManagementComponent } from './rolepage/admin/user-management/user-management.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { AuditorProfileComponent } from './rolepage/auditor/auditor-profile/auditor-profile.component';
import { KriteriaComponent } from './rolepage/auditor/kriteria/kriteria.component';
import { EvaluationTabComponent } from './rolepage/auditor/evaluation-tab/evaluation-tab.component';
import { DashboardLayoutComponent } from './rolepage/auditee/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Hanya bisa diakses jika sudah login
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'auditee/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'auditor/profile', component: AuditorProfileComponent, canActivate: [AuthGuard] },
  { path: 'auditor/evaluation', component: EvaluationTabComponent, canActivate: [AuthGuard] },
  { path: 'auditor/kriteria', component: KriteriaComponent, canActivate: [AuthGuard] },
  { path: 'auditor/report', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'auditee/prequalification', component: PrequalificationComponent, canActivate: [AuthGuard] },
  { path: 'auditee/result', component: DashboardLayoutComponent, canActivate: [AuthGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Fallback jika route tidak ditemukan
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
