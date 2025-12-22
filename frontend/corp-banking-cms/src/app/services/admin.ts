import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/admin/users';
const AUTH_API = '/api/auth/register';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(AUTH_API, user, { responseType: 'text' as 'json' });
  }

  updateStatus(id: string, active: boolean): Observable<any> {
    return this.http.put(`${API_URL}/${id}/status`, { active }, { responseType: 'text' as 'json' });
  }
}
