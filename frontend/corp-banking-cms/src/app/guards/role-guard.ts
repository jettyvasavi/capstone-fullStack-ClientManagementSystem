import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  const expectedRoles = route.data['roles'] as Array<string>;

  if (authService.isLoggedIn() && user && expectedRoles.includes(user.role)) {
    return true; 
  }
  
  alert('Unauthorized! You do not have the required permissions.');
  router.navigate(['/login']); 
  return false;
};
