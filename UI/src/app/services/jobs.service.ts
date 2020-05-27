import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private httpClient: HttpClient) { }

  GetJobDetails(userId= null): Observable<any> {
    const relativeUrl = userId ? 'http://localhost:53138/api/user/jobsposted/' + userId : 'http://localhost:53138/api/user/jobsposted';
    return this.httpClient.get<any>(relativeUrl);
  }

  GetJobSearchTerms(): Observable<any> {
    return this.httpClient.get<any>('http://localhost:53138/api/user/searchstrings');
  }
  GetJobSearchResults(searchTerm, userId): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:53138/api/user/filter/jobs/${searchTerm}/${userId}`);
  }
  SubmitFeedBack(data): Observable<any> {
    return this.httpClient.post<any>('http://localhost:53138/api/user/update/job/status', data);
  }
}
