import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ClientService } from '../../services/client';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './client-dialog.html',
  styleUrl: './client-dialog.css'
})
export class ClientDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<ClientDialogComponent>
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      industry: ['', Validators.required],
      address: ['', Validators.required],
      annualTurnover: [0, [Validators.required, Validators.min(0)]],
      documentsSubmitted: [false],
      primaryContact: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required]
      })
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.clientService.onboardClient(this.form.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert('Failed to onboard client')
      });
    }
  }
}
