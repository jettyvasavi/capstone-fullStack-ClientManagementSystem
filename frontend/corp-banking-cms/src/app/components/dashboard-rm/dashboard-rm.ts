import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientDialogComponent } from '../client-dialog/client-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard-rm',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard-rm.html',
  styleUrl: './dashboard-rm.css'
})
export class DashboardRmComponent implements OnInit {
  displayedColumns: string[] = ['companyName', 'industry', 'city', 'contact', 'turnover'];
  clients: any[] = [];

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getMyClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading clients', err)
    });
  }

  openOnboardDialog(): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClients();
        this.snackBar.open('Client onboarded successfully!', 'Close', { duration: 3000 });
      }
    });
  }
}
