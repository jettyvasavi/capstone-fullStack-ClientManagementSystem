import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let token = window.sessionStorage.getItem('auth-token');

  if (!token) {
    token = window.localStorage.getItem('auth-token');
  }

  if (token) {
    console.log('✅ Interceptor: Attaching Token!', token.substring(0, 10) + '...');
  } else {
    console.warn('⚠️ Interceptor: No Token Found in Storage!');
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
