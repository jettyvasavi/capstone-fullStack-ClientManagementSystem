import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { CreditService } from '../../services/credit';
import { ReviewDialogComponent } from '../review-dialog/review-dialog';

@Component({
  selector: 'app-dashboard-analyst',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './dashboard-analyst.html',
  styleUrl: './dashboard-analyst.css'
})
export class DashboardAnalystComponent implements OnInit {
  displayedColumns: string[] = ['client', 'amount', 'tenure', 'status', 'actions'];
  requests: any[] = [];

  constructor(
    private creditService: CreditService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.creditService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading requests', err)
    });
  }

  openReviewDialog(request: any): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: request
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRequests();
      }
    });
  }
}
