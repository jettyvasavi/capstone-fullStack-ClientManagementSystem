import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

// ✅ MANUAL MOCKS (No 'jasmine' keyword needed)
class MockAuthService {
  login(data: any) { return of({ token: 'abc', role: 'ADMIN' }); }
}

class MockStorageService {
  saveUser(user: any) {}
  saveToken(token: string) {}
  getUser() { return { role: 'ADMIN' }; }
}

class MockRouter {
  navigate(path: any[]) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    // Inject services to spy on them manually
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should navigate to admin dashboard on successful login', () => {
    // 1. Fill Form
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('password');
    
    // 2. Spy on navigate
    let navigateCalled = false;
    router.navigate = (path) => { navigateCalled = true; return path; };

    // 3. Submit
    component.onSubmit();
expect(navigateCalled).toBe(true);  // ✅ Vitest syntax
  });

  it('should show error on failed login', () => {
    component.loginForm.controls['username'].setValue('wrong');
    component.loginForm.controls['password'].setValue('wrong');

    // Force Error
    authService.login = () => throwError(() => new Error('401'));

    component.onSubmit();

    expect(component.errorMessage).toBeTruthy();
  });
});
