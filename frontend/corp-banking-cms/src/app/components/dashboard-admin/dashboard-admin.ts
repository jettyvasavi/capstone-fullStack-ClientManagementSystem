import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserDialogComponent } from '../user-dialog/user-dialog';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdminComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'role', 'active'];
  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
        this.showSnack('User created successfully');
      }
    });
  }

  toggleStatus(user: any): void {
    const newStatus = !user.active;
    this.adminService.updateStatus(user.id, newStatus).subscribe({
      next: () => {
        user.active = newStatus;
        this.showSnack(`User ${newStatus ? 'Activated' : 'Deactivated'}`);
        this.cd.detectChanges();
      },
      error: () => {
        user.active = !newStatus;
        this.showSnack('Failed to update status');
      }
    });
  }

  showSnack(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
}
