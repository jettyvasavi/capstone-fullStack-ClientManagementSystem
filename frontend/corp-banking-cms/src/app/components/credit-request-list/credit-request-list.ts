import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../services/credit';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreditDialogComponent } from '../credit-dialog/credit-dialog';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-credit-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './credit-request-list.html',
  styleUrl: './credit-request-list.css'
})
export class CreditRequestListComponent implements OnInit {
  displayedColumns: string[] = ['client', 'amount', 'tenure', 'status', 'createdAt'];
  requests: any[] = [];

  constructor(private creditService: CreditService, private dialog: MatDialog,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.creditService.getRequests().subscribe({
      next: (data) => {
        this.requests = data,
        this.cd.detectChanges();

        },
      error: (err) => console.error('Error loading requests', err)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreditDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadRequests();
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved': return 'primary';
      case 'Rejected': return 'warn';
      default: return 'accent';
    }
  }
}
