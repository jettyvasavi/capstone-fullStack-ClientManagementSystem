import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreditService } from './credit';

describe('CreditService', () => {
  let service: CreditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreditService]
    });
    service = TestBed.inject(CreditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve requests from the API via GET', () => {
    const dummyRequests = [
      { id: 1, amount: 5000, status: 'PENDING' },
      { id: 2, amount: 10000, status: 'APPROVED' }
    ];

    service.getRequests().subscribe((requests: any[]) => {
      expect(requests.length).toBe(2);
      expect(requests).toEqual(dummyRequests);
    });

    const req = httpMock.expectOne('/api/credit-requests');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRequests);
  });

  it('should create a request via POST', () => {
    const newRequest = { amount: 5000, tenure: 12 };

    service.createRequest(newRequest).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/credit-requests');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRequest);

    req.flush('Request Created Successfully');
  });
});
