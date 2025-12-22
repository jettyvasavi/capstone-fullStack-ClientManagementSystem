import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/clients';
const RM_API_URL = '/api/rm/clients';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getMyClients(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  onboardClient(clientData: any): Observable<any> {
    return this.http.post(RM_API_URL, clientData, { responseType: 'text' as 'json' });
  }
}
