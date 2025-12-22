import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CreditService } from '../../services/credit';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './review-dialog.html'
})
export class ReviewDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // This is the request passed from the table
  ) {
    this.form = this.fb.group({
      status: ['Approved', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Backend expects: ID, Status, Remarks
      this.creditService.updateStatus(
        this.data.id, 
        this.form.value.status, 
        this.form.value.remarks
      ).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert('Failed to update status')
      });
    }
  }
}
