import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-laporan-sementara',
  templateUrl: './laporan-sementara.component.html',
  styleUrls: ['./laporan-sementara.component.css']
})
export class LaporanSementaraComponent implements OnInit {
  laporan: any = null;
  prequalification: any = null;
  perusahaan: any = null;
  auditee: any = null;
  loading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId(); // Pastikan method ini sesuai dengan AuthService kamu
    if (!userId) {
      this.loading = false;
      return;
    }

    // 1. Ambil perusahaan berdasarkan userId
    this.userService.getPerusahaanByUserId(userId).pipe(
      map(perusahaans => Array.isArray(perusahaans) ? perusahaans[0] : perusahaans),
      switchMap(perusahaan => {
        this.perusahaan = perusahaan;
        if (!perusahaan || !perusahaan._id) {
          this.loading = false;
          return of(null);
        }
        // 2. Ambil auditee berdasarkan perusahaan
        return this.userService.getAuditeeByPerusahaan(perusahaan._id.$oid || perusahaan._id).pipe(
          map(auditees => Array.isArray(auditees) ? auditees[0] : auditees),
          switchMap(auditee => {
            this.auditee = auditee;
            if (!auditee || !auditee._id) {
              this.loading = false;
              return of(null);
            }
            // 3. Ambil prequalification berdasarkan auditee dan perusahaan
            return this.userService.getPrequalificationByAuditee(
              auditee._id.$oid || auditee._id,
              perusahaan._id.$oid || perusahaan._id
            ).pipe(
              map(preqs => Array.isArray(preqs) ? preqs[0] : preqs),
              switchMap(prequalification => {
                this.prequalification = prequalification;
                if (!prequalification || !prequalification._id) {
                  this.loading = false;
                  return of(null);
                }
                // 4. Ambil laporan sementara berdasarkan prequalification._id (ID_Audit)
                return this.userService.getLaporanSementaraByAudit(
                  prequalification._id.$oid || prequalification._id
                );
              })
            );
          })
        );
      }),
      catchError(err => {
        this.loading = false;
        return of(null);
      })
    ).subscribe({
      next: (laporan) => {
        this.laporan = laporan;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
