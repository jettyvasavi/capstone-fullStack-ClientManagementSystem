import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CreditService } from '../../services/credit';
import { ClientService } from '../../services/client';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-credit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './credit-dialog.html'
})
export class CreditDialogComponent implements OnInit {
  form: FormGroup;
  myClients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private creditService: CreditService,
    private clientService: ClientService,
    public dialogRef: MatDialogRef<CreditDialogComponent>
  ) {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      requestAmount: ['', [Validators.required, Validators.min(1)]],
      tenureMonths: ['', [Validators.required, Validators.min(1)]],
      purpose: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clientService.getMyClients().subscribe(data => this.myClients = data);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.creditService.createRequest(this.form.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert('Failed to create request')
      });
    }
  }
}
