import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/credit-requests';

@Injectable({ providedIn: 'root' })
export class CreditService {
  constructor(private http: HttpClient) {}

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  createRequest(request: any): Observable<any> {
    return this.http.post(API_URL, request, { responseType: 'text' as 'json' });
  }

  updateStatus(id: string, status: string, remarks: string): Observable<any> {
    return this.http.put(
      `${API_URL}/${id}`,
      { status, remarks },
      { responseType: 'text' as 'json' }
    );
  }
}
