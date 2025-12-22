import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditRequestListComponent } from './credit-request-list'; 
import { CreditService } from '../../services/credit';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// 1. Mock Credit Service
class MockCreditService {
  getRequests() {
    return of([
      { client: 'ABC Corp', amount: 5000, tenure: 12, status: 'Approved', createdAt: '2023-01-01' },
      { client: 'XYZ Ltd', amount: 10000, tenure: 24, status: 'Pending', createdAt: '2023-02-01' }
    ]);
  }
}

// 2. Mock MatDialog
class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true) // Simulate dialog closing successfully
    };
  }
}

describe('CreditRequestListComponent', () => {
  let component: CreditRequestListComponent;
  let fixture: ComponentFixture<CreditRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreditRequestListComponent, // Import your standalone component
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CreditService, useClass: MockCreditService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditRequestListComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests into the array on init', () => {
    // Check the 'requests' array directly
    expect(component.requests.length).toBe(2);
    expect(component.requests[0].client).toBe('ABC Corp');
  });

  it('should return correct status color', () => {
    // Test the helper function directly
    expect(component.getStatusColor('Approved')).toBe('primary');
    expect(component.getStatusColor('Rejected')).toBe('warn');
    expect(component.getStatusColor('Pending')).toBe('accent');
  });
});