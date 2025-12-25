import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private storage: StorageService) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.storage.saveUser(response);
        this.storage.saveToken(response.token);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }

getUser(): any {
  return this.storage.getUser();
}
}
